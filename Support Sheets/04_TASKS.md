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
- [x] Build the first realistic source-shaped mock ICU fixture in `15_MOCK_ICU_FIXTURE.json`.
- [x] Define the explicit current-value / recency / encounter-selection policy table in `16_ICU_SELECTION_POLICIES.md`.
- [x] Prove the deterministic nurse-report projection in `17_FIRST_REPORT_PROJECTION.md`.
- [x] Finalize the first ICU vertical-slice behavior using the normalized model, fixture, and selection policies.
- [x] Choose the implementation stack: TypeScript + React + Vite + Vitest.
- [x] Build the first working ICU report from mock source-shaped data.
- [x] Add expandable source-detail views with source/derived/report-only/missing provenance.
- [x] Add browser-native print/export behavior with print CSS.
- [ ] Run local nurse-workflow / visual validation of the interactive report.
- [ ] Validate Print / Save PDF output and refine layout if needed.

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
- [x] Test missing/optional/repeating data in the deterministic fixture.
- [x] Test source-vs-derived separation and provenance.
- [x] Test encounter/time selection logic.
- [x] Test conflicting/entered-in-error source values.
- [x] Test active vs historical LDA/device lifecycle behavior.
- [x] Test timestamped BGM, UOP, pain, and assessment selection.
- [x] Test selected lab values, H/H derivation, missing lab behavior, and entered-in-error exclusion.
- [ ] Test realistic long values and visual overflow handling.
- [ ] Test Print / Save PDF output manually.
- [ ] Run a manual ICU nursing-workflow validation.

## Completed Artifacts
- [x] `10_ICU_FIELD_INVENTORY.md`
- [x] `11_ICU_FIELD_CLASSIFICATION.md`
- [x] `12_ICU_MODEL_DECISIONS.md`
- [x] `13_EPIC_SOURCE_MAP.md`
- [x] `14_ICU_NORMALIZED_MODEL.md`
- [x] `15_MOCK_ICU_FIXTURE.json`
- [x] `16_ICU_SELECTION_POLICIES.md`
- [x] `17_FIRST_REPORT_PROJECTION.md`
- [x] Governing source-preservation rule.
- [x] Epic-first model-authority decision.

## Blocked
- Live Epic integration remains blocked on a real organization's authorized access, local mappings, scopes, and deployment environment.
- This does **not** block the mock/source-shaped v0.1.

## Finish Line for v0.1
A realistic source-shaped mock ICU patient/encounter goes in and a useful, readable, printable nurse report comes out. The report preserves source provenance and makes derived/report-only values distinguishable. No live Epic connection is required.

## Next Starting Point
Pull the remote implementation locally, run the tests and dev server, then perform the first nurse-layout review: `git pull`, `npm install`, `npm run test:run`, `npm run dev`. Compare the browser report and Print / Save PDF output against the intended ICU handoff workflow before adding more features.
