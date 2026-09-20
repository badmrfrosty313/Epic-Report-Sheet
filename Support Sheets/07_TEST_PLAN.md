# Test Plan

## Core Behaviors
| Test ID | Behavior | Expected Result | Status |
|---|---|---|---|
| T-001 | Load a valid mock patient. | Data are accepted and normalized without losing required values. | **Passed automated** |
| T-002 | Render the first unit report from normalized data. | Every mapped field appears in the intended location with correct values. | **Executable/build passes; visual validation pending** |
| T-003 | Omit an optional field. | Report remains readable and clearly handles the missing value. | **Passed automated for missing Mg/NIHSS; visual validation pending** |
| T-004 | Omit a required field. | Validation identifies the missing data; the application does not invent a clinical value. | Not yet separately implemented |
| T-005 | Supply multiple repeating items. | Diagnoses/lines/drains/etc. render without data loss or layout corruption. | **Passed automated selection/build; visual overflow validation pending** |
| T-006 | Supply unusually long realistic values. | Layout remains usable or handles overflow intentionally. | Not yet tested |
| T-007 | Print/export the report. | Printed/PDF result preserves essential content and readability. | **Implemented; manual print/PDF validation pending** |
| T-008 | Change input source adapter while preserving normalized data. | Report output does not depend on source-specific field names. | Future |

## Automated Tests Implemented
- Patient header/location/code-status/weight/age selection.
- Source-vs-derived separation.
- Missing magnesium and NIHSS remain missing.
- Repeating active LDA selection with completed device exclusion.
- Side-level lung finding inheritance with lobe-specific source override.
- Shift-window UOP calculation.
- BGM slot projection from timestamped readings.
- Pain selection rejects newer entered-in-error observation.
- Lab selection rejects newer entered-in-error potassium result.
- H/H display derives from separate hemoglobin/hematocrit source records.
- Current drip comes from administration state, not merely medication order intent.
- Manual report annotations remain distinct from source-backed handoff.

## Unit Tests Still Needed
- Runtime fixture/schema validation for malformed input.
- Required-field validation rules once the final nurse workflow defines what is truly required.
- Additional conflict/tie cases.
- Source-adapter mapping once adapters exist.

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
