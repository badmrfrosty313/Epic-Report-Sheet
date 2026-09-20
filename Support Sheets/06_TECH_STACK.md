# Technical Stack

Stack locked for v0.1 on 2026-09-20.

## Languages
- Application language: **TypeScript**.
- Styling: plain CSS.

## Frameworks / Libraries
- UI framework: **React 18.3.1**.
- Local build/dev server: **Vite 5.4.10**.
- Testing: **Vitest 2.1.4**.
- Type checking: **TypeScript 5.6.3**.
- Report/print tooling: browser-native print CSS for v0.1.
- Validation/model library: none yet. Add one only if runtime fixture/input validation becomes complex enough to justify it.

## Why This Stack
- The product is primarily an interactive local report UI with expandable source detail and print output.
- React gives us a clean boundary between report-state data and unit-specific presentation without requiring a server framework.
- Vite is lightweight and fast on the development laptop.
- TypeScript makes the normalized model and selector contracts explicit.
- Vitest lets the selection engine prove that stale, missing, conflicting, and entered-in-error source values are handled deterministically.
- Plain CSS avoids a UI-framework dependency before the ICU layout is validated.
- No backend or database is necessary for the first vertical slice.

## Database
- None for v0.1.
- Mock fixture data are loaded from repository JSON.
- Persistence should be added only after the workflow demonstrates a real need.

## APIs / Services
- v0.1: none.
- Future Epic/EHR integration remains behind the adapter boundary and must use an authorized method.
- The UI and selection engine do not depend on live Epic connectivity.

## Development Tools
- IDE: VS Code.
- Version control: Git + GitHub.
- Repository: badmrfrosty313/Epic-Report-Sheet
- Package manager: npm.
- Build system: Vite.
- Automated testing: Vitest.
- CI: GitHub Actions runs install, test, and build.
- Containers: not required for v0.1.

## Runtime
- Node.js **20 or newer**.
- Browser: current Chromium/Chrome-class browser for local development.
- Printer/PDF: browser Print / Save PDF path for v0.1 validation.

## Exact Package Versions
| Package | Version | Purpose |
|---|---:|---|
| react | 18.3.1 | UI |
| react-dom | 18.3.1 | Browser rendering |
| vite | 5.4.10 | Local dev/build |
| @vitejs/plugin-react | 4.3.3 | React/Vite integration |
| typescript | 5.6.3 | Static typing |
| vitest | 2.1.4 | Selection-engine tests |
| @types/react | 18.3.12 | React types |
| @types/react-dom | 18.3.1 | React DOM types |

## Environment Variables
> Never put real passwords, API keys, secrets, PHI, or production credentials in this file or repository.

None are required for v0.1.

## Local Setup

```bash
git pull
npm install
npm run test:run
npm run dev
```

Production build check:

```bash
npm run build
```

## Current App Structure

```text
Support Sheets/
  15_MOCK_ICU_FIXTURE.json
  16_ICU_SELECTION_POLICIES.md
  17_FIRST_REPORT_PROJECTION.md

src/
  types.ts
  selectionUtils.ts
  assessmentSelectors.ts
  supportSelectors.ts
  selection.ts
  App.tsx
  main.tsx
  styles.css

tests/
  selection.test.ts
```

## Architectural Rule
The browser UI consumes **ReportState**, not raw Epic payloads. Future source adapters emit the normalized model; selector modules determine current/relevant values; React renders the report state.

Do not add a server, database, state-management library, CSS framework, or component library merely because one exists. Add infrastructure only when the workflow demonstrates a need.
