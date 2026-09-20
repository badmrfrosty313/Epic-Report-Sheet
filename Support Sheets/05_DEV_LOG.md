# Development Log

Add a short entry at the end of each work session.

---

## 2026-09-17 - Project Kickoff

### What We Worked On
- Converted the generic bootstrap support sheets into project-specific documentation for Epic Report Sheet.
- Established the first-build strategy before writing application code.

### What Changed
- Defined the project as a nursing workflow/report-generation system rather than an Epic clone.
- Established a source adapter -> normalized patient model -> report engine/template -> screen/print architecture.
- Defined v0.1 around mock data and one first-unit workflow.
- Created the initial requirements, task board, test strategy, and decision log.

### What Works
- GitHub repository exists and is cloned to the local desktop.
- Project support/documentation system is in place.
- The prototype has a concrete finish line independent of live Epic access.

### What Is Broken / Uncertain
- No application code exists yet.
- First target unit/workflow had not yet been selected at initial kickoff.
- Exact first-report fields had not yet been defined.
- Future Epic/EHR access/export method is unknown and intentionally not blocking v0.1.

### Files Changed
- Support Sheets/00_PROJECT_CONTEXT.md
- Support Sheets/01_REQUIREMENTS.md
- Support Sheets/02_ARCHITECTURE.md
- Support Sheets/03_DECISIONS.md
- Support Sheets/04_TASKS.md
- Support Sheets/05_DEV_LOG.md
- Support Sheets/06_TECH_STACK.md
- Support Sheets/07_TEST_PLAN.md
- Support Sheets/08_IDEAS_PARKING_LOT.md
- Support Sheets/09_CHATGPT_HANDOFF.md
- Support Sheets/README.md

### Next Starting Point
- Define the first report's purpose and nursing workflow.
- Choose the first target unit/workflow.
- Enumerate the exact information that belongs on that report before selecting the implementation stack.

### Commands / Setup Worth Remembering
```text
# Local repo already cloned.
# Before beginning a new session after remote documentation changes:
git pull
```

---

## 2026-09-17 - ICU Prototype Added

### What We Worked On
- Added a concrete prototype artifact to the project workflow.
- Resolved the first target unit.

### What Changed
- `Support Sheets/Report Sheet V.2 ICU - Prototype.pdf` is now the v0.1 design anchor.
- ICU is now explicitly the first unit/workflow target.
- The task board was changed from "choose a first unit" to "extract the ICU prototype into a structured field specification."

### What Works
- We no longer need to invent the first report layout from scratch.
- The project now has a concrete artifact that can be decomposed into data requirements before implementation.

### What Is Broken / Uncertain
- The PDF still needs to be inspected field by field.
- We have not yet classified which fields can be auto-populated, which need nurse input, and which are calculated/repeating.
- Epic/EHR source mapping remains intentionally later than the report-field inventory.

### Files Changed
- Support Sheets/Report Sheet V.2 ICU - Prototype.pdf
- Support Sheets/00_PROJECT_CONTEXT.md
- Support Sheets/03_DECISIONS.md
- Support Sheets/04_TASKS.md
- Support Sheets/05_DEV_LOG.md
- Support Sheets/09_CHATGPT_HANDOFF.md

### Next Starting Point
- Inspect the ICU prototype itself.
- Build the first field inventory directly from the sheet rather than brainstorming a new report.

### Commands / Setup Worth Remembering
```text
git pull
```

---

## 2026-09-17 - ICU Field Model Checkpoint / WGU Pause

### What We Worked On
- Inspected the uploaded two-page ICU prototype and converted every visible section/field into a field inventory.
- Began classifying the prototype into a normalized data model rather than treating it as a flat digital form.
- Locked several Neuro/header modeling decisions and the project-wide source-preservation rule.

### What Changed
- Created `10_ICU_FIELD_INVENTORY.md` from the actual prototype.
- Created `11_ICU_FIELD_CLASSIFICATION.md` for behavior/cardinality classification.
- Created `12_ICU_MODEL_DECISIONS.md` for settled field-level decisions.
- PMH, Diagnosis, and Allergies are discrete repeating lists.
- A/O stores the final level plus specific deficits when abnormal.
- Pupils preserve right/left size and reaction separately; equality is derived.
- GCS preserves Eye/Verbal/Motor plus total.
- NIHSS preserves full component detail plus total, with compact default display and expandable detail.
- Extremity strength preserves RUE/LUE/RLE/LLE grades separately.
- Governing rule established: preserve clinically relevant source data as source data; derived values stay separate and never overwrite source facts; missing source data stay missing.

### Current Project State
- Application code has **not** started.
- Field inventory is complete.
- Field classification/model design is in progress.
- The project is intentionally paused because two additional WGU classes became available and school work is taking priority.

### Exact Resume Point
- Resume at the **Cardiac** section.
- Rhythm follows the source-preservation rule.
- Next unresolved structure: bilateral radial/pedal pulses and repeating edema findings with source-provided location/laterality/grade/type/detail.
- After Cardiac, continue Respiratory -> GI -> GU -> remaining repeated/conditional sections.

### Do Not Redo
- Do not re-inspect the PDF from scratch.
- Do not reopen settled Header/Neuro decisions without new evidence.
- Do not choose a framework yet.
- Do not begin Epic API/source mapping until the report field behavior pass is complete.

### Files Changed This Checkpoint
- Support Sheets/00_PROJECT_CONTEXT.md
- Support Sheets/03_DECISIONS.md
- Support Sheets/04_TASKS.md
- Support Sheets/05_DEV_LOG.md
- Support Sheets/09_CHATGPT_HANDOFF.md
- Support Sheets/11_ICU_FIELD_CLASSIFICATION.md
- Support Sheets/12_ICU_MODEL_DECISIONS.md

### Commands / Setup Worth Remembering
```text
# Remote support docs were updated directly through GitHub.
git pull
```


---

## 2026-09-20 - Comprehensive Epic-First Source Map

### What We Worked On
- Switched from one-field-at-a-time paper modeling to a comprehensive source-first pass.
- Researched Epic's public FHIR/API catalog and specifications in parallel across demographics, diagnoses, allergies, code status, observations, LDA-W, nutrition, medications, labs, handoff, clinical notes, nursing interventions, and provenance.
- Mapped every field on the ICU prototype to a source family, presentation derivation, manual annotation, or explicit deployment-specific mapping.

### What Changed
- Created `13_EPIC_SOURCE_MAP.md`.
- Completed ICU field behavior/source-family classification.
- Epic/source reality is now the schema authority; the PDF is a workflow/display reference.
- BGM and Pain are repeating timestamped observations.
- Labs are a generic coded collection rather than hard-coded schema properties.
- IV/LDA, wounds, feeding tubes, and Foley use source LDA/device structures when available.
- Drips separate administration from order intent.
- Treatment/To Do is a projection of handoff/intervention/note data plus explicit report annotations.
- Generic `Misc` is no longer a canonical clinical-data field.

### What We Learned
- Epic publicly exposes strong standard resource families for demographics, encounter diagnoses, allergies, code status, nutrition orders, medication administrations, labs, handoff documents, clinical notes, LDA-W, and nursing interventions.
- Many bedside nursing flowsheet values remain customer/environment specific. Encoded flowsheet IDs and local value lists cannot be safely invented from public docs.
- That customer-specific uncertainty belongs in the future source adapter, not in the core product model.

### Project State
- Conceptual source identification: complete.
- Prototype field-to-source mapping: complete.
- Customer-specific Epic binding: intentionally deferred.
- Application code: not started.

### Next Starting Point
Define the canonical normalized ICU model from `13_EPIC_SOURCE_MAP.md`, then create realistic source-shaped mock fixtures and select the implementation stack.

### Local Sync
```text
git pull
```


---

## 2026-09-20 - Canonical ICU Normalized Model

### What We Worked On
- Parallelized the model design across shared primitives, encounter/provenance, observations/assessments, LDA-W devices, nutrition, medications, labs, handoff/notes/interventions, derived values, and selection policy.
- Consolidated those workstreams into one coherent source-shaped ICU model.

### What Changed
- Created `14_ICU_NORMALIZED_MODEL.md`.
- Defined the top-level `IcuReportContext`.
- Defined shared source/provenance/code/quantity/availability/derived-value primitives.
- Defined canonical collections for patient, encounter, code status, conditions, allergies, observations, LDA-W, nutrition orders, medication orders/administrations, labs, handoff fields, clinical notes, nursing interventions, manual annotations, provenance, and normalization issues.
- Defined the adapter boundary and report-projection boundary.
- Defined explicit selection-policy architecture instead of a global “latest wins” rule.
- Defined v0.1 model acceptance criteria and the mock-fixture contract.

### Public Epic Verification
- Re-verified Epic public R4 surfaces for Patient, Encounter, Encounter Diagnosis, AllergyIntolerance, Assessments, NutritionOrder, Labs, Handoff, Clinical Notes, LDA-W, MedicationRequest, and the broader public catalog.
- Kept customer-specific FLO IDs/value lists/LDA codes outside the canonical model.

### Project State
- Epic conceptual source map: complete.
- Canonical normalized ICU model: complete.
- Application code: not started.

### Next Starting Point
Create the first realistic source-shaped ICU fixture and the selection-policy table that turns it into a deterministic report snapshot.

### Local Sync
```text
git pull
```
