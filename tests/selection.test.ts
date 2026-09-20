import { describe, expect, it } from "vitest";
import fixtureJson from "../Support Sheets/15_MOCK_ICU_FIXTURE.json";
import { buildReportState } from "../src/selection";
import type { IcuFixture } from "../src/types";

const fixture = fixtureJson as unknown as IcuFixture;
const report = buildReportState(fixture);

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
    expect(report.cardiac.rhythm.value).toBe("sinus tachycardia");
    expect(report.cardiac.radial.value).toBe("R 2+ | L 2+");
    expect(report.cardiac.pedal.value).toBe("R 1+ | L 1+");
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
    expect(report.ldas).toHaveLength(5);
    expect(report.ldas.some((item) => item.sourceIds.includes("lda-old-piv"))).toBe(
      false,
    );
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

  it("rejects a newer entered-in-error potassium result", () => {
    expect(report.labs.K.value).toBe("3.4 mmol/L");
    expect(report.labs.K.sourceIds).toEqual(["lab-k-current"]);
  });

  it("derives H/H while preserving separate source IDs", () => {
    expect(report.labs["H/H"].value).toBe("9.1 g/dL / 28.2 %");
    expect(report.labs["H/H"].provenance).toBe("derived");
    expect(report.labs["H/H"].sourceIds).toEqual([
      "lab-hgb-current",
      "lab-hct-current",
    ]);
  });

  it("does not turn missing magnesium or NIHSS into normal values", () => {
    expect(report.labs.Magnesium.value).toBeNull();
    expect(report.labs.Magnesium.provenance).toBe("missing");
    expect(report.neuro.nihss.value).toBeNull();
    expect(report.neuro.nihss.provenance).toBe("missing");
  });

  it("keeps manual annotations distinct from source-backed handoff", () => {
    expect(report.treatment.handoff[0].provenance).toBe("source");
    expect(report.treatment.annotations[0].provenance).toBe("report-only");
  });
});
