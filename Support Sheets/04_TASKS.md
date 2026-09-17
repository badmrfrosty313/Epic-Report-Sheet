# Task Board

## Project State
**Paused checkpoint as of 2026-09-17.** Two additional WGU classes became available, so school work temporarily takes priority. Do not restart project discovery when returning.

## Now
- [x] Choose the first target unit/workflow: ICU.
- [x] Add the existing ICU report-sheet prototype to the repository.
- [x] Inspect `Report Sheet V.2 ICU - Prototype.pdf` section by section.
- [x] Convert every visible section/field into a structured field inventory.
- [ ] Complete field-behavior/model classification for the entire ICU sheet.
  - [x] Header list behavior locked for PMH, Diagnosis, Allergies.
  - [x] Neuro behavior locked for A/O, pupils, GCS/EMV, NIHSS, and extremity strength.
  - [ ] **RESUME HERE: Cardiac** — rhythm source preservation, bilateral radial/pedal pulses, repeating edema findings.
  - [ ] Respiratory.
  - [ ] GI.
  - [ ] GU.
  - [ ] IV access detail pass.
  - [ ] Skin detail pass.
  - [ ] IV drips detail pass.
  - [ ] BGM behavior.
  - [ ] Pain behavior.
  - [ ] Treatment/lab metadata pass.
- [ ] Mark every remaining field as required, optional, repeating, calculated/derived, source-preserved, or free-text as appropriate.
- [ ] Capture why each unresolved field matters in ICU handoff/workflow.

## Next
- [ ] Identify where each required data element conceptually lives in Epic/EHR workflow.
- [ ] Determine which prototype fields can be auto-populated vs which should remain nurse-entered.
- [ ] Determine realistic authorized access/export options for those data.
- [ ] Build a field-mapping table: report field -> normalized model -> conceptual Epic/EHR source.
- [ ] Finalize the first ICU vertical-slice requirements.
- [ ] Choose the implementation stack based on those requirements.
- [ ] Define the normalized patient/report data model in code/schema form.
- [ ] Create realistic mock ICU patient fixtures.
- [ ] Build the first working ICU report from mock data.
- [ ] Add print/export behavior.

## Later
- [ ] Validate the report against a realistic ICU shift-handoff scenario.
- [ ] Refine layout and field prioritization from validation feedback.
- [ ] Add a second unit template to prove the architecture generalizes.
- [ ] Investigate and prototype an authorized automated EHR ingestion adapter if feasible.
- [ ] Document setup and end-user workflow.
- [ ] Decide whether the project should progress from prototype to deployable clinical software.

## Bugs
- None yet. Application implementation has not started.

## Testing
- [ ] Create model/validation tests once the data model exists.
- [ ] Test missing/optional/repeating data.
- [ ] Test source-vs-derived data separation.
- [ ] Test realistic long values against the report layout.
- [ ] Test print/PDF output.
- [ ] Run a manual ICU nursing-workflow validation of the first completed report.

## Completed
- [x] Project bootstrap/support sheets created.
- [x] GitHub repository created and cloned locally.
- [x] Initial project scope documented.
- [x] Initial architecture boundary documented.
- [x] Prototype privacy rule established: mock/de-identified data only.
- [x] ICU selected as first target.
- [x] `Report Sheet V.2 ICU - Prototype.pdf` added as v0.1 design anchor.
- [x] Full visible-field inventory created in `10_ICU_FIELD_INVENTORY.md`.
- [x] Field-level decision log created in `12_ICU_MODEL_DECISIONS.md`.
- [x] Governing source-preservation rule locked: preserve source facts, keep derived values separate, never invent normal defaults.
- [x] Pause/resume checkpoint documented before returning focus to WGU coursework.

## Blocked
- [ ] Live Epic integration — Blocker: authorized access method and deployment environment are not yet known. This does not block the prototype.

## Finish Line for v0.1
A realistic mock ICU patient goes in and a useful, readable, printable report matching the validated ICU workflow comes out. No live Epic connection is required for v0.1.

## Resume Command
After the school push, `git pull`, read `09_CHATGPT_HANDOFF.md`, then continue with **Cardiac pulses and edema**. Do not redo the prototype inventory or Neuro decisions.