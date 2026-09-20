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
- The full visible-field inventory has been completed from the prototype.
- Field behavior/model classification is partially complete through the Header and Neuro sections.
- v0.1 is deliberately independent of live Epic access.
- Initial architecture remains: input adapter -> normalized patient/report model -> validation -> report engine/unit template -> screen + print/export.
- Prototype data must be mock or safely de-identified.
- Implementation stack remains TBD until the ICU field/workflow model is sufficiently defined.
- Project resumed on **2026-09-20** from the pinned Cardiac checkpoint.

## What We Just Finished
- Inspected the actual two-page ICU prototype rather than brainstorming a replacement.
- Created `10_ICU_FIELD_INVENTORY.md` with every visible field/section.
- Created `11_ICU_FIELD_CLASSIFICATION.md` for field behavior/cardinality.
- Created `12_ICU_MODEL_DECISIONS.md` for settled model choices.
- Locked PMH, Diagnosis, and Allergies as discrete repeating lists.
- Locked A/O as final orientation level plus specific deficits when abnormal.
- Locked bilateral pupil detail: right/left size and reaction; equality is derived.
- Locked GCS as Eye + Verbal + Motor + total.
- Locked NIHSS as full structured detail + total, compact by default and expandable in the digital UI.
- Locked RUE/LUE/RLE/LLE strength grades separately.
- Locked the project-wide source-preservation rule.

## Governing Source-Preservation Rule
If clinically relevant data can legitimately be pulled directly from an approved Epic/EHR source, preserve the original source facts and useful provenance when practical: values, codes, units, timestamps, statuses, labels, components, etc. Normalization may reorganize those facts but must not silently reinterpret them. Derived summaries, flags, calculations, comparisons, and display shorthand remain separate and never overwrite source data. Missing source data remain missing rather than becoming invented normal/default values.

## Epic-First Modeling Rule
From 2026-09-20 forward, **model the remaining system according to how Epic/EHR actually represents and exposes the data, even if that requires changing the old ICU report layout**. The PDF remains a workflow reference, not the schema authority. Research/verify the source representation first, preserve its semantics and cardinality, then design the normalized model and nurse-facing projection around it. Do not force Epic data into old paper boxes.

## EXACT RESUME POINT
Cardiac modeling is resolved for the current v0.1 pass:
- Rhythm remains source-preserved.
- Pulses are repeating site/laterality findings so bilateral radial/pedal detail and more specific source sites can be retained.
- Edema is a repeating structured finding with source-provided location/laterality/grade/type/detail.

Continue with **Respiratory** next:
- Confirm `Oxygen`, `LPM`, and `Percentage` semantics.
- Preserve respiratory device/settings source detail.
- Model lobe-specific lung findings without flattening richer source data.

Then continue GI, GU, IV access, Skin, IV drips, BGM, Pain, Treatment, and Labs.
## Important Decisions Already Made
- Workflow prototype first; live Epic integration later.
- Mock/de-identified data only during prototype development.
- Keep source ingestion separate from normalized patient data and report presentation.
- ICU is the first target unit.
- Use the existing ICU prototype as the workflow/display anchor, but allow its field layout to change when Epic's actual data organization requires it.
- Store rich source data underneath while rendering concise nurse-friendly output.
- Interactive UI may expose expandable detail where the paper sheet only has a compact summary.
- Do not choose technology merely to create motion; choose it after interface/workflow requirements are known.
- v0.1 success = realistic mock ICU patient in -> useful, readable, printable ICU report out.

## Current Problems / Bugs
- No application exists yet, so there are no implementation bugs.
- Field classification is unfinished from Cardiac onward.
- We have not yet completed the auto-populated vs nurse-entered/source-mapping pass.
- Future Epic/EHR access method is unknown, but this is not a blocker for v0.1.

## Files Most Relevant When Resuming
- `Support Sheets/Report Sheet V.2 ICU - Prototype.pdf`
- `Support Sheets/10_ICU_FIELD_INVENTORY.md`
- `Support Sheets/11_ICU_FIELD_CLASSIFICATION.md`
- `Support Sheets/12_ICU_MODEL_DECISIONS.md`
- `Support Sheets/04_TASKS.md`
- `Support Sheets/09_CHATGPT_HANDOFF.md`

## Do Not Undo
- Do not make live Epic access a prerequisite for building the prototype.
- Do not use real PHI to make prototype development easier.
- Do not couple report UI directly to source-specific/Epic field names.
- Do not redesign the existing ICU prototype before understanding why each section exists.
- Do not flatten detailed source data solely because the paper report displays a short summary.
- Do not convert missing source data into assumed normal findings.
- Do not reopen the completed Header/Neuro decisions unless new evidence requires it.
- Do not expand to every nursing unit before the ICU workflow works.
- Do not add infrastructure or abstractions without a demonstrated need.

## How I Want ChatGPT to Help
- Preserve prior architectural and field-model decisions unless there is a strong reason to change them.
- Explain important concepts and architecture.
- Help heavily with boilerplate, setup, syntax, debugging, and repetitive work.
- Keep Todoist and the support files synchronized as work is completed.
- When proposing a change, explain what file changes and why.
- Keep the project moving instead of repeatedly redesigning settled pieces.
- Optimize away pointless friction while preserving the work that actually teaches or validates something.
- Keep one concrete objective per work session when practical; finish and commit before wandering into unrelated improvements.

## Immediate Prompt When Returning
Continue Epic Report Sheet from the pinned checkpoint. Do not redo the prototype inventory or Neuro decisions. Resume with Cardiac field modeling: preserve rhythm as source data, then define bilateral radial/pedal pulse structure and repeating edema findings before moving to Respiratory.

## Local Sync Reminder
Remote support documentation was updated through GitHub during the checkpoint. Run:
```text
git pull
```
before continuing locally.