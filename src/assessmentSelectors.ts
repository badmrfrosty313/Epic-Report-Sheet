import type { IcuFixture, ObservationRecord, ReportField } from "./types";
import {
  field,
  missing,
  observations,
  oneObservation,
  valueText,
  time,
} from "./selectionUtils";

export function selectOrientation(fixture: IcuFixture): ReportField<string> {
  const selected = oneObservation(fixture, "neuro.orientation");
  if (!selected) return missing("Orientation not documented");

  const value = selected.value as { level?: number; deficits?: string[] };
  if (typeof value?.level !== "number") {
    return field(valueText(selected.value), "source", [selected.id]);
  }

  return field(
    `x${value.level}${
      value.deficits?.length
        ? ` - disoriented to ${value.deficits.join(" and ")}`
        : ""
    }`,
    "derived",
    [selected.id],
  );
}

export function selectPupils(fixture: IcuFixture): ReportField<string> {
  const sizeR = oneObservation(
    fixture,
    "neuro.pupil.size",
    (obs) => obs.laterality === "right",
  );
  const sizeL = oneObservation(
    fixture,
    "neuro.pupil.size",
    (obs) => obs.laterality === "left",
  );
  const reactR = oneObservation(
    fixture,
    "neuro.pupil.reaction",
    (obs) => obs.laterality === "right",
  );
  const reactL = oneObservation(
    fixture,
    "neuro.pupil.reaction",
    (obs) => obs.laterality === "left",
  );

  if (!sizeR && !sizeL && !reactR && !reactL) {
    return missing("Pupils not documented");
  }

  return field(
    `R ${sizeR ? valueText(sizeR.value) : "?"} ${
      reactR ? valueText(reactR.value) : "?"
    } | L ${sizeL ? valueText(sizeL.value) : "?"} ${
      reactL ? valueText(reactL.value) : "?"
    }`,
    "derived",
    [sizeR, sizeL, reactR, reactL].filter(Boolean).map((item) => item!.id),
  );
}

export function selectGcs(fixture: IcuFixture): ReportField<string> {
  const eye = oneObservation(fixture, "neuro.gcs.eye");
  const verbal = oneObservation(fixture, "neuro.gcs.verbal");
  const motor = oneObservation(fixture, "neuro.gcs.motor");
  const total = oneObservation(fixture, "neuro.gcs.total");

  if (!eye || !verbal || !motor) return missing("Incomplete GCS");

  const displayTotal = total
    ? Number(total.value)
    : Number(eye.value) + Number(verbal.value) + Number(motor.value);

  return field(
    `${displayTotal} (E${eye.value} V${verbal.value} M${motor.value})`,
    "derived",
    [eye.id, verbal.id, motor.id, ...(total ? [total.id] : [])],
  );
}

export function selectStrength(fixture: IcuFixture): ReportField<string> {
  const limbs = ["RUE", "LUE", "RLE", "LLE"];
  const values = limbs.map((limb) =>
    oneObservation(
      fixture,
      "neuro.strength",
      (obs) => obs.scope === limb,
    ),
  );

  if (!values.some(Boolean)) return missing("Strength not documented");

  return field(
    limbs
      .map((limb, index) => `${limb} ${values[index]?.value ?? "?"}`)
      .join(" | "),
    "derived",
    values.filter(Boolean).map((item) => item!.id),
  );
}

export function selectPulsePair(
  fixture: IcuFixture,
  siteMatches: (obs: ObservationRecord) => boolean,
): ReportField<string> {
  const right = oneObservation(
    fixture,
    "cardiac.pulse",
    (obs) => obs.laterality === "right" && siteMatches(obs),
  );
  const left = oneObservation(
    fixture,
    "cardiac.pulse",
    (obs) => obs.laterality === "left" && siteMatches(obs),
  );

  return right || left
    ? field(
        `R ${right ? valueText(right.value) : "?"} | L ${
          left ? valueText(left.value) : "?"
        }`,
        "derived",
        [right, left].filter(Boolean).map((item) => item!.id),
      )
    : missing("Pulse not documented");
}

export function selectEdema(fixture: IcuFixture): ReportField<string> {
  const selected = observations(fixture, "cardiac.edema");
  if (!selected.length) return missing("Edema not documented");

  return field(
    selected
      .sort((a, b) => (a.scope ?? "").localeCompare(b.scope ?? ""))
      .map((obs) => {
        const value = obs.value as { grade?: string; type?: string };
        return `${obs.scope ?? "site"} ${
          value.grade ?? valueText(obs.value)
        }${value.type ? ` ${value.type}` : ""}`;
      })
      .join("\n"),
    "derived",
    selected.map((obs) => obs.id),
  );
}

export function selectOxygen(fixture: IcuFixture): ReportField<string> {
  const device = oneObservation(fixture, "respiratory.oxygen_device");
  const flow = oneObservation(fixture, "respiratory.flow");
  const fio2 = oneObservation(fixture, "respiratory.fio2");

  if (!device && !flow && !fio2) return missing("Oxygen not documented");

  return field(
    [
      device && valueText(device.value),
      flow && valueText(flow.value),
      fio2 && `FiO2 ${valueText(fio2.value)}`,
    ]
      .filter(Boolean)
      .join("\n"),
    "derived",
    [device, flow, fio2].filter(Boolean).map((item) => item!.id),
  );
}

export function selectLung(
  fixture: IcuFixture,
  lobe: "RUL" | "RML" | "RLL" | "LUL" | "LLL",
): ReportField<string> {
  const direct = oneObservation(
    fixture,
    "respiratory.lung_sound",
    (obs) => obs.scope === lobe,
  );

  if (direct) return field(valueText(direct.value), "source", [direct.id]);

  const side = lobe.startsWith("R") ? "right_lung" : "left_lung";
  const broad = oneObservation(
    fixture,
    "respiratory.lung_sound",
    (obs) => obs.scope === side,
  );

  return broad
    ? field(
        valueText(broad.value),
        "derived",
        [broad.id],
        `Inherited from ${side}`,
      )
    : missing("Lung finding not documented");
}

export function selectAbdomen(fixture: IcuFixture): ReportField<string> {
  const selected = [
    oneObservation(fixture, "gi.assessment.consistency"),
    oneObservation(fixture, "gi.assessment.tenderness"),
    oneObservation(fixture, "gi.assessment.bowel_sounds"),
  ];

  if (!selected.some(Boolean)) return missing("GI assessment not documented");

  return field(
    selected
      .filter(Boolean)
      .map((obs) =>
        obs!.code.code === "gi.assessment.bowel_sounds"
          ? `bowel sounds ${valueText(obs!.value)}${
              obs!.scope ? ` in ${obs!.scope.replaceAll("_", " ")}` : ""
            }`
          : valueText(obs!.value),
      )
      .join("\n"),
    "derived",
    selected.filter(Boolean).map((item) => item!.id),
  );
}

export function selectPain(fixture: IcuFixture): ReportField<string> {
  const score = oneObservation(fixture, "pain.score");
  if (!score) return missing("Pain not documented");

  const location = oneObservation(
    fixture,
    "pain.location",
    (obs) => obs.effective_time === score.effective_time,
  );
  const quality = oneObservation(
    fixture,
    "pain.quality",
    (obs) => obs.effective_time === score.effective_time,
  );

  return field(
    [
      `${valueText(score.value)}/10`,
      location && valueText(location.value),
      quality && valueText(quality.value),
      score.effective_time?.slice(11, 16),
    ]
      .filter(Boolean)
      .join(" - "),
    "derived",
    [score, location, quality].filter(Boolean).map((item) => item!.id),
  );
}

export function selectShiftUop(fixture: IcuFixture): ReportField<string> {
  const selected = observations(fixture, "gu.output").filter(
    (obs) =>
      time(obs.effective_time) >= time(fixture.report_config.shift_start) &&
      time(obs.effective_time) <=
        Math.min(
          time(fixture.report_config.shift_end),
          time(fixture.report_config.report_time),
        ),
  );

  if (!selected.length) return missing("No UOP in shift window");

  const total = selected.reduce((sum, obs) => {
    const value = obs.value as { value?: number };
    return sum + (typeof value?.value === "number" ? value.value : 0);
  }, 0);

  return field(
    `${total} mL`,
    "derived",
    selected.map((obs) => obs.id),
  );
}
