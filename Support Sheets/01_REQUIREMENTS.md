# Requirements

These are initial product requirements. Field-level requirements will be refined after the first nursing workflow/report is defined.

## Functional Requirements
| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-001 | Represent one patient's report data in a structured internal model. | Must | Planned |
| FR-002 | Generate a readable nursing report sheet from structured patient data. | Must | Planned |
| FR-003 | Support a first unit-specific report template without hard-coding the entire system to one unit. | Must | Planned |
| FR-004 | Allow prototype data to be entered or loaded without a live Epic connection. | Must | Planned |
| FR-005 | Provide a print-friendly report output. | Must | Planned |
| FR-006 | Map each displayed report field to its conceptual source data so later integration is traceable. | Must | Planned |
| FR-007 | Distinguish unavailable/missing data from legitimate blank/negative values. | Must | Planned |
| FR-008 | Support additional unit templates later without rewriting the patient-data model. | Should | Planned |
| FR-009 | Support an authorized automated data-ingestion path later if a suitable Epic/EHR interface or export is available. | Could | Future |

## Non-Functional Requirements
| ID | Requirement | Priority | Status |
|---|---|---|---|
| NFR-001 | Prototype development must use mock or safely de-identified data, not real PHI. | Must | Active |
| NFR-002 | Report information must be quickly scannable during nursing handoff. | Must | Planned |
| NFR-003 | Data ingestion, normalized data, and presentation/template logic must remain separable. | Must | Planned |
| NFR-004 | The first prototype should run locally with minimal setup and no paid infrastructure requirement. | Should | Planned |
| NFR-005 | The system must fail visibly when required data is missing rather than silently inventing clinical information. | Must | Planned |
| NFR-006 | Future production integration must use authorized interfaces and organizational security/privacy controls. | Must | Future |

## User Stories
- As a bedside nurse, I want the important patient information organized into a consistent report sheet so that I can prepare for and conduct handoff without manually reconstructing the same information.
- As a nurse on a specific unit, I want the report to emphasize information relevant to that unit so that generic EHR data becomes useful at the bedside.
- As a developer, I want report fields mapped to a normalized data model so that the presentation can evolve independently of the eventual EHR data source.

## Inputs
- Initial prototype: mock patient data entered manually or loaded from a local fixture/file.
- Later: approved exports, standards-based interfaces, or other authorized EHR data sources after feasibility is established.

## Outputs
- On-screen nursing report sheet.
- Print-friendly report output.
- Documented mapping between report fields and source/conceptual EHR fields.

## Edge Cases
- Missing or stale data.
- Patient has multiple diagnoses, lines, drains, wounds, medications, precautions, or other repeating data.
- A field is irrelevant for one unit but important for another.
- Long text does not fit the normal report layout.
- Data source does not provide a desired report field.

## Failure Conditions
- Report displays invented/default clinical information as if it were real.
- Required data cannot be distinguished from missing data.
- Layout becomes unreadable when realistic patient data is used.
- Prototype architecture requires a live Epic connection to function.
- Unit customization requires duplicating the entire application.

## Acceptance Criteria for First Vertical Slice
- [ ] One first-unit workflow is defined.
- [ ] Required report fields for that workflow are documented.
- [ ] A realistic mock patient can be represented by the internal model.
- [ ] The application renders those data into a usable report sheet.
- [ ] Missing data is represented safely and clearly.
- [ ] The report can be printed/exported in a usable layout.
- [ ] A nurse can compare the prototype against the intended handoff workflow and identify concrete improvements.
