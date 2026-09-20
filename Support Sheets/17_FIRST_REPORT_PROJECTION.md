# First ICU Report Projection — Mock Vertical Slice

Generated from:
- `14_ICU_NORMALIZED_MODEL.md`
- `15_MOCK_ICU_FIXTURE.json`
- `16_ICU_SELECTION_POLICIES.md`

Report time: **2026-09-20 18:30 EDT**

> This is a deterministic software test artifact using fictional data. It is not a clinical record.

---

## Header

**ICU 12 — Jordan Example — Age 48 — Wt 82.4 kg — DNR / DNI**

**Diagnosis:** Sepsis due to pneumonia; Acute kidney injury  
**PMH:** Hypertension; Type 2 diabetes mellitus  
**Allergy:** Penicillin — hives

---

## Neuro

**A/O:** x3, disoriented to time  
**Pupils:** R 3 mm brisk | L 3 mm brisk  
**GCS:** 14 (E4 V4 M6)  
**Strength:** RUE 5 | LUE 5 | RLE 4 | LLE 4  
**NIHSS:** Not documented

---

## Cardiac

**Rhythm:** Sinus tachycardia  
**Radial:** R 2+ | L 2+  
**Pedal:** R 1+ | L 1+  
**Edema:** RLE 2+ pitting | LLE 1+ pitting

---

## Respiratory

**Oxygen:** High-flow nasal cannula, 40 L/min, FiO2 50%

**Lung display**
- RUL: Clear
- RML: Clear
- RLL: Clear
- LUL: Diminished
- LLL: Crackles

Source note: RUL/RML/RLL are display derivations from one right-lung `clear` observation. LUL derives from a left-lung `diminished` observation. LLL is source-direct.

**Vent settings:** Not documented / not applicable in this fixture

---

## GI / Nutrition

**Abdominal findings:** Soft; non-tender; bowel sounds hypoactive in all quadrants

**Nutrition:** Mock Standard 1.5 via Dobhoff, 45 mL/hr continuous  
**FWF:** 150 mL every 4 hours  
**Enteral access:** Dobhoff, left nare

---

## GU

**Urine:** Clear yellow  
**Device:** Foley catheter  
**Shift UOP through 18:30:** **365 mL**

The 06:30 200 mL measurement is preserved in source history but excluded because it predates the configured 07:00 shift start.

---

## Lines / Devices / Wounds

- Right IJ triple lumen CVC
- Left forearm PIV
- Foley catheter
- Dobhoff tube, left nare
- Sacral pressure injury, Stage 2

Historical/not current:
- Right hand PIV, completed 2026-09-19 08:45

---

## IV Drips

**Norepinephrine infusion:** 0.03 mcg/kg/min, in progress, via CVC

Historical/not current:
- Previous norepinephrine administration segment 0.05 mcg/kg/min ended 17:10
- Vasopressin infusion ended 10:15

---

## BGM

- 08:00 slot: **118 mg/dL** from 07:55
- 12:00 slot: **162 mg/dL** from 12:05
- 16:00 slot: **147 mg/dL** from 16:10

The 06:00 reading remains history and is not forced into a display slot.

---

## Pain

**3/10 — right chest — aching — 17:45**

Audit note: a newer 10/10 source observation exists at 18:05 but has status `entered-in-error`, so it is excluded.

---

## Labs

The lab section is full-width and source-driven. This fixture currently has 23 usable resulted labs:

| Lab | Result |
|---|---:|
| WBC | 15.2 10^3/uL (HIGH) |
| Red blood cells | 3.15 10^6/uL (LOW) |
| Hemoglobin | 9.1 g/dL (LOW) |
| Hematocrit | 28.2% (LOW) |
| Platelets | 210 10^3/uL |
| Prothrombin time | 15.8 sec (HIGH) |
| INR | 1.3 (HIGH) |
| aPTT | 32 sec |
| Sodium | 139 mmol/L |
| Potassium | 3.4 mmol/L (LOW) |
| Chloride | 104 mmol/L |
| CO2 | 22 mmol/L |
| Anion gap | 13 mmol/L |
| BUN | 34 mg/dL (HIGH) |
| Creatinine | 1.8 mg/dL (HIGH) |
| eGFR | 42 mL/min/1.73m2 (LOW) |
| Calcium | 8.1 mg/dL (LOW) |
| Albumin | 2.8 g/dL (LOW) |
| Total protein | 5.9 g/dL (LOW) |
| ALT | 42 U/L |
| AST | 51 U/L (HIGH) |
| Total bilirubin | 0.9 mg/dL |
| Phosphorus | 2.4 mg/dL (LOW) |

The newer potassium result of 6.8 mmol/L is preserved in source history but excluded because it is `entered-in-error`.

Magnesium is intentionally not documented in this fixture and therefore is not shown as a resulted lab.

---

## Radiology

**Portable chest radiograph — 09/20 16:40 — FINAL**  
Impression: Persistent bibasilar airspace opacities, right greater than left, with small bilateral pleural effusions.

**CT chest with contrast — 09/18 17:05 — FINAL**  
Impression: Multifocal bilateral lower-lobe predominant airspace disease with small bilateral pleural effusions.

The newer fixture report `rad-cxr-error` is preserved in source history but excluded because its status is `entered-in-error`. Full findings remain preserved underneath the compact report view.

---

## Treatment / To Do

### Source-backed handoff
- Recheck potassium after replacement.
- Continue oxygen wean as tolerated.
- Norepinephrine infusion remains active.

### Structured nursing intervention
- Repositioned patient at 17:00.

### Report-only annotation
- Family plans to visit after 19:00.

The eventual UI must make those provenance classes visually distinct.

---

# Why This Projection Matters

This artifact proves the architectural split:

```text
source-shaped history
        ↓
selection policies
        ↓
derived values
        ↓
nurse-friendly report
```

The report is compact, but the source history was **not destroyed** to make it compact.

## Behaviors proven by the fixture

- Newer invalid data do not beat older valid data.
- Missing data stay missing.
- Historical LDAs and medication administrations remain history.
- A medication order does not equal current administration.
- Lung inheritance happens only in presentation.
- BGM slots are derived from timestamped readings.
- UOP shift total is derived from an explicit time window.
- Labs render dynamically from all usable current source results; hemoglobin and hematocrit remain separate source results.
- Manual report notes remain distinct from Epic/source data.
- Radiology displays source DiagnosticReport impressions without inventing a local interpretation.
- There is no arbitrary four-IV limit.

## Next engineering step

Choose the implementation stack and turn this exact fixture + policy set into executable normalization/selection code and the first interactive ICU report.
