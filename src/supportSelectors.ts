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
  trendDirection,
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
  const ldaById = new Map(
    fixture.ldas.map((lda) => [
      lda.id,
      lda.display ?? lda.type_code.display ?? lda.type_code.code ?? lda.id,
    ]),
  );

  return fixture.medication_administrations
    .filter(
      (item) =>
        item.status === "in-progress" &&
        item.encounter_ref === fixture.encounter.id &&
        present(item.availability) &&
        inPeriod(item.effective_period, fixture.report_config.report_time),
    )
    .sort(
      (a, b) =>
        time(a.effective_period?.start ?? a.effective_time) -
        time(b.effective_period?.start ?? b.effective_time),
    )
    .map((item) => {
      const medication =
        item.medication_code?.display ??
        item.medication_code?.code ??
        "Medication";
      const access = item.device_refs
        ?.map((id) => ldaById.get(id) ?? id)
        .join(", ");

      return field(
        [
          medication,
          `Rate: ${
            item.rate
              ? `${item.rate.value}${item.rate.unit ? ` ${item.rate.unit}` : ""}`
              : "not documented"
          }`,
          access ? `Via: ${access}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        "source",
        [item.id],
      );
    });
}

export function selectShiftIo(fixture: IcuFixture): {
  intake: ReportField<string>;
  output: ReportField<string>;
  net: ReportField<string>;
} {
  const start = time(fixture.report_config.shift_start);
  const end = Math.min(
    time(fixture.report_config.shift_end),
    time(fixture.report_config.report_time),
  );

  const withinShift = (code: string) =>
    observations(fixture, code).filter((obs) => {
      const observed = time(obs.effective_time);
      return observed >= start && observed <= end;
    });

  const intakeRecords = withinShift("io.intake");
  const outputRecords = withinShift("io.output");

  const sum = (records: ReturnType<typeof withinShift>) =>
    records.reduce((total, obs) => {
      const value = obs.value as { value?: number; unit?: string };
      return total + (typeof value?.value === "number" ? value.value : 0);
    }, 0);

  const intakeTotal = intakeRecords.length ? sum(intakeRecords) : null;
  const outputTotal = outputRecords.length ? sum(outputRecords) : null;

  const intake = intakeTotal === null
    ? missing<string>("No documented intake in shift window")
    : field(
        `${intakeTotal} mL`,
        "derived",
        intakeRecords.map((obs) => obs.id),
        "Shift total from documented intake observations",
      );

  const output = outputTotal === null
    ? missing<string>("No documented total output in shift window")
    : field(
        `${outputTotal} mL`,
        "derived",
        outputRecords.map((obs) => obs.id),
        "Shift total from documented output observations",
      );

  const net =
    intakeTotal === null || outputTotal === null
      ? missing<string>("Net requires both documented intake and output")
      : field(
          `${intakeTotal - outputTotal >= 0 ? "+" : ""}${intakeTotal - outputTotal} mL`,
          "derived",
          [
            ...intakeRecords.map((obs) => obs.id),
            ...outputRecords.map((obs) => obs.id),
          ],
          "Intake minus documented output for the configured shift window",
        );

  return { intake, output, net };
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

  const grouped = new Map<
    string,
    Array<(typeof fixture.lab_results)[number]>
  >();

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

    const list = grouped.get(sourceKey) ?? [];
    list.push(lab);
    grouped.set(sourceKey, list);
  }

  const selected = [...grouped.entries()]
    .map(([sourceKey, labs]) => ({
      sourceKey,
      labs: [...labs].sort(
        (a, b) => time(b.effective_time) - time(a.effective_time),
      ),
    }))
    .sort((a, b) => {
      const aLab = a.labs[0];
      const bLab = b.labs[0];
      const aCode = aLab.code.code ?? "";
      const bCode = bLab.code.code ?? "";
      const aOrder = orderIndex.get(aCode) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = orderIndex.get(bCode) ?? Number.MAX_SAFE_INTEGER;

      if (aOrder !== bOrder) return aOrder - bOrder;

      const aLabel = aLab.code.display ?? aCode ?? aLab.id;
      const bLabel = bLab.code.display ?? bCode ?? bLab.id;
      return aLabel.localeCompare(bLabel);
    });

  const entries: Array<[string, ReportField<string>]> = [];
  const usedLabels = new Set<string>();

  for (const group of selected) {
    const current = group.labs[0];
    const previous = group.labs[1];
    const baseLabel =
      current.code.display ?? current.code.code ?? current.id;
    let label = baseLabel;

    if (usedLabels.has(label)) {
      label = `${baseLabel} (${current.code.code ?? current.id})`;
    }
    usedLabels.add(label);

    const flag = current.interpretation_codes?.length
      ? current.interpretation_codes.join(", ").toUpperCase()
      : undefined;

    entries.push([
      label,
      field(
        valueText(current.value),
        "source",
        [current.id],
        undefined,
        {
          flag,
          observedAt: current.effective_time ?? current.issued_time ?? undefined,
          previousValue: previous ? valueText(previous.value) : undefined,
          previousObservedAt:
            previous?.effective_time ?? previous?.issued_time ?? undefined,
          trend: previous
            ? trendDirection(current.value, previous.value)
            : undefined,
        },
      ),
    ]);
  }

  return Object.fromEntries(entries);
}
