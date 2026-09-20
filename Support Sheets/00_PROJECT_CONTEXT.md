# Project Context

## Project Name
Epic Report Sheet

## One-Sentence Description
Build a digital nursing report-sheet system that turns structured patient data into a useful shift-report view tailored to the needs of different hospital units.

## Why This Exists
Nurses spend time manually gathering and reorganizing information from the EHR into personal report sheets. The useful information and layout also differ by unit. This project explores a cleaner workflow where the report sheet is generated from structured data rather than rebuilt by hand every shift.

The idea comes from real hospital workflow experience with Epic, but this repository is an independent project and is not affiliated with Epic Systems.

## Primary Goal
Produce a working prototype that can accept safe/mock patient data and generate a practical ICU nursing report sheet with a clear path toward later automation from permitted EHR data sources.

## Secondary Goals
- Use the existing ICU report-sheet prototype as the first concrete product specification.
- Make the report useful on screen and printable without duplicating data-entry work.
- Separate the patient-data model from the visual report layout so new unit templates can be added later.
- Document what Epic data would be needed and how each source field maps to the report.

## Non-Goals
- Do not access a live Epic environment, scrape Epic, bypass access controls, or depend on undocumented/private interfaces.
- Do not use real PHI during prototype development.
- Do not attempt to reproduce the entire EHR.
- Do not build every unit-specific report before the ICU workflow is validated.

## Intended Users
- Primary: ICU bedside nurses receiving and giving shift report.
- Later: nurses on additional units, unit educators, charge nurses, or organizations that want standardized report-sheet templates.

## Current Status
- Stage: **Epic-first source mapping complete / normalized model definition next**
- Last updated: 2026-09-20
- ICU remains the first target workflow.
- Full visible-field inventory is complete.
- Field behavior/source-family classification is complete at the public Epic/FHIR conceptual level.
- Every prototype field is mapped in `13_EPIC_SOURCE_MAP.md` to a source domain, a presentation derivation, or an explicit manual report annotation.
- Header, Neuro, Cardiac, and Respiratory field-level decisions already made remain preserved unless customer-specific Epic evidence requires a change.
- Exact customer-specific FLO IDs, LDA codes, local value lists, security/scopes, and organization configuration remain a later deployment-adapter task.
- Current focus: define the canonical normalized ICU model and vertical-slice rules from the completed source map.
- Repository: badmrfrosty313/Epic-Report-Sheet

## Constraints
- Budget: Prefer free/local development tools during prototype work.
- Time: Build the smallest useful vertical slice before expanding scope.
- Hardware: Must be practical to develop on the existing Windows laptop.
- Software/platform: Technology stack is intentionally not locked until the ICU workflow and interface requirements are defined.
- Legal/safety/privacy: Prototype with mock/de-identified data only. Any future clinical deployment would require organizational authorization, privacy/security review, and approved integration methods.
- Other: Epic access/export capabilities are currently unknown and must be investigated rather than assumed.

## Definition of Done
- [x] First target unit selected: ICU.
- [x] Existing ICU report-sheet prototype added to the repository.
- [ ] ICU report purpose/workflow is explicitly defined.
- [x] Prototype fields are inventoried and documented.
- [x] Field behavior/source-family classification is completed for every section.
- [x] Required report fields are mapped to conceptual EHR/Epic source data.
- [ ] Application accepts mock patient data and produces the first usable ICU report sheet.
- [ ] Report is validated against a realistic ICU nursing handoff scenario.
- [ ] Print/export behavior is usable.
- [ ] Architecture leaves a clean boundary for future authorized data integration.
- [ ] Usage/setup documentation is sufficient to run the prototype again without reconstructing prior decisions.

## Important Context for ChatGPT
This remains a workflow project first and an Epic integration project later, but **Epic's real source structure now outranks the old paper/PDF layout as the data-model authority**. The ICU PDF remains a workflow and presentation reference, not a schema contract. For each remaining section, first determine how the approved Epic/EHR source actually represents the data, preserve that source structure and semantics, then adapt the normalized model and report layout around it. If this requires changing, regrouping, adding, or removing old paper fields, do so. Preserve separation between ingestion, normalized patient data, and report presentation.

### Source-Preservation Rule
Preserve clinically relevant values, codes, units, timestamps, statuses, labels, components, and other useful attributes that can legitimately be pulled from an approved Epic/EHR source. Derived summaries, flags, calculations, and display shorthand remain separate and must never overwrite source facts. Missing source data stay missing rather than defaulting to normal.

### Resume Rule
When this project resumes, do **not** restart discovery, re-inventory the PDF, or reopen settled Neuro decisions. Continue from the Cardiac section using `11_ICU_FIELD_CLASSIFICATION.md`, `12_ICU_MODEL_DECISIONS.md`, and `09_CHATGPT_HANDOFF.md`.

### Epic-First Modeling Rule
- Build the source adapter and normalized model from how Epic/EHR actually represents the data, not from handwritten paper conventions.
- The existing ICU PDF is still valuable for workflow priorities and scanability, but it may be changed when Epic's actual data shape differs.
- Do not contort Epic data to fit legacy report boxes.
- Preserve source structure, terminology, coding, cardinality, and provenance where practical, then design the nurse-facing report as a projection of that model.
- Ask for clinical/workflow judgment only where Epic/source documentation is ambiguous, customer-specific, or where presentation choices remain open.
