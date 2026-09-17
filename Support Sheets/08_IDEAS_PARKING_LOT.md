# Ideas / Parking Lot

Ideas go here so we do not derail the current build. v0.1 has one job: realistic mock patient in -> useful first-unit nursing report out.

| Idea | Value | Effort | Decision |
|---|---|---|---|
| Multiple unit-specific templates | High | Medium | Later, after first template works |
| Authorized automatic Epic/EHR ingestion | High | High/Unknown | Explore after workflow prototype |
| FHIR-based adapter if supported by deployment environment | High | Medium/High | Explore later |
| Import from an approved EHR export/file | High | Medium | Explore later |
| Tablet-optimized bedside view | Medium/High | Medium | Later |
| Configurable report-template designer | Medium | High | Later |
| Shift-to-shift comparison/highlight changes | Medium | High | Later |
| Organization-managed template library | Medium | High | Later |

## Wild Ideas
- Generate different views of the same normalized patient data for ICU, med-surg, ED, step-down, or other workflows.
- Let a unit configure what is emphasized without modifying application code.
- Highlight meaningful changes since the previous report while avoiding automated clinical interpretation beyond the available data.

## Future Versions
- v0.2: second unit template and stronger template abstraction.
- v0.x: persistence/workspace features only if the workflow proves they are useful.
- Integration phase: authorized EHR input adapter after access feasibility is known.
- Deployment phase: security, authentication, audit, organizational configuration, and production operations if the prototype advances that far.

## Things We Explicitly Are Not Building Yet
- Live Epic connectivity.
- A full EHR replacement.
- Every nursing specialty at once.
- A drag-and-drop template designer.
- Cloud infrastructure just because we can.
- AI-generated clinical conclusions or invented patient data.
- Production PHI storage.
