# Development Log

Add a short entry at the end of each work session.

---

## 2026-09-17 - Project Kickoff

### What We Worked On
- Converted the generic bootstrap support sheets into project-specific documentation for Epic Report Sheet.
- Established the first-build strategy before writing application code.

### What Changed
- Defined the project as a nursing workflow/report-generation system rather than an Epic clone.
- Established a source adapter -> normalized patient model -> report engine/template -> screen/print architecture.
- Defined v0.1 around mock data and one first-unit workflow.
- Created the initial requirements, task board, test strategy, and decision log.

### What Works
- GitHub repository exists and is cloned to the local desktop.
- Project support/documentation system is in place.
- The prototype has a concrete finish line independent of live Epic access.

### What Is Broken / Uncertain
- No application code exists yet.
- First target unit/workflow has not yet been selected in this project kickoff.
- Exact first-report fields have not yet been defined.
- Future Epic/EHR access/export method is unknown and intentionally not blocking v0.1.

### Files Changed
- Support Sheets/00_PROJECT_CONTEXT.md
- Support Sheets/01_REQUIREMENTS.md
- Support Sheets/02_ARCHITECTURE.md
- Support Sheets/03_DECISIONS.md
- Support Sheets/04_TASKS.md
- Support Sheets/05_DEV_LOG.md
- Support Sheets/06_TECH_STACK.md
- Support Sheets/07_TEST_PLAN.md
- Support Sheets/08_IDEAS_PARKING_LOT.md
- Support Sheets/09_CHATGPT_HANDOFF.md
- Support Sheets/README.md

### Next Starting Point
- Define the first report's purpose and nursing workflow.
- Choose the first target unit/workflow.
- Enumerate the exact information that belongs on that report before selecting the implementation stack.

### Commands / Setup Worth Remembering
```text
# Local repo already cloned.
# Before beginning a new session after remote documentation changes:
git pull
```
