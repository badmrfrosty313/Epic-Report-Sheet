# Epic Report Sheet - Support Sheets

This folder is the persistent project memory for Epic Report Sheet. It exists so architecture, scope, decisions, tasks, testing, and handoff context survive across work sessions instead of being reconstructed from chat history.

## Current Project Snapshot

Epic Report Sheet is in **Planning** as of **2026-09-17**. The v0.1 finish line is intentionally narrow:

> A realistic mock patient goes in and a useful, readable, printable first-unit nursing report sheet comes out.

Live Epic connectivity is **not** required for v0.1. Prototype development uses mock/de-identified data, and the architecture keeps future EHR ingestion separate from the normalized patient model and report presentation.

## File Guide

1. `00_PROJECT_CONTEXT.md` - purpose, scope, constraints, and definition of done.
2. `01_REQUIREMENTS.md` - functional/non-functional requirements and acceptance criteria.
3. `02_ARCHITECTURE.md` - system boundaries and data flow.
4. `03_DECISIONS.md` - settled decisions, assumptions, and open questions.
5. `04_TASKS.md` - active task board and v0.1 finish line.
6. `05_DEV_LOG.md` - chronological work-session record.
7. `06_TECH_STACK.md` - selected tools/versions; stack is currently intentionally TBD.
8. `07_TEST_PLAN.md` - automated and manual validation strategy.
9. `08_IDEAS_PARKING_LOT.md` - future ideas that should not derail v0.1.
10. `09_CHATGPT_HANDOFF.md` - compact context for resuming work in a new conversation.

## Working Rhythm

At the beginning of a session:
1. Read `09_CHATGPT_HANDOFF.md`.
2. Check `04_TASKS.md` for the current objective.
3. Pull the latest repository state.

During a session:
1. Keep the current objective narrow.
2. Record important architecture/scope decisions in `03_DECISIONS.md`.
3. Put tempting nonessential ideas in `08_IDEAS_PARKING_LOT.md` instead of expanding scope.
4. Preserve working states before large experiments.

At the end of a meaningful session:
1. Update `04_TASKS.md`.
2. Add an entry to `05_DEV_LOG.md`.
3. Refresh `09_CHATGPT_HANDOFF.md` if the project state materially changed.
4. Commit the finished state.

## Immediate Next Move
Define the first nursing report's purpose, target unit/workflow, and exact information requirements. The implementation stack comes after that decision, not before it.
