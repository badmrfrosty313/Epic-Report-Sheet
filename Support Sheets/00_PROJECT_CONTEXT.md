# Project Context

> **Portfolio status (October 2026):** the user accepted the v0.1 synthetic-data implementation as complete in September 2026. The original milestone notes below are historical. They do not imply actual Epic connectivity, real-world clinical validation, or completion of every manual print check. See the root README and publication checklist for current release status.


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
- Stage: **Executable v0.1 feature-complete for current pass / stress + print nurse validation next**
- Last updated: 2026-09-20
- ICU remains the first target workflow.
- Full visible-field inventory is complete.
- Field behavior/source-family classification is complete at the public Epic/FHIR conceptual level.
- Every prototype field is mapped in `13_EPIC_SOURCE_MAP.md` to a source domain, a presentation derivation, or an explicit manual report annotation.
- Header, Neuro, Cardiac, and Respiratory field-level decisions already made remain preserved unless customer-specific Epic evidence requires a change.
- Exact customer-specific FLO IDs, LDA codes, local value lists, security/scopes, and organization configuration remain a later deployment-adapter task.
- `14_ICU_NORMALIZED_MODEL.md` now defines the canonical source-shaped ICU model, derived-value/provenance rules, adapter boundary, selection framework, and v0.1 model contract.
- `15_MOCK_ICU_FIXTURE.json` provides a deterministic fake ICU encounter with stale, conflicting, missing, repeating, and source-vs-derived cases.
- `16_ICU_SELECTION_POLICIES.md` defines deterministic current/relevant-value rules.
- `17_FIRST_REPORT_PROJECTION.md` proves those rules produce the expected compact nurse report while preserving source history.
- Fixture integrity validation passed: JSON parses, all 93 source references resolve to source records, entered-in-error values are excluded, shift UOP = 365 mL, BGM slots select the intended readings, and current LDA/drip/nutrition selections are deterministic.
- Stack is locked to TypeScript + React + Vite + Vitest with plain CSS and browser-native print CSS.
- Executable selector modules now load the deterministic mock fixture and produce a typed `ReportState`; the React UI renders the first interactive ICU report with expandable provenance and missing/source/derived/report-only distinctions.
- Automated tests cover the core deterministic selection cases, and GitHub Actions CI run #2 completed successfully with tests + production build.
- Radiology is now a first-class source domain using Epic/FHIR DiagnosticReport Results; the compact report shows study/time/status/source impression while preserving full source findings underneath.
- High-density stress mode is available through `?fixture=stress`.
- Source-time/pre-shift cues, lab numeric trends, shift I/O, compact drip cards, and To Do prominence are implemented.
- Landscape print CSS has been hardened; human Print / Save PDF inspection remains.
- Expanded regression passed in GitHub Actions CI run #55.
- Current focus: human nurse-workflow review of both Standard and Stress fixtures plus the print checklist.
- Repository: badmrfrosty313/Epic-Report-Sheet

## Constraints
- Budget: Prefer free/local development tools during prototype work.
- Time: Build the smallest useful vertical slice before expanding scope.
- Hardware: Must be practical to develop on the existing Windows laptop.
- Software/platform: v0.1 stack is TypeScript + React + Vite + Vitest with plain CSS; no backend or database yet.
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
- [x] Architecture leaves a clean boundary for future authorized data integration.
- [x] Usage/setup documentation is sufficient to run the prototype again without reconstructing prior decisions.

## Important Context for ChatGPT
This remains a workflow project first and an Epic integration project later, but **Epic's real source structure now outranks the old paper/PDF layout as the data-model authority**. The ICU PDF remains a workflow and presentation reference, not a schema contract. For each remaining section, first determine how the approved Epic/EHR source actually represents the data, preserve that source structure and semantics, then adapt the normalized model and report layout around it. If this requires changing, regrouping, adding, or removing old paper fields, do so. Preserve separation between ingestion, normalized patient data, and report presentation.

### Source-Preservation Rule
Preserve clinically relevant values, codes, units, timestamps, statuses, labels, components, and other useful attributes that can legitimately be pulled from an approved Epic/EHR source. Derived summaries, flags, calculations, and display shorthand remain separate and must never overwrite source facts. Missing source data stay missing rather than defaulting to normal.

### Resume Rule
Do **not** restart field discovery, mock design, or stack selection. The executable v0.1 scaffold and selection engine are now implemented and passing CI. Resume with local browser validation: `git pull`, `npm install`, `npm run test:run`, `npm run dev`, then review nurse scanability and Print / Save PDF.

### Epic-First Modeling Rule
- Build the source adapter and normalized model from how Epic/EHR actually represents the data, not from handwritten paper conventions.
- The existing ICU PDF is still valuable for workflow priorities and scanability, but it may be changed when Epic's actual data shape differs.
- Do not contort Epic data to fit legacy report boxes.
- Preserve source structure, terminology, coding, cardinality, and provenance where practical, then design the nurse-facing report as a projection of that model.
- Ask for clinical/workflow judgment only where Epic/source documentation is ambiguous, customer-specific, or where presentation choices remain open.
