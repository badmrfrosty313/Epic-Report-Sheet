# ChatGPT Handoff

Use this file when starting a new ChatGPT conversation or returning after a long break.

## Project
Epic Report Sheet

## Objective
Build a digital nursing report-sheet system that takes structured patient data and produces a useful, unit-specific shift-report view, with a future path to authorized Epic/EHR data ingestion.

## Current State
- Repository exists at `badmrfrosty313/Epic-Report-Sheet` and has been cloned locally.
- The repository currently contains the project support/documentation pack; application implementation has not started.
- v0.1 is deliberately independent of live Epic access.
- Initial architecture: input adapter -> normalized patient/report model -> validation -> report engine/unit template -> screen + print/export.
- Prototype data must be mock or safely de-identified.
- Implementation stack remains TBD until the first workflow/report requirements are defined.

## What We Just Finished
- Converted the generic support sheets into project-specific documentation on 2026-09-17.
- Defined the v0.1 finish line.
- Established privacy, architecture, and scope decisions.
- Created the initial task board and test plan.

## What We Are Doing Next
- Define the first report's purpose and exact nursing workflow.
- Select the first target unit/workflow.
- List the exact data elements needed for that report and why they matter.
- Only then map those fields to conceptual Epic/EHR sources and select the implementation stack.

## Important Decisions Already Made
- Workflow prototype first; live Epic integration later.
- Mock/de-identified data only during prototype development.
- Keep source ingestion separate from the normalized patient model and report presentation.
- Build one real unit/workflow first rather than designing every specialty.
- Do not choose technology merely to create motion; choose it after interface/workflow requirements are known.
- v0.1 success = realistic mock patient in -> useful, readable, printable first-unit nursing report out.

## Current Problems / Bugs
- No application exists yet, so there are no implementation bugs.
- First target workflow and exact report fields remain undefined.
- Future Epic/EHR access method is unknown, but this is not a blocker for v0.1.

## Files Most Relevant Right Now
- `Support Sheets/00_PROJECT_CONTEXT.md`
- `Support Sheets/01_REQUIREMENTS.md`
- `Support Sheets/03_DECISIONS.md`
- `Support Sheets/04_TASKS.md`
- `Support Sheets/09_CHATGPT_HANDOFF.md`

## Do Not Undo
- Do not make live Epic access a prerequisite for building the prototype.
- Do not use real PHI to make prototype development easier.
- Do not couple report UI directly to source-specific/Epic field names.
- Do not expand to every nursing unit before the first workflow works.
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
Continue Epic Report Sheet from this state. Start by defining the first nursing report workflow and the information it must contain. Do not choose a framework or begin Epic integration until that workflow is concrete.
