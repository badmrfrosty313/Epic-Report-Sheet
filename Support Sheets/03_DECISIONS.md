# Decision Log

Use this file to prevent us from repeatedly reopening settled questions.

| Date | Decision | Reason | Alternatives Rejected | Revisit? |
|---|---|---|---|---|
| 2026-09-17 | Build the workflow/report prototype before attempting live Epic integration. | The product value can be validated independently of EHR connectivity, and access capabilities are not yet known. | Blocking the entire build on Epic access. | No |
| 2026-09-17 | Use mock or safely de-identified patient data during prototype development. | Keeps early development independent of clinical systems and avoids unnecessary PHI/privacy risk. | Using real patient exports for convenience. | No |
| 2026-09-17 | Separate source ingestion, normalized patient data, and report presentation. | Lets us change the eventual EHR input method or add unit templates without rebuilding the whole application. | Directly binding UI fields to Epic/source-specific fields. | No |
| 2026-09-17 | Define one real nursing workflow first, then expand. | A narrow vertical slice can be validated quickly and prevents an everything-for-every-unit design spiral. | Designing every possible unit/report up front. | No |
| 2026-09-17 | Do not lock the implementation stack before defining the first workflow/interface needs. | Architecture should follow the actual product requirements rather than a premature framework choice. | Picking a framework merely to start coding. | Yes, immediately after workflow definition |
| 2026-09-17 | ICU is the first target unit/workflow. | An existing ICU report-sheet prototype provides a concrete artifact and domain-tested starting point. | Starting from a generic all-unit report. | No |
| 2026-09-17 | `Report Sheet V.2 ICU - Prototype.pdf` is the v0.1 design anchor. | The first software version should reproduce and automate a real report workflow before redesigning it. | Inventing a fresh UI before extracting requirements from the existing prototype. | Yes, after the first working version is validated |
| 2026-09-17 | Preserve source data as source data and keep derived values separate. | The app should organize trusted chart facts, not silently reinterpret or overwrite them. | Flattening rich source data into simplified report-only values or inventing defaults. | No |
| 2026-09-17 | Pause project work at the Cardiac modeling boundary while two newly available WGU classes take priority. | Preserve momentum without creating half-finished implementation work or losing the exact resume point. | Continuing project work in parallel and fragmenting focus. | Resume after current school push |

## Settled Field-Model Decisions So Far
- PMH, Diagnosis, and Allergies are discrete repeating lists.
- A/O stores the final level (`A/O x4`, etc.) plus specific orientation deficits when abnormal.
- Pupils preserve right/left size and reaction separately; equality is derived.
- GCS preserves Eye, Verbal, Motor, and total.
- NIHSS preserves full item-level detail plus total, with compact default display and expandable detail.
- Extremity strength preserves RUE/LUE/RLE/LLE grades separately.
- IV access, skin findings, and IV drips are repeating structures.
- `Misc` and `Treatment` are narrative/free-text areas.
- Named labs are structured result fields.
- Missing source data remain missing rather than being defaulted to normal.

## Open Decisions
- Cardiac: exact bilateral radial/pedal pulse representation and repeating edema representation.
- Exact structure for lung findings, abdomen, and urine.
- Which fields/sections are mandatory for every ICU report vs conditional/optional.
- Whether BGM should be stored as timestamped readings underneath the fixed display slots.
- Whether Pain is one current assessment or a repeating/time-based set.
- Which lab metadata to retain beyond value, units, timestamp, status, and flags available from source.
- What is the first interaction model: generated-only report, lightweight manual entry, or both?
- What output format best validates the workflow first: browser/local UI, printable page, or a combination?
- What authorized Epic/EHR data-access or export options would realistically exist in a later deployment environment?

## Assumptions
- The useful report layout differs by nursing unit.
- Much of the information nurses manually collect for report already exists somewhere in the EHR, although availability and access method must be verified field by field.
- The ICU prototype represents a meaningful real-world starting workflow rather than a purely cosmetic mockup.
- A normalized internal model can represent the first report independently of the eventual data source.
- A prototype using realistic mock data is sufficient to validate the core workflow.

## Known Tradeoffs
- Mock data proves workflow and software behavior but does not prove Epic integration feasibility.
- A first-unit ICU focus intentionally postpones broader template design.
- Using the existing paper/PDF layout as the design anchor may preserve some manual-workflow constraints initially; we can improve them after the first automated version is working.
- Delaying the tech-stack decision costs almost nothing now and reduces the chance of choosing tools that fight the actual interface requirements.

## Resume Pin
When work resumes, continue at **Cardiac**. Do not reopen the completed prototype inventory or Neuro modeling decisions unless new evidence requires it.