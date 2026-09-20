import type { IcuFixture, ReportState } from "./types";
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
  selectOrientation,
  selectOxygen,
  selectPain,
  selectPulsePair,
  selectPupils,
  selectShiftUop,
  selectStrength,
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
  selectUrinaryDevice,
} from "./supportSelectors";

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

  return {
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
      nihss: missing("NIHSS not documented in fixture"),
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
      vent: missing("Vent settings not documented in fixture"),
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
      handoff: fixture.handoff_fields
        .filter(
          (item) =>
            item.encounter_ref === fixture.encounter.id &&
            item.status === "current" &&
            item.content_text,
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
}
