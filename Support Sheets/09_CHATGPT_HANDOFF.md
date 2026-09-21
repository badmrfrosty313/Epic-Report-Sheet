# ChatGPT Handoff

## Project
Epic Report Sheet

## Objective
Build a digital ICU nursing report system that ingests structured patient/encounter data, preserves Epic/EHR source semantics and provenance, and projects that data into a fast nurse-friendly handoff view with screen and print/export output.

## Current State — 2026-09-20
- Repo: `badmrfrosty313/Epic-Report-Sheet`.
- ICU is the first target workflow.
- Application code has started and the first executable v0.1 vertical slice is implemented.
- `Support Sheets/14_ICU_NORMALIZED_MODEL.md` is complete and is now the canonical model specification.
- `15_MOCK_ICU_FIXTURE.json`, `16_ICU_SELECTION_POLICIES.md`, and `17_FIRST_REPORT_PROJECTION.md` now provide the first deterministic end-to-end mock vertical slice.
- The two-page ICU PDF has been fully inventoried.
- **All prototype fields have now been mapped conceptually to Epic/FHIR source domains.**
- The comprehensive map is `Support Sheets/13_EPIC_SOURCE_MAP.md`.
- The source map is based on Epic's public FHIR/API catalog and specifications; exact customer-specific flowsheet/LDA codes remain deployment configuration.
- v0.1 stack is TypeScript + React + Vite + Vitest with plain CSS and browser-native print CSS.
- Automated selector tests and the Vite production build pass in GitHub Actions; the latest expanded regression pass is CI run #55 successful.
- Live Epic access is not required for v0.1.
- Mock/de-identified source-shaped fixtures only during prototype development.
- Report fields now expose source-time cues and pre-shift state without arbitrary medical staleness thresholds.
- Labs display numeric direction vs the immediately prior valid source result when available.
- Shift I/O snapshot is derived from explicit intake/output observations; UOP remains separate.
- To Do is promoted from source Handoff purpose while other handoff/interventions remain secondary context.
- Standard and high-density stress fixtures can be switched in-app.
- Print/PDF now has two output paths: a dedicated client-side **Save Portrait PDF** path that explicitly generates Letter portrait pages, and native **Print** for physical/system printer validation.
- The dedicated PDF path was added after Microsoft Print to PDF generated the stress report as a 5-page portrait Letter file with sideways landscape content.
- Print/PDF no longer relies on browser CSS column-flow pagination. It uses explicit fixed portrait grids: page 1 has dedicated left/right bedside columns; page 2 contains Labs, Radiology, and Treatment / To Do. This change was made after the third stress PDF produced a mostly blank page 2.

## Governing Architecture
`Epic/EHR adapter -> source-preserving normalized model -> validation/selection -> ICU report projection -> interactive UI + print/export`

### Epic-First Rule
Epic/source reality is the modeling authority. The ICU PDF is a workflow/display reference only. If the EHR stores a concept differently than the paper sheet, change the model and report rather than forcing Epic into paper boxes.

### Source-Preservation Rule
Preserve source values, codes, units, timestamps, statuses, cardinality, encounter context, and provenance where practical. Derived values stay separate and reference their source records. Missing data stay missing.

## What Is Now Mapped

### Header
- Patient -> Patient (Demographics)
- Encounter/room context -> Encounter + location/context, exact room/bed deployment-specific
- Age -> presentation-derived from demographic DOB when appropriate
- Weight -> Observation (Vital Signs)
- Code status -> Consent (Code Status)
- PMH -> Condition (Medical History)
- Diagnosis -> Condition (Encounter Diagnosis)
- Allergies -> AllergyIntolerance

### Bedside Assessments
Neuro, cardiac, respiratory, GI, GU, pain, BGM, UOP, and similar bedside findings use the **actual target Epic observation/flowsheet/assessment mapping**. Public Epic exposes Observation surfaces, but exact FLO IDs/value lists vary by organization/environment.

### Devices / LDA-W
IVs, Foley, feeding tubes, airways, and wound/LDA data -> Device + DeviceUseStatement + Observation (Lines, Drains, Airways), preserving LDA properties and assessments.

### Nutrition
Diet and enteral nutrition -> NutritionOrder. Tube-feed rate/FWF are source-dependent and must use whichever order/flowsheet fields the target environment actually exposes.

### IV Drips
Administered/current infusion state -> MedicationAdministration. Ordered intent -> medication-order resources where needed. Do not collapse order and administration into one record.

### Labs
Generic Observation (Labs) collection. The PDF lab list is a set of display selectors, not schema fields. `H/H` is a display combination of hemoglobin and hematocrit unless the source itself supplies a combined result.

### Radiology
Radiology is modeled as repeating DiagnosticReport (Results) records. Preserve study/code, report status, effective/issued times, source impression/conclusion, full findings, and imaging/study references when available. Nurse-facing display is study + time + status + **source impression**, newest-first for usable reports in the active encounter. Do not invent or AI-summarize a radiology interpretation.

### Treatment / Narrative
Handoff -> DocumentReference (Handoff) + Binary when available; nursing interventions -> Procedure (Nursing Intervention); selected notes -> DocumentReference (Clinical Notes). Report-only notes remain explicitly manual annotations.

## Important Presentation Decisions Already Locked
- A/O compact level + deficits when abnormal.
- Bilateral pupil values preserved; equality is derived.
- GCS E/V/M + total preserved.
- NIHSS full detail retained, total collapsed by default, expandable on click.
- Extremity strength preserved per limb.
- Cardiac pulse findings preserve actual source site/laterality.
- Edema repeating.
- FiO2 meaning confirmed.
- Side-level lung findings may derive lobe display values without fabricating lobe source records.
- Fixed BGM time boxes are presentation-only; source model is timestamped readings.
- Pain is repeating/time-based.
- Paper IV row limits do not constrain the model.
- Generic `Misc` is not a canonical clinical field.

## What Is Still Unknown
Public Epic docs do not provide universal customer-independent mappings for many nursing flowsheet items. A future target organization must supply/validate:
- FLO IDs / assessment codes / local value lists
- LDA types/properties
- Purewick representation
- room/bed exposure
- enteral rate/FWF source
- handoff field purposes
- security/scopes/authorization

These are adapter configuration, not blockers for the mock prototype.

## Exact Next Step
Run **both** fixture modes locally and do the human visual/print pass.

```text
git pull
npm install
npm run test:run
npm run dev
```

Browser:
- Standard fixture: `?fixture=standard`
- Stress fixture: `?fixture=stress`

Use `Support Sheets/19_UI_STRESS_AND_PRINT_CHECKLIST.md`.

For PDF testing, use **Save Portrait PDF** first. The exporter creates Letter portrait directly while the browser UI remains dual-column. Labs are intentionally pushed to a fresh portrait page. Use **Print** separately to validate physical/system-printer behavior.

The clinical selection regression was green at CI run #55; the newer PDF-export implementation must also pass the latest CI/build. Remaining work after that is nurse-eye validation of density, ordering, timestamps/trends, stress overflow, and generated PDF appearance. Do not add live Epic integration yet.
## Do Not Undo
- Do not rebuild the model field-for-field from the PDF.
- Do not invent universal Epic flowsheet IDs.
- Do not flatten source history to one current scalar in the canonical model.
- Do not merge source and derived/report-only data.
- Do not make live Epic connectivity a prerequisite for v0.1.
- Do not use PHI.

## Local Sync
Remote support docs were updated directly through GitHub:
```text
git pull
```
