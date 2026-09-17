# ChatGPT Handoff

Use this file when starting a new ChatGPT conversation or returning after a long break.

## Project
Epic Report Sheet

## Objective
Build a digital nursing report-sheet system that takes structured patient data and produces a useful, unit-specific shift-report view, with a future path to authorized Epic/EHR data ingestion.

## Current State
- Repository exists at `badmrfrosty313/Epic-Report-Sheet` and has been cloned locally.
- Application implementation has not started.
- ICU is the first target unit/workflow.
- `Support Sheets/Report Sheet V.2 ICU - Prototype.pdf` is the concrete v0.1 design anchor.
- v0.1 is deliberately independent of live Epic access.
- Initial architecture: input adapter -> normalized patient/report model -> validation -> report engine/unit template -> screen + print/export.
- Prototype data must be mock or safely de-identified.
- Implementation stack remains TBD until the ICU prototype has been converted into explicit field/workflow requirements.

## What We Just Finished
- Converted the generic support sheets into project-specific documentation on 2026-09-17.
- Selected ICU as the first unit/workflow.
- Added `Report Sheet V.2 ICU - Prototype.pdf` to the support folder.
- Promoted that PDF from "reference" to the actual v0.1 design anchor.
- Updated the task board so the next work is prototype decomposition rather than fresh UI brainstorming.

## What We Are Doing Next
- Inspect the ICU prototype section by section.
- Inventory every visible field/section.
- Classify fields as required, optional, repeating, calculated, or free-text.
- Record why each field matters to the ICU nursing handoff/workflow.
- Then identify what can be auto-populated and map fields to conceptual Epic/EHR sources.
- Only after that select the implementation stack.

## Important Decisions Already Made
- Workflow prototype first; live Epic integration later.
- Mock/de-identified data only during prototype development.
- Keep source ingestion separate from the normalized patient model and report presentation.
- ICU is the first target unit.
- Use the existing ICU prototype as the v0.1 design anchor rather than inventing a new report from scratch.
- Do not choose technology merely to create motion; choose it after interface/workflow requirements are known.
- v0.1 success = realistic mock ICU patient in -> useful, readable, printable ICU report out.

## Current Problems / Bugs
- No application exists yet, so there are no implementation bugs.
- The ICU prototype still needs field-level decomposition.
- We have not yet decided which fields are automatically populated vs nurse-entered.
- Future Epic/EHR access method is unknown, but this is not a blocker for v0.1.

## Files Most Relevant Right Now
- `Support Sheets/Report Sheet V.2 ICU - Prototype.pdf`
- `Support Sheets/00_PROJECT_CONTEXT.md`
- `Support Sheets/01_REQUIREMENTS.md`
- `Support Sheets/03_DECISIONS.md`
- `Support Sheets/04_TASKS.md`
- `Support Sheets/09_CHATGPT_HANDOFF.md`

## Do Not Undo
- Do not make live Epic access a prerequisite for building the prototype.
- Do not use real PHI to make prototype development easier.
- Do not couple report UI directly to source-specific/Epic field names.
- Do not redesign the existing ICU prototype before understanding why each section exists.
- Do not expand to every nursing unit before the ICU workflow works.
- Do not add infrastructure or abstractions without a demonstrated need.

## How I Want ChatGPT to Help
- Preserve prior architectural decisions unless there is a strong reason to change them.
- Explain important concepts and architecture.
- Help heavily with boilerplate, setup, syntax, debugging, and repetitive work.
- When proposing a change, explain what file changes and why.
- Keep the project moving instead of repeatedly redesigning settled pieces.
- Optimize away pointless friction while preserving the work that actually teaches or validates something.
- Keep one concrete objective per work session when practical; finish and commit before wandering into unrelated improvements.

## Immediate Prompt
Continue Epic Report Sheet from this state. Start with `Report Sheet V.2 ICU - Prototype.pdf`. Convert that artifact into a structured field/workflow specification before selecting a framework or beginning Epic integration.
