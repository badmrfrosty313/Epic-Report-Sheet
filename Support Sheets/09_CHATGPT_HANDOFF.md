# ChatGPT Handoff

## Project
Epic Report Sheet

## Objective
Build a digital ICU nursing report system that ingests structured patient/encounter data, preserves Epic/EHR source semantics and provenance, and projects that data into a fast nurse-friendly handoff view with screen and print/export output.

## Current State — 2026-09-20
- Repo: `badmrfrosty313/Epic-Report-Sheet`.
- ICU is the first target workflow.
- Application code has not started.
- `Support Sheets/14_ICU_NORMALIZED_MODEL.md` is complete and is now the canonical model specification.
- The two-page ICU PDF has been fully inventoried.
- **All prototype fields have now been mapped conceptually to Epic/FHIR source domains.**
- The comprehensive map is `Support Sheets/13_EPIC_SOURCE_MAP.md`.
- The source map is based on Epic's public FHIR/API catalog and specifications; exact customer-specific flowsheet/LDA codes remain deployment configuration.
- Live Epic access is not required for v0.1.
- Mock/de-identified source-shaped fixtures only during prototype development.

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
Build the **first realistic source-shaped mock ICU fixture** from `14_ICU_NORMALIZED_MODEL.md`, then define the explicit selection-policy table that produces the deterministic nurse-report snapshot.

The fixture must include:
1. patient + encounter context
2. code status / PMH / diagnoses / allergies
3. timestamped bedside observations
4. at least one LDA/device
5. nutrition order
6. medication order + administration/drip
7. lab results
8. handoff / intervention / note references
9. manual report annotation
10. source/provenance IDs
11. at least one missing datum
12. at least one stale/conflicting value so selection logic is tested

Then choose the implementation stack and build the first report projection.
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
