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
- Stage: **Paused checkpoint / ICU model definition in progress**
- Last updated: 2026-09-17
- Pause reason: Two additional WGU classes became available, so school work temporarily takes priority.
- Completed before pause: ICU selected, prototype captured, full visible-field inventory created, and several field-behavior/model decisions locked.
- Exact resume point: **Cardiac section**, beginning with source-preserving rhythm/pulse/edema modeling. The next unresolved decision is bilateral radial/pedal pulse structure and repeating edema findings.
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
- [ ] Field behavior/classification is completed for every section.
- [ ] Required report fields are mapped to conceptual EHR/Epic source data.
- [ ] Application accepts mock patient data and produces the first usable ICU report sheet.
- [ ] Report is validated against a realistic ICU nursing handoff scenario.
- [ ] Print/export behavior is usable.
- [ ] Architecture leaves a clean boundary for future authorized data integration.
- [ ] Usage/setup documentation is sufficient to run the prototype again without reconstructing prior decisions.

## Important Context for ChatGPT
This is a workflow project first and an Epic integration project later. The existing ICU PDF prototype is the design anchor for v0.1; do not casually redesign it before understanding why its sections exist. Preserve the separation between data ingestion, normalized patient data, and report presentation. Start with mock data and the real ICU use case. Avoid artificial complexity and do not let future interoperability work block the first usable prototype.

### Source-Preservation Rule
Preserve clinically relevant values, codes, units, timestamps, statuses, labels, components, and other useful attributes that can legitimately be pulled from an approved Epic/EHR source. Derived summaries, flags, calculations, and display shorthand remain separate and must never overwrite source facts. Missing source data stay missing rather than defaulting to normal.

### Resume Rule
When this project resumes, do **not** restart discovery, re-inventory the PDF, or reopen settled Neuro decisions. Continue from the Cardiac section using `11_ICU_FIELD_CLASSIFICATION.md`, `12_ICU_MODEL_DECISIONS.md`, and `09_CHATGPT_HANDOFF.md`.