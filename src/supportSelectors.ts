import type {
  BgmSlotConfig,
  IcuFixture,
  ReportField,
} from "./types";
import {
  field,
  inPeriod,
  latest,
  latestLab,
  missing,
  observations,
  present,
  time,
  usableStatus,
  valueText,
} from "./selectionUtils";

export function selectLocation(fixture: IcuFixture): ReportField<string> {
  const reportTime = fixture.report_config.report_time;
  const location =
    fixture.encounter.location_history?.find(
      (item) => item.status === "active" && inPeriod(item.period, reportTime),
    ) ?? fixture.encounter.current_location;

  return location?.display
    ? field(
        location.display,
        "source",
        location.source_ref ? [location.source_ref] : [],
      )
    : missing("Location unavailable");
}

export function selectCodeStatus(fixture: IcuFixture): ReportField<string> {
  const selected = latest(
    fixture.code_status.filter(
      (item) =>
        item.status === "active" &&
        present(item.availability) &&
        inPeriod(item.effective_period, fixture.report_config.report_time),
    ),
    (item) => item.effective_period?.start,
  );

  return selected?.display
    ? field(selected.display, "source", [selected.id])
    : missing("Code status unavailable");
}

export function selectNutrition(fixture: IcuFixture): ReportField<string> {
  const order = fixture.nutrition_orders.find(
    (item) =>
      item.status === "active" &&
      item.encounter_ref === fixture.encounter.id &&
      present(item.availability),
  );

  if (!order) return missing("No active nutrition order");
  const enteral = order.enteral_feeding;

  return field(
    enteral
      ? [
          enteral.base_formula ? `Formula: ${enteral.base_formula}` : null,
          enteral.route ? `Route: ${enteral.route}` : null,
          ...(enteral.administration_instructions ?? []),
        ]
          .filter(Boolean)
          .join("\n")
      : "Active nutrition order",
    "source",
    [order.id],
  );
}

export function activeLdas(fixture: IcuFixture) {
  const reportTime = fixture.report_config.report_time;
  return fixture.ldas.filter(
    (item) =>
      item.status === "active" &&
      item.encounter_ref === fixture.encounter.id &&
      present(item.availability) &&
      inPeriod(item.effective_period, reportTime),
  );
}

export function ldaFields(fixture: IcuFixture): ReportField<string>[] {
  return activeLdas(fixture).map((item) => {
    const stage = item.properties?.find(
      (property) => property.code.code === "STAGE",
    );
    return field(
      [
        item.display ?? item.type_code.display ?? item.id,
        stage ? String(stage.value) : null,
      ]
        .filter(Boolean)
        .join("\n"),
      "source",
      [item.id],
    );
  });
}

export function selectEnteralAccess(fixture: IcuFixture): ReportField<string> {
  const item = activeLdas(fixture).find((lda) =>
    ["DHT", "NG", "OG"].includes(lda.type_code.code ?? ""),
  );

  return item
    ? field(
        [
          item.display,
          item.site ? `Site: ${item.site}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        "source",
        [item.id],
      )
    : missing("No active enteral access");
}

export function selectUrinaryDevice(fixture: IcuFixture): ReportField<string> {
  const item = activeLdas(fixture).find(
    (lda) => lda.type_code.code === "FOLEY",
  );
  return item?.display
    ? field(item.display, "source", [item.id])
    : missing("No active urinary device");
}

export function dripFields(fixture: IcuFixture): ReportField<string>[] {
  return fixture.medication_administrations
    .filter(
      (item) =>
        item.status === "in-progress" &&
        item.encounter_ref === fixture.encounter.id &&
        present(item.availability) &&
        inPeriod(item.effective_period, fixture.report_config.report_time),
    )
    .map((item) =>
      field(
        `${item.medication_code?.display ?? item.medication_code?.code ?? "Medication"}: ${
          item.rate
            ? `${item.rate.value}${item.rate.unit ? ` ${item.rate.unit}` : ""}`
            : "rate not documented"
        }`,
        "source",
        [item.id],
        item.device_refs?.length
          ? `Via ${item.device_refs.join(", ")}`
          : undefined,
      ),
    );
}

export function selectBgmSlot(
  fixture: IcuFixture,
  slot: BgmSlotConfig,
): ReportField<string> {
  const candidates = observations(fixture, "bgm.glucose")
    .filter(
      (obs) =>
        time(obs.effective_time) >= time(slot.window_start) &&
        time(obs.effective_time) <= time(slot.window_end),
    )
    .sort(
      (a, b) =>
        Math.abs(time(a.effective_time) - time(slot.target_time)) -
        Math.abs(time(b.effective_time) - time(slot.target_time)),
    );

  const selected = candidates[0];
  return selected
    ? field(valueText(selected.value), "derived", [selected.id])
    : missing("No glucose in slot window");
}

export function selectLab(
  fixture: IcuFixture,
  code: string,
): ReportField<string> {
  const selected = latestLab(fixture, code);
  return selected
    ? field(valueText(selected.value), "source", [selected.id])
    : missing(`${code} not documented`);
}

export function selectHh(fixture: IcuFixture): ReportField<string> {
  const hgb = latestLab(fixture, "HGB");
  const hct = latestLab(fixture, "HCT");

  return hgb && hct
    ? field(
        `${valueText(hgb.value)} / ${valueText(hct.value)}`,
        "derived",
        [hgb.id, hct.id],
      )
    : missing("Hemoglobin or hematocrit missing");
}

export function selectAllergies(fixture: IcuFixture): ReportField<string[]> {
  const current = fixture.allergies.filter(
    (item) =>
      item.clinical_status !== "inactive" &&
      present(item.availability),
  );

  const display = current.map((item) => {
    const reaction = item.reactions?.[0]?.manifestations?.[0]?.display;
    return `${item.substance.display ?? item.substance.code ?? "Allergy"}${
      reaction ? ` - ${reaction}` : ""
    }`;
  });

  return display.length
    ? field(
        display,
        "source",
        current.map((item) => item.id),
      )
    : missing("Allergies not documented");
}


export function selectRadiologyReports(
  fixture: IcuFixture,
): ReportField<string>[] {
  return fixture.radiology_reports
    .filter(
      (report) =>
        report.encounter_ref === fixture.encounter.id &&
        usableStatus(report.status) &&
        present(report.availability) &&
        time(report.effective_time ?? report.issued_time) <=
          time(fixture.report_config.report_time),
    )
    .sort(
      (a, b) =>
        time(b.effective_time ?? b.issued_time) -
        time(a.effective_time ?? a.issued_time),
    )
    .map((report) => {
      const sourceTime = report.effective_time ?? report.issued_time;
      const displayTime = sourceTime
        ? `${sourceTime.slice(5, 10).replace("-", "/")} ${sourceTime.slice(11, 16)}`
        : "time not documented";

      const lines = [
        `Study: ${report.code.display ?? report.code.code ?? "Radiology study"}`,
        `Time: ${displayTime}`,
        report.status ? `Status: ${report.status.toUpperCase()}` : null,
        report.impression ? `Impression: ${report.impression}` : "Impression: not documented",
      ].filter(Boolean);

      return field(
        lines.join("\n"),
        "source",
        [report.id],
        report.findings
          ? "Full findings are preserved in the normalized radiology source record."
          : undefined,
      );
    });
}


export function selectAllLabs(
  fixture: IcuFixture,
): Record<string, ReportField<string>> {
  const preferredOrder = [
    "WBC",
    "RBC",
    "HGB",
    "HCT",
    "PLT",
    "PT",
    "INR",
    "PTT",
    "NA",
    "K",
    "CL",
    "CO2",
    "AGAP",
    "BUN",
    "CREAT",
    "EGFR",
    "CA",
    "ALB",
    "TP",
    "ALT",
    "AST",
    "TBILI",
    "PHOS",
    "MAG",
  ];

  const orderIndex = new Map(
    preferredOrder.map((code, index) => [code, index]),
  );

  const latestByCode = new Map<string, (typeof fixture.lab_results)[number]>();

  for (const lab of fixture.lab_results) {
    if (
      lab.encounter_ref !== fixture.encounter.id ||
      lab.status !== "final" ||
      !usableStatus(lab.status) ||
      !present(lab.availability) ||
      time(lab.effective_time) > time(fixture.report_config.report_time)
    ) {
      continue;
    }

    const sourceKey = [
      lab.code.system ?? "",
      lab.code.code ?? lab.code.display ?? lab.id,
    ].join("|");

    const existing = latestByCode.get(sourceKey);
    if (
      !existing ||
      time(lab.effective_time) > time(existing.effective_time)
    ) {
      latestByCode.set(sourceKey, lab);
    }
  }

  const selected = [...latestByCode.values()].sort((a, b) => {
    const aCode = a.code.code ?? "";
    const bCode = b.code.code ?? "";
    const aOrder = orderIndex.get(aCode) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = orderIndex.get(bCode) ?? Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) return aOrder - bOrder;

    const aLabel = a.code.display ?? aCode ?? a.id;
    const bLabel = b.code.display ?? bCode ?? b.id;
    return aLabel.localeCompare(bLabel);
  });

  const entries: Array<[string, ReportField<string>]> = [];
  const usedLabels = new Set<string>();

  for (const lab of selected) {
    const baseLabel = lab.code.display ?? lab.code.code ?? lab.id;
    let label = baseLabel;

    if (usedLabels.has(label)) {
      label = `${baseLabel} (${lab.code.code ?? lab.id})`;
    }
    usedLabels.add(label);

    const interpretation = lab.interpretation_codes?.length
      ? lab.interpretation_codes.join(", ").toUpperCase()
      : undefined;

    entries.push([
      label,
      field(
        valueText(lab.value),
        "source",
        [lab.id],
        interpretation,
      ),
    ]);
  }

  return Object.fromEntries(entries);
}
