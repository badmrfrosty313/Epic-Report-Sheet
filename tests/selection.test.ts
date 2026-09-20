import { describe, expect, it } from "vitest";
import fixtureJson from "../Support Sheets/15_MOCK_ICU_FIXTURE.json";
import stressFixtureJson from "../Support Sheets/18_STRESS_ICU_FIXTURE.json";
import { buildReportState } from "../src/selection";
import type { IcuFixture } from "../src/types";

const fixture = fixtureJson as unknown as IcuFixture;
const report = buildReportState(fixture);
const stressFixture = stressFixtureJson as unknown as IcuFixture;
const stressReport = buildReportState(stressFixture);

describe("ICU selection engine", () => {
  it("derives the expected patient header", () => {
    expect(report.header.patientName.value).toBe("Jordan Example");
    expect(report.header.age.value).toBe(48);
    expect(report.header.location.value).toBe("ICU 12");
    expect(report.header.weight.value).toBe("82.4 kg");
    expect(report.header.codeStatus.value).toBe("DNR / DNI");
  });

  it("selects valid neuro and cardiac values", () => {
    expect(report.neuro.orientation.value).toBe("x3 - disoriented to time");
    expect(report.neuro.gcs.value).toBe("14 (E4 V4 M6)");
    expect(report.neuro.nihss.value).toBe("2");
    expect(report.neuro.nihss.sourceIds).toContain("obs-nihss-total");
    expect(report.cardiac.rhythm.value).toBe("sinus tachycardia");
    expect(report.cardiac.radial.value).toBe("R 2+ | L 2+");
    expect(report.cardiac.pedal.value).toBe("R 1+ | L 1+");
  });

  it("renders populated ventilator settings from source observations", () => {
    expect(report.respiratory.oxygen.value).toBe(
      "mechanical ventilator\nFiO2 50 %",
    );
    expect(report.respiratory.vent.value).toBe(
      "Mode: AC/VC\nTidal volume: 450 mL\nPEEP: 8 cmH2O\nRate: 18 breaths/min",
    );
    expect(report.respiratory.vent.sourceIds).toEqual([
      "obs-vent-mode",
      "obs-vent-tidal_volume",
      "obs-vent-peep",
      "obs-vent-rate",
    ]);
  });

  it("projects side-level lung findings without fabricating source records", () => {
    expect(report.respiratory.rul.value).toBe("clear");
    expect(report.respiratory.rml.value).toBe("clear");
    expect(report.respiratory.rll.value).toBe("clear");
    expect(report.respiratory.lul.value).toBe("diminished");
    expect(report.respiratory.lll.value).toBe("crackles");
    expect(report.respiratory.rul.provenance).toBe("derived");
    expect(report.respiratory.lll.provenance).toBe("source");
  });

  it("calculates shift UOP from only in-window values", () => {
    expect(report.gu.shiftUop.value).toBe("365 mL");
    expect(report.gu.shiftUop.sourceIds).not.toContain("obs-uop-pre-shift");
  });

  it("uses administration state rather than medication order intent", () => {
    expect(report.drips).toHaveLength(1);
    expect(report.drips[0].value).toContain("Norepinephrine infusion");
    expect(report.drips[0].value).toContain("0.03 mcg/kg/min");
    expect(report.drips[0].sourceIds).toEqual(["med-admin-norepi-current"]);
  });

  it("keeps active LDAs and excludes completed devices", () => {
    expect(report.ldas).toHaveLength(6);
    expect(report.ldas.some((item) => item.sourceIds.includes("lda-old-piv"))).toBe(
      false,
    );
  });

  it("renders composite nutrition values as separate scan lines", () => {
    expect(report.gi.nutrition.value).toBe(
      "Formula: Mock Standard 1.5\nRoute: enteral tube\n45 mL/hr continuous\n150 mL free-water flush every 4 hours",
    );
    expect(report.gi.enteralAccess.value).toBe(
      "Dobhoff tube\nSite: left nare",
    );
  });

  it("builds the shift I/O snapshot from explicit source observations", () => {
    expect(report.io.intake.value).toBe("770 mL");
    expect(report.io.output.value).toBe("450 mL");
    expect(report.io.net.value).toBe("+320 mL");
    expect(report.io.net.provenance).toBe("derived");
  });

  it("projects configured BGM slots from timestamped readings", () => {
    expect(report.bgm["0800"].value).toBe("118 mg/dL");
    expect(report.bgm["1200"].value).toBe("162 mg/dL");
    expect(report.bgm["1600"].value).toBe("147 mg/dL");
  });

  it("rejects a newer entered-in-error pain score", () => {
    expect(report.pain.value).toBe("3/10 - right chest - aching - 17:45");
    expect(report.pain.sourceIds).toContain("obs-pain-current");
    expect(report.pain.sourceIds).not.toContain("obs-pain-error");
  });

  it("renders every available current lab instead of a hard-coded subset", () => {
    expect(Object.keys(report.labs)).toHaveLength(23);
    expect(report.labs["Red blood cells"].value).toBe("3.15 10^6/uL");
    expect(report.labs["Hemoglobin"].value).toBe("9.1 g/dL");
    expect(report.labs["Hematocrit"].value).toBe("28.2 %");
    expect(report.labs["Phosphorus"].value).toBe("2.4 mg/dL");
    expect(report.labs["Magnesium"]).toBeUndefined();
  });

  it("rejects a newer entered-in-error potassium result", () => {
    expect(report.labs["Potassium"].value).toBe("3.4 mmol/L");
    expect(report.labs["Potassium"].sourceIds).toEqual(["lab-k-current"]);
  });

  it("keeps lab flags and numeric trends available for the UI", () => {
    expect(report.labs["Potassium"].flag).toBe("LOW");
    expect(report.labs["Potassium"].trend).toBe("down");
    expect(report.labs["Potassium"].previousValue).toBe("4.1 mmol/L");
    expect(report.labs["WBC"].flag).toBe("HIGH");
    expect(report.labs["WBC"].trend).toBe("down");
    expect(report.labs["Creatinine"].trend).toBe("down");
  });

  it("adds source-time freshness metadata without inventing clinical staleness thresholds", () => {
    expect(report.pain.observedAt).toBe("2026-09-20T17:45:00-04:00");
    expect(report.pain.freshness).toBe("this-shift");
    expect(report.header.codeStatus.freshness).toBe("pre-shift");
  });

  it("selects active-encounter radiology and rejects entered-in-error reports", () => {
    expect(report.radiology).toHaveLength(2);
    expect(report.radiology[0].value).toContain("Study: Portable chest radiograph");
    expect(report.radiology[0].value).toContain("Impression: Persistent bibasilar airspace opacities");
    expect(report.radiology[0].sourceIds).toEqual(["rad-cxr-current"]);
    expect(report.radiology.some((item) => item.sourceIds.includes("rad-cxr-error"))).toBe(false);
  });

  it("promotes source To Do separately from other handoff context", () => {
    expect(report.treatment.todo).toHaveLength(1);
    expect(report.treatment.todo[0].value).toContain("recheck potassium");
    expect(report.treatment.handoff[0].provenance).toBe("source");
    expect(report.treatment.annotations[0].provenance).toBe("report-only");
  });

  it("survives the high-density ICU stress fixture", () => {
    expect(stressReport.header.patientName.value).toBe("Morgan Stress Test");
    expect(stressReport.ldas.length).toBeGreaterThanOrEqual(10);
    expect(stressReport.drips.length).toBe(8);
    expect(Object.keys(stressReport.labs).length).toBeGreaterThanOrEqual(28);
    expect(stressReport.radiology.length).toBeGreaterThanOrEqual(4);
    expect(stressReport.treatment.todo[0].value).toContain("Repeat ABG");
    expect(stressReport.io.net.value).toBe("+320 mL");
  });
});
