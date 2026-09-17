# Test Plan

## Core Behaviors
| Test ID | Behavior | Expected Result | Status |
|---|---|---|---|
| T-001 | Load a valid mock patient. | Data are accepted and normalized without losing required values. | Not implemented |
| T-002 | Render the first unit report from normalized data. | Every mapped field appears in the intended location with correct values. | Not implemented |
| T-003 | Omit an optional field. | Report remains readable and clearly handles the missing value. | Not implemented |
| T-004 | Omit a required field. | Validation identifies the missing data; the application does not invent a clinical value. | Not implemented |
| T-005 | Supply multiple repeating items. | Diagnoses/lines/drains/etc. render without data loss or layout corruption. | Not implemented |
| T-006 | Supply unusually long realistic values. | Layout remains usable or handles overflow intentionally. | Not implemented |
| T-007 | Print/export the report. | Printed/PDF result preserves essential content and readability. | Not implemented |
| T-008 | Change input source adapter while preserving normalized data. | Report output does not depend on source-specific field names. | Future |

## Unit Tests
- Patient/report model validation.
- Required vs optional fields.
- Normalization of repeating collections.
- Source-adapter mapping once adapters exist.
- Template/report transformation logic that is not purely visual.

## Integration Tests
- Input fixture -> normalization -> report model.
- Normalized model -> selected unit template -> rendered report.
- Report -> print/export pipeline.

## End-to-End Tests
- Load one realistic mock patient and produce the complete first report.
- Load several distinct mock patients to prove the layout is not tuned to one happy-path fixture.
- Run the intended nurse workflow from start to usable report without developer intervention.

## Edge Cases
- Missing data.
- Empty strings vs true null/unavailable values.
- Very long patient names/diagnoses/instructions.
- Multiple items in sections that normally contain one item.
- Unit-specific fields absent from the source fixture.
- Values that should not be silently truncated.

## Failure / Recovery Tests
- Invalid fixture format.
- Wrong data type.
- Required field unavailable.
- Print/export failure.
- Unknown unit/template selection.

## Performance Tests
- v0.1 target is interactive/local use; no formal load target yet.
- Rendering one report should feel immediate on the development machine.
- Add measured performance requirements only when a real bottleneck or deployment scenario exists.

## Security Tests
- Verify no real PHI exists in committed fixtures/test data.
- Verify secrets/credentials are not required or committed in v0.1.
- Future integration testing must include authorization, least privilege, data exposure, audit, and transport/storage controls appropriate to the deployment environment.

## Manual Verification Checklist
- [ ] Report matches the defined nursing workflow rather than merely looking polished.
- [ ] Most important information is visually easy to find.
- [ ] Missing information cannot be mistaken for a normal/negative clinical finding.
- [ ] Repeating data do not break the layout.
- [ ] Printed/PDF report is usable without manual cleanup.
- [ ] A realistic handoff can be completed using the generated report.
- [ ] No real patient information is present in repository test artifacts.
