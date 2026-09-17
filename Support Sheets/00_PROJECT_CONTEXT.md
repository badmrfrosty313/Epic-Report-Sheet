# Project Context

## Project Name
Epic Report Sheet

## One-Sentence Description
Build a digital nursing report-sheet system that turns structured patient data into a useful shift-report view tailored to the needs of different hospital units.

## Why This Exists
Nurses spend time manually gathering and reorganizing information from the EHR into personal report sheets. The useful information and layout also differ by unit. This project explores a cleaner workflow where the report sheet is generated from structured data rather than rebuilt by hand every shift.

The idea comes from real hospital workflow experience with Epic, but this repository is an independent project and is not affiliated with Epic Systems.

## Primary Goal
Produce a working prototype that can accept safe/mock patient data and generate a practical nursing report sheet with a clear path toward later automation from permitted EHR data sources.

## Secondary Goals
- Support unit-specific report layouts, beginning with a clearly defined first unit/workflow.
- Make the report useful on screen and printable without duplicating data-entry work.
- Separate the patient-data model from the visual report layout so new unit templates can be added later.
- Document what Epic data would be needed and how each source field maps to the report.

## Non-Goals
- Do not access a live Epic environment, scrape Epic, bypass access controls, or depend on undocumented/private interfaces.
- Do not use real PHI during prototype development.
- Do not attempt to reproduce the entire EHR.
- Do not build every unit-specific report before the first workflow is validated.

## Intended Users
- Primary: bedside nurses receiving and giving shift report.
- Later: unit educators, charge nurses, or organizations that want standardized report-sheet templates.

## Current Status
- Stage: Planning
- Last updated: 2026-09-17
- Current focus: Define the first report's purpose, workflow, and required data before implementation.
- Repository: badmrfrosty313/Epic-Report-Sheet

## Constraints
- Budget: Prefer free/local development tools during prototype work.
- Time: Build the smallest useful vertical slice before expanding scope.
- Hardware: Must be practical to develop on the existing Windows laptop.
- Software/platform: Technology stack is intentionally not locked until the first workflow and interface requirements are defined.
- Legal/safety/privacy: Prototype with mock/de-identified data only. Any future clinical deployment would require organizational authorization, privacy/security review, and approved integration methods.
- Other: Epic access/export capabilities are currently unknown and must be investigated rather than assumed.

## Definition of Done
- [ ] First nursing workflow and report purpose are explicitly defined.
- [ ] Required report fields are documented and mapped to conceptual EHR/Epic source data.
- [ ] Prototype accepts mock patient data and produces the first usable report sheet.
- [ ] Report is validated against a realistic nursing handoff scenario.
- [ ] Print/export behavior is usable.
- [ ] Architecture leaves a clean boundary for future authorized data integration.
- [ ] Usage/setup documentation is sufficient to run the prototype again without reconstructing prior decisions.

## Important Context for ChatGPT
This is a workflow project first and an Epic integration project later. Preserve the separation between data ingestion, normalized patient data, and report presentation. Start with mock data and a real nursing use case. Avoid artificial complexity and do not let future interoperability work block the first usable prototype.
