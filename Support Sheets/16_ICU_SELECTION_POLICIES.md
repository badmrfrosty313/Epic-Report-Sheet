# ICU Selection Policies — v0.1 Test Harness

Last updated: 2026-09-20  
Fixture: `15_MOCK_ICU_FIXTURE.json`  
Model: `14_ICU_NORMALIZED_MODEL.md`

## Purpose

These policies turn the source-shaped canonical model into a deterministic report snapshot.

They are **software-selection rules for the prototype**, not clinical practice standards. Customer configuration and nurse-workflow validation may change individual policies later.

## Universal Preconditions

Every policy begins with the following filters:

1. Match the report patient.
2. When the source is encounter-scoped, match the active report encounter.
3. Exclude records whose source status semantically marks them unusable, such as `entered-in-error`.
4. Exclude records whose effective time begins after `report_time`.
5. Do not silently convert missing/unavailable data into a normal value.
6. When two valid records remain tied and the source gives no trustworthy precedence rule, preserve the conflict and surface a normalization/selection issue.

Fixture report time: **2026-09-20 18:30 EDT**.

---

## Policy Table

| Policy ID | Domain | Rule | Fixture result |
|---|---|---|---|
| SEL-001 | Active encounter | Choose encounter for patient whose status is active/in-progress and whose period contains report time. | `enc-icu-001` |
| SEL-002 | Current location | Within active encounter, choose active location whose period contains report time. | `ICU 12` / `src-loc-002` |
| SEL-003 | Age | Calculate whole years from source birth date at report time. | 48 years from `patient-001.birth_date` |
| SEL-004 | Code status | Choose valid active code-status record whose effective period contains report time. | `code-002` = DNR / DNI |
| SEL-005 | Weight | In active encounter, choose most recent valid final weight observation at/before report time. | `obs-weight-current` = 82.4 kg |
| SEL-006 | Current bedside observation | For a mapped concept/site/scope, choose most recent valid final observation at/before report time within active encounter unless a domain-specific rule overrides it. | Used for rhythm, oxygen, FiO2, GI/GU assessment values, etc. |
| SEL-007 | GCS | Select latest complete source component set by panel/time. Preserve source total. Calculate component sum separately and flag mismatch if present. | E4 V4 M6, source total 14, calculated 14 |
| SEL-008 | Lung lobe projection | Prefer a valid lobe-specific finding. Otherwise inherit valid side-level finding for display only. | RUL/RML/RLL = clear from `obs-lung-right`; LUL = diminished from `obs-lung-left`; LLL = crackles from direct `obs-lung-lll` |
| SEL-009 | Current LDAs | Include LDA records whose source status is active and whose effective period contains report time. | CVC, left forearm PIV, Foley, DHT, sacral wound. Exclude `lda-old-piv`. |
| SEL-010 | Nutrition | Include active nutrition orders for encounter at report time. Keep completed orders as history only. | `nut-enteral-current`; exclude `nut-old-npo` from current display |
| SEL-011 | Current drips | Include administration records with usable active/in-progress status whose effective period contains report time. Order alone does not prove active administration. | `med-admin-norepi-current` at 0.03 mcg/kg/min; exclude old norepi segment and stopped vasopressin |
| SEL-012 | Available lab results | Group usable final lab Observations in the active encounter by source lab code and select the newest valid result for each code at/before report time. **No hard-coded lab allowlist.** Ignore entered-in-error. | All 23 available current mock labs render; K = 3.4 from `lab-k-current`, not 6.8 from `lab-k-error` |
| SEL-013 | Lab display order | Preserve source records but present common ICU lab codes in a stable scan order; unfamiliar/additional valid labs follow rather than being discarded. | CBC/coags/chemistry/liver/mineral results appear in a predictable grid |
| SEL-014 | Missing/unresulted lab | A lab that has no usable final source result is not fabricated into the available-results grid. Missing source records remain missing in history/issues. | Magnesium has no usable final result and therefore does not appear as a resulted lab tile |
| SEL-015 | Current pain | Select most recent valid pain score in encounter at/before report time. Group same-time mapped location/quality observations for display. | score 3, right chest, aching at 17:45; exclude entered-in-error score 10 |
| SEL-016 | BGM slot | For each configured fixture slot, select valid glucose observation within that slot window minimizing absolute time difference from target; tie => preserve conflict. | 08:00 -> 118 at 07:55; 12:00 -> 162 at 12:05; 16:00 -> 147 at 16:10 |
| SEL-017 | Shift UOP | Sum valid UOP observations with effective_time >= shift_start and <= min(report_time, shift_end). Exclude pre-shift values and missing values. | 365 mL from 07:30, 09:30, 12:00, 15:00, 18:00 |
| SEL-018 | Handoff fields | Include current handoff fields for active encounter, ordered by configured purpose priority and authored time. | To Do + Medications handoff fields |
| SEL-019 | Manual annotations | Include local report annotations for this report context but label them as report-only/non-Epic. | family visit reminder |
| SEL-020 | PMH/diagnoses/allergies | Preserve all valid current/source records for report context; do not collapse to one source string. | HTN + DM2; Sepsis + AKI; Penicillin allergy |
| SEL-021 | Report rhythm | Latest valid rhythm observation under SEL-006. | sinus tachycardia at 17:45 |
| SEL-022 | Pulse display | Select latest valid finding per actual source site + laterality, then group sites in report labels. | radial 2+ bilat; dorsalis pedis 1+ bilat |
| SEL-023 | Edema display | Include latest valid edema finding per source scope/laterality. | RLE 2+ pitting; LLE 1+ pitting |
| SEL-024 | Oxygen summary | Select each concept independently under SEL-006; do not treat device/flow/FiO2 as mutually exclusive. | HFNC 40 L/min, FiO2 50% |
| SEL-025 | Treatment / To Do | Project selected handoff fields + relevant nursing interventions + explicit manual annotations. Do not merge provenance. | source To Do + repositioning intervention + report-only family reminder |
| SEL-026 | Radiology | Include usable radiology DiagnosticReports from the active encounter at/before report time, sorted newest-first. Preserve multiple studies; exclude entered-in-error/cancelled/invalid source reports. Display study + time + status + source impression. | Current portable CXR first, prior CT chest second; exclude `rad-cxr-error` |

---

# Deterministic Selection Results

## Encounter / Header

```text
Patient: Jordan Example
Age: 48 (derived from DOB)
Encounter: enc-icu-001
Location: ICU 12
Code status: DNR / DNI
Weight: 82.4 kg
PMH: Hypertension; Type 2 diabetes mellitus
Diagnoses: Sepsis due to pneumonia; Acute kidney injury
Allergy: Penicillin -> hives
```

## Neuro

```text
A/O x3 - disoriented to time
Pupils: R 3 mm brisk | L 3 mm brisk
GCS: 14 (E4 V4 M6)
Strength: RUE 5 | LUE 5 | RLE 4 | LLE 4
NIHSS: missing/not documented in fixture
```

NIHSS is intentionally absent. The report must show that absence rather than `0`.

## Cardiac

```text
Rhythm: sinus tachycardia
Radial pulses: R 2+ | L 2+
Pedal display: R 1+ | L 1+
  source sites: dorsalis pedis right / dorsalis pedis left
Edema: RLE 2+ pitting | LLE 1+ pitting
```

## Respiratory

```text
Oxygen: high-flow nasal cannula
Flow: 40 L/min
FiO2: 50%
RUL: clear       [derived display from right_lung]
RML: clear       [derived display from right_lung]
RLL: clear       [derived display from right_lung]
LUL: diminished  [derived display from left_lung]
LLL: crackles    [source-direct lobe finding]
Vent settings: not documented / not applicable in fixture
```

## GI / Nutrition

```text
Abdominal source findings:
  consistency: soft
  tenderness: non-tender
  bowel sounds: hypoactive, all quadrants

Current nutrition:
  Mock Standard 1.5 via enteral tube
  45 mL/hr continuous
  free-water flush 150 mL q4h

Enteral device:
  Dobhoff tube, left nare
```

The old `Abdomen` and `Tube Feeds` paper boxes are report projections over separate source collections.

## GU

```text
Urine: clear yellow
Device: active Foley
Shift UOP through 18:30: 365 mL
Derived from:
  obs-uop-0730
  obs-uop-0930
  obs-uop-1200
  obs-uop-1500
  obs-uop-1800
Excluded:
  obs-uop-pre-shift (06:30, before shift_start)
```

## IV / LDA / Skin

Current LDA collection:

```text
Right IJ triple lumen CVC
Left forearm PIV
Foley catheter
Dobhoff tube
Sacral pressure injury, Stage 2
```

Excluded from current list:

```text
Right hand PIV - completed 2026-09-19 08:45
```

There is no four-line software cap.

## Drips

```text
Norepinephrine infusion: 0.03 mcg/kg/min, in progress
Source administration: med-admin-norepi-current
Order: med-order-norepi
Via: lda-cvc-001
```

Rejected as current:
- `med-admin-norepi-old` because its administration period ended at 17:10.
- `med-admin-vaso-stopped` because it ended at 10:15.
- `med-order-norepi` by itself is not sufficient evidence of current administration.

## BGM

Fixture-defined slot projection:

```text
08:00 -> 118 mg/dL from 07:55
12:00 -> 162 mg/dL from 12:05
16:00 -> 147 mg/dL from 16:10
```

`obs-bgm-0600` is retained as history but is not chosen for a slot.

## Pain

```text
Current pain: 3/10
Location: right chest
Quality: aching
Time: 17:45
```

The newer `10/10` value at 18:05 is **not selected** because its source status is `entered-in-error`.

## Labs

The report now renders **every usable lab result available for the active encounter**, newest valid result per distinct source lab code. The mock fixture currently produces 23 resulted lab tiles:

```text
WBC                 15.2 10^3/uL   HIGH
Red blood cells     3.15 10^6/uL   LOW
Hemoglobin           9.1 g/dL      LOW
Hematocrit          28.2 %         LOW
Platelets           210 10^3/uL
Prothrombin time     15.8 sec       HIGH
INR                   1.3           HIGH
aPTT                 32 sec

Sodium              139 mmol/L
Potassium             3.4 mmol/L    LOW
Chloride             104 mmol/L
CO2                   22 mmol/L
Anion gap             13 mmol/L
BUN                    34 mg/dL     HIGH
Creatinine              1.8 mg/dL   HIGH
eGFR                    42 mL/min/1.73m2 LOW
Calcium                  8.1 mg/dL   LOW

Albumin                  2.8 g/dL    LOW
Total protein             5.9 g/dL   LOW
ALT                        42 U/L
AST                        51 U/L     HIGH
Total bilirubin            0.9 mg/dL
Phosphorus                 2.4 mg/dL  LOW
```

The newer potassium result of 6.8 mmol/L is preserved in source history but excluded because it is `entered-in-error`.

Magnesium remains intentionally not documented in the fixture and is **not fabricated into the available-results grid**.

The full-width lab section is a presentation decision; the canonical model remains a generic repeating collection of lab Observations.

## Radiology

```text
Portable chest radiograph
  09/20 16:40
  FINAL
  Impression: Persistent bibasilar airspace opacities, right greater than left, with small bilateral pleural effusions.

CT chest with contrast
  09/18 17:05
  FINAL
  Impression: Multifocal bilateral lower-lobe predominant airspace disease with small bilateral pleural effusions.
```

Excluded:
- `rad-cxr-error` because its source status is `entered-in-error`.

Full source findings remain preserved in the normalized radiology records and are not rewritten by the report layer.

## Treatment / To Do

Source-backed:
- recheck potassium after replacement; continue oxygen wean as tolerated
- norepinephrine infusion remains active
- repositioned patient at 17:00

Report-only annotation:
- family plans to visit after 19:00

These must remain visually/provenance-distinct in the eventual UI.

---

# Derived Values Produced by This Fixture

| Derived key | Value | Source IDs |
|---|---|---|
| `patient.age_years` | 48 | patient birth date |
| `respiratory.rul_effective` | clear | obs-lung-right |
| `respiratory.rml_effective` | clear | obs-lung-right |
| `respiratory.rll_effective` | clear | obs-lung-right |
| `respiratory.lul_effective` | diminished | obs-lung-left |
| `respiratory.lll_effective` | crackles | obs-lung-lll |
| `gu.shift_uop_ml` | 365 mL | obs-uop-0730, obs-uop-0930, obs-uop-1200, obs-uop-1500, obs-uop-1800 |
| `bgm.slot_0800` | 118 mg/dL | obs-bgm-0755 |
| `bgm.slot_1200` | 162 mg/dL | obs-bgm-1205 |
| `bgm.slot_1600` | 147 mg/dL | obs-bgm-1610 |

---

# Selection Tests This Fixture Must Pass

1. **Entered-in-error beats recency:** pain 10 and K 6.8 are newer but must not be selected.
2. **Encounter scoping:** only `enc-icu-001` data drive this report.
3. **Effective-period logic:** old location, old code status, completed PIV, old drip segment, and stopped vasopressin stay in history but do not appear current.
4. **Source vs derived:** RUL/RML/RLL inherit right-lung clear only in report projection; source remains one right-lung observation.
5. **Missing is visible:** NIHSS and magnesium do not become 0 or normal.
6. **Paper slots are projections:** BGM slots come from timestamped observations.
7. **Shift math is explicit:** UOP excludes the 06:30 pre-shift measurement.
8. **Order vs administration:** norepinephrine order does not independently prove infusion state.
9. **No row cap:** all active LDAs remain available regardless of the old four-row paper layout.
10. **Narrative provenance remains distinct:** Epic/source handoff, structured nursing intervention, and manual report annotation cannot be merged without labels.
11. **Labs are source-driven:** every usable current lab code can render without changing the schema or UI allowlist; missing/unresulted tests are not invented.
12. **Radiology preserves source impressions:** multiple encounter studies remain available, newest first, while entered-in-error reports are excluded.

## Pass condition

If an implementation produces the deterministic results in this document from `15_MOCK_ICU_FIXTURE.json`, the first normalization/selection vertical slice passes.
