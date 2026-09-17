# Technical Stack

The implementation stack is intentionally not locked yet. We will choose it after the first nursing workflow and report interface are defined.

## Languages
- Application language: TBD.

## Frameworks / Libraries
- UI framework: TBD.
- Report/print tooling: TBD.
- Validation/model library: TBD if needed.

## Database
- None required for the first vertical slice unless persistence becomes part of the validated workflow.

## APIs / Services
- v0.1: None required.
- Future Epic/EHR integration: TBD after authorized access/export feasibility is researched.

## Development Tools
- IDE: VS Code available locally.
- Version control: Git + GitHub.
- Repository: badmrfrosty313/Epic-Report-Sheet
- Package manager: TBD based on selected language/framework.
- Build system: TBD.
- Testing: TBD with the implementation stack; automated tests are required for data normalization/validation logic.
- Containers: Not required for v0.1.
- CI/CD: Not required for the first local prototype; revisit when useful.

## Hardware
- Existing Windows development laptop.
- Printer or PDF print target for report-layout validation.

## Versions
| Tool | Version | Why It Matters |
|---|---|---|
| Git | Local version TBD | Source control |
| VS Code | Local version TBD | Development environment |
| Runtime | TBD | Record after stack selection |

## Environment Variables
> Never put real passwords, API keys, secrets, PHI, or production credentials in this file or repository.

| Variable | Purpose |
|---|---|
| None currently | v0.1 requires no external service credentials |

## Setup Procedure
1. Clone the repository.
2. Pull the latest `main` branch.
3. Read `Support Sheets/09_CHATGPT_HANDOFF.md` and `Support Sheets/04_TASKS.md` before resuming work.
4. After the first workflow is defined, select the smallest stack that supports the required UI and print/export behavior.
5. Record exact runtime/tool versions here when implementation begins.

## Stack Selection Criteria
Prefer the simplest stack that can:
- Represent and validate structured patient data cleanly.
- Render a responsive, highly scannable report layout.
- Produce reliable print/PDF output.
- Run locally without unnecessary infrastructure.
- Keep future EHR ingestion behind a separate adapter boundary.
- Be maintainable without adding complexity merely because a more elaborate architecture exists.
