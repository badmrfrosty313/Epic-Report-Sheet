# Decision Log

Use this file to prevent us from repeatedly reopening settled questions.

| Date | Decision | Reason | Alternatives Rejected | Revisit? |
|---|---|---|---|---|
| 2026-09-17 | Build the workflow/report prototype before attempting live Epic integration. | The product value can be validated independently of EHR connectivity, and access capabilities are not yet known. | Blocking the entire build on Epic access. | No |
| 2026-09-17 | Use mock or safely de-identified patient data during prototype development. | Keeps early development independent of clinical systems and avoids unnecessary PHI/privacy risk. | Using real patient exports for convenience. | No |
| 2026-09-17 | Separate source ingestion, normalized patient data, and report presentation. | Lets us change the eventual EHR input method or add unit templates without rebuilding the whole application. | Directly binding UI fields to Epic/source-specific fields. | No |
| 2026-09-17 | Define one real nursing workflow first, then expand. | A narrow vertical slice can be validated quickly and prevents an everything-for-every-unit design spiral. | Designing every possible unit/report up front. | No |
| 2026-09-17 | Do not lock the implementation stack before defining the first workflow/interface needs. | Architecture should follow the actual product requirements rather than a premature framework choice. | Picking a framework merely to start coding. | Yes, immediately after workflow definition |

## Open Decisions
- Which nursing unit/workflow is the first target?
- Exactly which fields belong on the first report sheet?
- What is the first interaction model: generated-only report, lightweight manual entry, or both?
- What output format best validates the workflow first: browser/local UI, printable page, or a combination?
- What authorized Epic/EHR data-access or export options would realistically exist in a later deployment environment?

## Assumptions
- The useful report layout differs by nursing unit.
- Much of the information nurses manually collect for report already exists somewhere in the EHR, although availability and access method must be verified field by field.
- A normalized internal model can represent the first report independently of the eventual data source.
- A prototype using realistic mock data is sufficient to validate the core workflow.

## Known Tradeoffs
- Mock data proves workflow and software behavior but does not prove Epic integration feasibility.
- A first-unit focus intentionally postpones broader template design.
- Delaying the tech-stack decision costs almost nothing now and reduces the chance of choosing tools that fight the actual interface requirements.
