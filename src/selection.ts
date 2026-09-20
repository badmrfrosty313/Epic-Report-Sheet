import type {
  IcuFixture,
  ReportField,
  ReportState,
} from "./types";
import {
  calculateAge,
  field,
  missing,
  oneObservation,
  usableStatus,
  valueText,
} from "./selectionUtils";
import {
  selectAbdomen,
  selectEdema,
  selectGcs,
  selectLung,
  selectNihss,
  selectOrientation,
  selectOxygen,
  selectPain,
  selectPulsePair,
  selectPupils,
  selectShiftUop,
  selectStrength,
  selectVent,
} from "./assessmentSelectors";
import {
  activeLdas,
  dripFields,
  ldaFields,
  selectAllergies,
  selectBgmSlot,
  selectCodeStatus,
  selectEnteralAccess,
  selectAllLabs,
  selectLocation,
  selectNutrition,
  selectRadiologyReports,
  selectShiftIo,
  selectUrinaryDevice,
} from "./supportSelectors";

function sourceTimes(fixture: IcuFixture): Map<string, string> {
  const times = new Map<string, string>();

  for (const obs of fixture.observations) {
    if (obs.effective_time) times.set(obs.id, obs.effective_time);
  }
  for (const lab of fixture.lab_results) {
    const value = lab.effective_time ?? lab.issued_time;
    if (value) times.set(lab.id, value);
  }
  for (const lda of fixture.ldas) {
    const value = lda.effective_period?.start ?? lda.placement_time;
    if (value) times.set(lda.id, value);
  }
  for (const order of fixture.nutrition_orders) {
    if (order.ordered_at) times.set(order.id, order.ordered_at);
  }
  for (const admin of fixture.medication_administrations) {
    const value = admin.effective_period?.start ?? admin.effective_time;
    if (value) times.set(admin.id, value);
  }
  for (const report of fixture.radiology_reports) {
    const value = report.effective_time ?? report.issued_time;
    if (value) times.set(report.id, value);
  }
  for (const handoff of fixture.handoff_fields) {
    if (handoff.authored_at) times.set(handoff.id, handoff.authored_at);
  }
  for (const intervention of fixture.nursing_interventions) {
    if (intervention.performed_time) {
      times.set(intervention.id, intervention.performed_time);
    }
  }
  for (const annotation of fixture.manual_report_annotations) {
    if (annotation.created_at) times.set(annotation.id, annotation.created_at);
  }
  for (const code of fixture.code_status) {
    if (code.effective_period?.start) {
      times.set(code.id, code.effective_period.start);
    }
  }

  return times;
}

function isReportField(value: unknown): value is ReportField<unknown> {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ReportField<unknown>>;
  return (
    "provenance" in candidate &&
    "sourceIds" in candidate &&
    Array.isArray(candidate.sourceIds) &&
    "value" in candidate
  );
}

function decorateTiming(report: ReportState, fixture: IcuFixture): void {
  const times = sourceTimes(fixture);
  const shiftStart = Date.parse(fixture.report_config.shift_start);

  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!value || typeof value !== "object") return;

    if (isReportField(value)) {
      if (!value.observedAt) {
        const candidates = value.sourceIds
          .map((id) => times.get(id))
          .filter((item): item is string => Boolean(item))
          .sort((a, b) => Date.parse(b) - Date.parse(a));

        if (candidates[0]) value.observedAt = candidates[0];
      }

      if (!value.freshness) {
        if (!value.observedAt) {
          value.freshness = "unknown";
        } else {
          value.freshness =
            Date.parse(value.observedAt) >= shiftStart
              ? "this-shift"
              : "pre-shift";
        }
      }
      return;
    }

    Object.values(value as Record<string, unknown>).forEach(visit);
  };

  visit(report);
}

export function buildReportState(fixture: IcuFixture): ReportState {
  const reportTime = fixture.report_config.report_time;
  const weight = oneObservation(fixture, "WEIGHT");
  const rhythm = oneObservation(fixture, "cardiac.rhythm");
  const urine = oneObservation(fixture, "gu.assessment.urine_character");

  const diagnoses = fixture.encounter_diagnoses
    .filter(
      (item) =>
        item.encounter_ref === fixture.encounter.id &&
        item.clinical_status !== "inactive",
    )
    .map((item) => item.code.display ?? item.code.code ?? item.id);

  const pmh = fixture.medical_history
    .filter((item) => item.clinical_status !== "inactive")
    .map((item) => item.code.display ?? item.code.code ?? item.id);

  const io = selectShiftIo(fixture);
  const todo = fixture.handoff_fields
    .filter(
      (item) =>
        item.encounter_ref === fixture.encounter.id &&
        item.status === "current" &&
        item.content_text &&
        (item.purpose ?? "").toLowerCase().includes("to do"),
    )
    .map((item) =>
      field(item.content_text!, "source", [item.id]),
    );

  const report: ReportState = {
    reportTime,
    header: {
      location: selectLocation(fixture),
      patientName: fixture.patient.display_name
        ? field(fixture.patient.display_name, "source", [fixture.patient.id])
        : missing("Name unavailable"),
      age: fixture.patient.birth_date
        ? field(
            calculateAge(fixture.patient.birth_date, reportTime),
            "derived",
            [fixture.patient.id],
          )
        : missing("DOB unavailable"),
      weight: weight
        ? field(valueText(weight.value), "source", [weight.id])
        : missing("Weight unavailable"),
      codeStatus: selectCodeStatus(fixture),
      diagnoses: field(
        diagnoses,
        "source",
        fixture.encounter_diagnoses.map((item) => item.id),
      ),
      pmh: field(
        pmh,
        "source",
        fixture.medical_history.map((item) => item.id),
      ),
      allergies: selectAllergies(fixture),
    },
    neuro: {
      orientation: selectOrientation(fixture),
      pupils: selectPupils(fixture),
      gcs: selectGcs(fixture),
      strength: selectStrength(fixture),
      nihss: selectNihss(fixture),
    },
    cardiac: {
      rhythm: rhythm
        ? field(valueText(rhythm.value), "source", [rhythm.id])
        : missing("Rhythm not documented"),
      radial: selectPulsePair(
        fixture,
        (obs) => obs.body_site === "radial",
      ),
      pedal: selectPulsePair(
        fixture,
        (obs) =>
          ["dorsalis_pedis", "posterior_tibial"].includes(
            obs.body_site ?? "",
          ),
      ),
      edema: selectEdema(fixture),
    },
    respiratory: {
      oxygen: selectOxygen(fixture),
      rul: selectLung(fixture, "RUL"),
      rml: selectLung(fixture, "RML"),
      rll: selectLung(fixture, "RLL"),
      lul: selectLung(fixture, "LUL"),
      lll: selectLung(fixture, "LLL"),
      vent: selectVent(fixture),
    },
    gi: {
      abdomen: selectAbdomen(fixture),
      nutrition: selectNutrition(fixture),
      enteralAccess: selectEnteralAccess(fixture),
    },
    gu: {
      urine: urine
        ? field(valueText(urine.value), "source", [urine.id])
        : missing("Urine not documented"),
      device: selectUrinaryDevice(fixture),
      shiftUop: selectShiftUop(fixture),
    },
    io,
    ldas: ldaFields(fixture),
    drips: dripFields(fixture),
    bgm: Object.fromEntries(
      fixture.report_config.bgm_slots.map((slot) => [
        slot.key,
        selectBgmSlot(fixture, slot),
      ]),
    ),
    pain: selectPain(fixture),
    labs: selectAllLabs(fixture),
    radiology: selectRadiologyReports(fixture),
    treatment: {
      todo,
      handoff: fixture.handoff_fields
        .filter(
          (item) =>
            item.encounter_ref === fixture.encounter.id &&
            item.status === "current" &&
            item.content_text &&
            !(item.purpose ?? "").toLowerCase().includes("to do"),
        )
        .map((item) =>
          field(
            `${item.purpose ?? item.title ?? "Handoff"}: ${item.content_text}`,
            "source",
            [item.id],
          ),
        ),
      interventions: fixture.nursing_interventions
        .filter(
          (item) =>
            item.encounter_ref === fixture.encounter.id &&
            item.status === "completed",
        )
        .map((item) =>
          field(
            `${item.code.display ?? item.code.code ?? "Intervention"}${
              item.performed_time
                ? ` at ${item.performed_time.slice(11, 16)}`
                : ""
            }`,
            "source",
            [item.id],
          ),
        ),
      annotations: fixture.manual_report_annotations
        .filter((item) => item.report_context_id === fixture.fixture_id)
        .map((item) => field(item.text, "report-only", [item.id])),
    },
    audit: {
      excludedIds: [
        ...fixture.observations
          .filter((item) => !usableStatus(item.status))
          .map((item) => item.id),
        ...fixture.lab_results
          .filter((item) => !usableStatus(item.status))
          .map((item) => item.id),
        ...fixture.ldas
          .filter((item) => item.status !== "active")
          .map((item) => item.id),
        ...fixture.medication_administrations
          .filter((item) => item.status !== "in-progress")
          .map((item) => item.id),
        ...fixture.nutrition_orders
          .filter((item) => item.status !== "active")
          .map((item) => item.id),
        ...fixture.radiology_reports
          .filter((item) => !usableStatus(item.status))
          .map((item) => item.id),
      ],
      derivedKeys: [
        "patient.age_years",
        "neuro.orientation_display",
        "neuro.pupil_display",
        "neuro.gcs_display",
        "neuro.strength_display",
        "cardiac.radial_display",
        "cardiac.pedal_display",
        "cardiac.edema_display",
        "respiratory.oxygen_summary",
        "respiratory.rul_effective",
        "respiratory.rml_effective",
        "respiratory.rll_effective",
        "respiratory.lul_effective",
        "gi.abdomen_summary",
        "gu.shift_uop_ml",
        "pain.current_display",
        ...fixture.report_config.bgm_slots.map(
          (slot) => `bgm.slot_${slot.key}`,
        ),
      ],
    },
  };

  decorateTiming(report, fixture);
  return report;
}
