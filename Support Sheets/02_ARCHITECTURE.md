# Architecture

## System Overview
Epic Report Sheet will be built around a deliberately boring boundary: data comes in, is normalized into our own patient/report model, and is then rendered by a unit-specific report template. The prototype must work entirely with mock/local data. A future Epic/EHR connector can replace or supplement the input adapter without forcing the report logic to be rewritten.

## Major Components
| Component | Responsibility | Technology |
|---|---|---|
| Input Adapter | Accept mock/manual data now; later translate authorized EHR data into the internal model. | TBD |
| Patient / Report Model | Canonical structured representation used by the application. | TBD |
| Validation / Normalization | Validate types, required fields, missing values, and repeating clinical data. | TBD |
| Report Engine | Select and assemble the correct unit-specific report view. | TBD |
| Unit Template | Define which data are shown and how they are organized for a specific workflow. | TBD |
| User Interface | Display the report and any prototype data-entry/loading controls. | TBD |
| Print / Export Layer | Produce a print-friendly representation of the report. | TBD |

## Data Flow
1. Mock/manual data enter through an input adapter.
2. The adapter converts source-specific fields into the canonical patient/report model.
3. Validation/normalization identifies missing or invalid data.
4. The report engine selects the appropriate unit template.
5. The UI renders the report from normalized data.
6. The same normalized report can be formatted for printing/export.

## External Systems / APIs
- None required for the first prototype.
- Epic/EHR integration is a later feasibility phase and must use an authorized method.
- Possible future integration mechanisms are intentionally undecided until access/export capabilities are researched.

## Data Storage
- Database: Not required for the first vertical slice unless persistence becomes necessary.
- Files: Local mock-data fixtures may be used during development/testing.
- Cache: None planned initially.
- Other: No PHI in the prototype repository or test fixtures.

## Interfaces
- UI: Local application interface, exact framework TBD after workflow definition.
- API: None required initially.
- CLI: Optional development/testing convenience only.
- Hardware: Standard development computer and printer/PDF output for report validation.
- Other: Future EHR input adapter behind the normalization boundary.

## Security / Permissions
- Use mock/de-identified data during prototype development.
- Never commit credentials, tokens, PHI, or real patient exports.
- A future deployed clinical version would require authenticated access, least privilege, auditability, secure transport/storage, and organizational approval.

## Deployment / Runtime Environment
- Development: Local Windows development environment.
- Test: Local prototype using deterministic mock patient fixtures.
- Production: Not defined. Production architecture depends on the authorized hospital/EHR integration path and security requirements.

## Architecture Diagram
```text
[Mock / Manual Data]             [Future Authorized EHR Source]
         |                                   |
         v                                   v
 [Prototype Adapter]                 [Future EHR Adapter]
         |                                   |
         +---------------+-------------------+
                         |
                         v
              [Normalized Patient Model]
                         |
                         v
               [Validation / Rules]
                         |
                         v
                  [Report Engine]
                         |
              +----------+----------+
              |                     |
              v                     v
      [Unit Report Template]   [Future Templates]
              |
              v
       [Screen + Print/Export]
```

## Architectural Rule
No presentation component should need to know whether data came from a mock JSON/file, manual entry, an Epic export, FHIR, or another future source. Source-specific translation belongs at the input boundary.
