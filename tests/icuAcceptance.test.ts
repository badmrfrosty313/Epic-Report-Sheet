import { describe, expect, it } from "vitest";
import acceptanceFixtureJson from "../Support Sheets/20_ICU_ACCEPTANCE_FIXTURE.json";
import { buildReportState } from "../src/selection";
import type { IcuFixture } from "../src/types";

const fixture = acceptanceFixtureJson as unknown as IcuFixture;
const report = buildReportState(fixture);

describe("ICU nurse-handoff acceptance scenario", () => {
  it("surfaces the patient identity, location, code status, and active problems", () => {
    expect(report.header.patientName.value).toBe("Taylor Acceptance");
    expect(report.header.location.value).toBe("ICU 08");
    expect(report.header.age.value).toBe(66);
    expect(report.header.codeStatus.value).toBe("Full Code");

    expect(report.header.diagnoses.value).toEqual(
      expect.arrayContaining([
        "Septic shock due to multifocal pneumonia",
        "Acute hypoxemic respiratory failure",
        "Acute kidney injury",
      ]),
    );
  });

  it("preserves missing neuro assessments instead of inventing normal findings", () => {
    expect(report.neuro.orientation.value).toBeNull();
    expect(report.neuro.orientation.provenance).toBe("missing");
    expect(report.neuro.nihss.value).toBeNull();
    expect(report.neuro.nihss.provenance).toBe("missing");

    expect(report.neuro.gcs.value).toBe("10 (E3 V1 M6)");
  });

  it("shows the current respiratory support and bedside lung findings", () => {
    expect(report.respiratory.oxygen.value).toBe(
      "mechanical ventilator\nFiO2 60 %",
    );
    expect(report.respiratory.vent.value).toBe(
      "Mode: AC/VC\nTidal volume: 420 mL\nPEEP: 10 cmH2O\nRate: 22 breaths/min",
    );

    expect(report.respiratory.rul.value).toBe("coarse");
    expect(report.respiratory.rml.value).toBe("coarse");
    expect(report.respiratory.rll.value).toBe("coarse");
    expect(report.respiratory.lul.value).toBe("diminished");
    expect(report.respiratory.lll.value).toBe("crackles");
  });

  it("surfaces all four current ICU infusions and excludes the completed pressor rate", () => {
    expect(report.drips).toHaveLength(4);

    const dripText = report.drips.map((item) => item.value).join("\n");
    expect(dripText).toContain("Norepinephrine infusion");
    expect(dripText).toContain("0.08 mcg/kg/min");
    expect(dripText).toContain("Vasopressin infusion");
    expect(dripText).toContain("0.03 units/min");
    expect(dripText).toContain("Propofol infusion");
    expect(dripText).toContain("20 mcg/kg/min");
    expect(dripText).toContain("Fentanyl infusion");
    expect(dripText).toContain("75 mcg/hr");

    expect(
      report.drips.some((item) =>
        item.sourceIds.includes("med-admin-accept-old-norepi"),
      ),
    ).toBe(false);
  });

  it("keeps the active invasive-device picture intact", () => {
    expect(report.ldas).toHaveLength(7);

    const ldaText = report.ldas.map((item) => item.value).join("\n");
    expect(ldaText).toContain("Right IJ triple lumen CVC");
    expect(ldaText).toContain("Foley catheter");
    expect(ldaText).toContain("Endotracheal tube");
    expect(ldaText).toContain("Left Radial Arterial Line");
  });

  it("calculates shift urine output and total I/O from their correct source domains", () => {
    expect(report.gu.shiftUop.value).toBe("230 mL");
    expect(report.io.intake.value).toBe("1250 mL");
    expect(report.io.output.value).toBe("700 mL");
    expect(report.io.net.value).toBe("+550 mL");

    expect(report.io.output.sourceIds).not.toEqual(
      expect.arrayContaining(report.gu.shiftUop.sourceIds),
    );
  });

  it("shows clinically important lab direction without labeling direction as improvement", () => {
    expect(report.labs["WBC"].value).toBe("18.4 10^3/uL");
    expect(report.labs["WBC"].flag).toBe("HIGH");
    expect(report.labs["WBC"].trend).toBe("down");
    expect(report.labs["WBC"].previousValue).toBe("22.1 10^3/uL");

    expect(report.labs["Potassium"].value).toBe("3.3 mmol/L");
    expect(report.labs["Potassium"].flag).toBe("LOW");
    expect(report.labs["Potassium"].trend).toBe("down");

    expect(report.labs["Creatinine"].value).toBe("2.4 mg/dL");
    expect(report.labs["Creatinine"].flag).toBe("HIGH");
    expect(report.labs["Creatinine"].trend).toBe("up");

    expect(report.labs["Lactate"].value).toBe("2.8 mmol/L");
    expect(report.labs["Lactate"].flag).toBe("HIGH");
    expect(report.labs["Lactate"].trend).toBe("down");
    expect(report.labs["Lactate"].previousValue).toBe("5.2 mmol/L");
  });

  it("rejects newer entered-in-error lab and radiology traps", () => {
    expect(report.labs["Potassium"].sourceIds).toEqual(["lab-k-current"]);
    expect(report.audit.excludedIds).toContain("lab-k-error");

    expect(report.radiology).toHaveLength(1);
    expect(report.radiology[0].sourceIds).toEqual(["rad-accept-cxr"]);
    expect(report.radiology[0].value).toContain(
      "Bilateral multifocal airspace opacities",
    );
    expect(report.audit.excludedIds).toContain("rad-accept-error");
  });

  it("makes the source-backed shift To Do visible without merging report-only notes", () => {
    expect(report.treatment.todo).toHaveLength(1);
    expect(report.treatment.todo[0].value).toContain("Repeat lactate at 20:00");
    expect(report.treatment.todo[0].value).toContain(
      "recheck potassium after replacement",
    );
    expect(report.treatment.todo[0].value).toContain(
      "titrate norepinephrine to ordered MAP goal",
    );

    expect(report.treatment.annotations).toHaveLength(1);
    expect(report.treatment.annotations[0].provenance).toBe("report-only");
    expect(report.treatment.annotations[0].value).toContain(
      "Family would like an update",
    );
  });

  it("keeps source timing useful without inventing a medical staleness threshold", () => {
    expect(report.respiratory.vent.observedAt).toBe(
      "2026-09-20T18:15:00-04:00",
    );
    expect(report.respiratory.vent.freshness).toBe("this-shift");

    expect(report.header.codeStatus.observedAt).toBe(
      "2026-09-20T06:30:00-04:00",
    );
    expect(report.header.codeStatus.freshness).toBe("pre-shift");
  });

  it("produces a coherent handoff snapshot across all major ICU domains", () => {
    const requiredPresent = [
      report.header.patientName,
      report.header.diagnoses,
      report.neuro.gcs,
      report.cardiac.rhythm,
      report.respiratory.oxygen,
      report.respiratory.vent,
      report.gi.nutrition,
      report.gu.device,
      report.gu.shiftUop,
      report.io.net,
      report.pain,
    ];

    for (const field of requiredPresent) {
      expect(field.value).not.toBeNull();
    }

    expect(report.ldas.length).toBeGreaterThanOrEqual(6);
    expect(report.drips.length).toBeGreaterThanOrEqual(4);
    expect(Object.keys(report.labs).length).toBeGreaterThanOrEqual(20);
    expect(report.radiology.length).toBeGreaterThanOrEqual(1);
    expect(report.treatment.todo.length).toBeGreaterThanOrEqual(1);
  });
});
