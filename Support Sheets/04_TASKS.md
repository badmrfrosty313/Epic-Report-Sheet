# Task Board

## Project State
**Active as of 2026-09-20.** The full ICU prototype has now been mapped source-first against Epic's public FHIR/API surface. The old paper layout remains a workflow/display reference, not the canonical schema.

## Now
- [x] Choose the first target unit/workflow: ICU.
- [x] Add and inspect `Report Sheet V.2 ICU - Prototype.pdf`.
- [x] Inventory every visible field and section.
- [x] Classify the full ICU sheet by data behavior.
- [x] Adopt Epic/source reality as the modeling authority.
- [x] Identify conceptual Epic/FHIR source domains for every prototype field.
- [x] Build the comprehensive field-to-source map in `13_EPIC_SOURCE_MAP.md`.
- [x] Separate source-backed facts, derived report values, and manual report annotations.
- [x] Decide that BGM and Pain are time-based source observations rather than fixed report-only scalar fields.
- [x] Decide that IV access/LDA, skin/wounds, drips, nutrition, labs, and treatment/handoff should follow their native source collections rather than paper-row limits.

## Next
- [x] Define the canonical normalized ICU data model in `14_ICU_NORMALIZED_MODEL.md`.
- [ ] Build the first realistic source-shaped mock ICU fixture.
- [ ] Define the explicit current-value / recency / encounter-selection policy table against that fixture.
- [ ] Finalize the first ICU vertical-slice requirements using the normalized model and selection policies.
- [ ] Choose the implementation stack based on the now-known model and UI requirements.
- [ ] Build the first working ICU report from mock source-shaped data.
- [ ] Add expandable source-detail views where useful.
- [ ] Add print/export behavior.

## Later / Deployment Adapter
- [ ] Validate customer-specific Epic mappings with a target organization:
  - encoded FLO IDs / assessment codes
  - local value lists
  - LDA type/property codes
  - room/bed exposure
  - Purewick representation
  - enteral-rate/FWF exposure
  - handoff field purposes
  - authorization, scopes, security, and environment configuration
- [ ] Build the authorized Epic/EHR ingestion adapter if feasible.
- [ ] Validate the report against a realistic ICU shift-handoff scenario.
- [ ] Refine layout and prioritization from nurse workflow feedback.
- [ ] Add a second unit template to prove the architecture generalizes.
- [ ] Document setup and end-user workflow.
- [ ] Decide whether the project should progress from prototype to deployable clinical software.

## Testing
- [ ] Test missing/optional/repeating data.
- [ ] Test source-vs-derived separation and provenance.
- [ ] Test encounter/time selection logic.
- [ ] Test conflicting/superseded source values.
- [ ] Test LDA/device lifecycle data.
- [ ] Test timestamped BGM, UOP, pain, and assessment history.
- [ ] Test lab code/value/unit/range/flag handling.
- [ ] Test realistic long values and expandable detail.
- [ ] Test print/PDF output.
- [ ] Run a manual ICU nursing-workflow validation.

## Completed Artifacts
- [x] `10_ICU_FIELD_INVENTORY.md`
- [x] `11_ICU_FIELD_CLASSIFICATION.md`
- [x] `12_ICU_MODEL_DECISIONS.md`
- [x] `13_EPIC_SOURCE_MAP.md`
- [x] `14_ICU_NORMALIZED_MODEL.md`
- [x] Governing source-preservation rule.
- [x] Epic-first model-authority decision.

## Blocked
- Live Epic integration remains blocked on a real organization's authorized access, local mappings, scopes, and deployment environment.
- This does **not** block the mock/source-shaped v0.1.

## Finish Line for v0.1
A realistic source-shaped mock ICU patient/encounter goes in and a useful, readable, printable nurse report comes out. The report preserves source provenance and makes derived/report-only values distinguishable. No live Epic connection is required.

## Next Starting Point
Read `14_ICU_NORMALIZED_MODEL.md`, then create the **realistic source-shaped mock ICU fixture** and selection-policy table. Do not return to paper-field modeling.
