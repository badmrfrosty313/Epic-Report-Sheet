# Task Board

## Now
- [ ] Define the first report's purpose and exact nursing workflow.
- [ ] Choose the first target unit/workflow.
- [ ] Capture the information the nurse needs during that workflow and why each field matters.

## Next
- [ ] Identify where each required data element conceptually lives in Epic/EHR workflow.
- [ ] Determine realistic authorized access/export options for those data.
- [ ] Build a field-mapping table: report field -> normalized model -> conceptual Epic/EHR source.
- [ ] Finalize the first vertical-slice requirements.
- [ ] Choose the implementation stack based on those requirements.
- [ ] Define the normalized patient/report data model.
- [ ] Create realistic mock patient fixtures.
- [ ] Build the first working report from mock data.
- [ ] Add print/export behavior.

## Later
- [ ] Validate the report against a realistic shift-handoff scenario.
- [ ] Refine layout and field prioritization from validation feedback.
- [ ] Add a second unit template to prove the architecture generalizes.
- [ ] Investigate and prototype an authorized automated EHR ingestion adapter if feasible.
- [ ] Document setup and end-user workflow.
- [ ] Decide whether the project should progress from prototype to deployable clinical software.

## Bugs
- None yet. Implementation has not started.

## Testing
- [ ] Create model/validation tests once the data model exists.
- [ ] Test missing/optional/repeating data.
- [ ] Test realistic long values against the report layout.
- [ ] Test print/PDF output.
- [ ] Run a manual nursing-workflow validation of the first completed report.

## Completed
- [x] Project bootstrap/support sheets created.
- [x] GitHub repository created and cloned locally.
- [x] Initial project scope documented.
- [x] Initial architecture boundary documented.
- [x] Prototype privacy rule established: mock/de-identified data only.

## Blocked
- [ ] Live Epic integration — Blocker: authorized access method and deployment environment are not yet known. This does not block the prototype.

## Finish Line for v0.1
A realistic mock patient goes in and a useful, readable, printable first-unit nursing report sheet comes out. No live Epic connection is required for v0.1.
