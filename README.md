# Epic Report Sheet

A source-first ICU nursing report prototype that preserves structured EHR-style history and projects it into a fast nurse-facing report.

This repository is an independent software project and is not affiliated with Epic Systems.

## Current milestone

The specification phase is complete enough to execute the first vertical slice:

```text
source-shaped mock history
        ↓
deterministic selection policies
        ↓
derived report values
        ↓
interactive ICU report
```

The app currently uses fictional mock data only.

## Stack

- TypeScript
- React
- Vite
- Vitest
- Plain CSS with print styles
- No database
- No live Epic connection

## Run locally

Prerequisite: Node.js 20 or newer.

```bash
npm install
npm run test:run
npm run dev
```

Vite will print the local browser URL.

## Build

```bash
npm run build
```

## Important source artifacts

- `Support Sheets/13_EPIC_SOURCE_MAP.md`
- `Support Sheets/14_ICU_NORMALIZED_MODEL.md`
- `Support Sheets/15_MOCK_ICU_FIXTURE.json`
- `Support Sheets/16_ICU_SELECTION_POLICIES.md`
- `Support Sheets/17_FIRST_REPORT_PROJECTION.md`

The executable selection engine in `src/selection.ts` is expected to reproduce the deterministic behavior documented in those artifacts.

## Architecture

```text
Future authorized Epic/EHR adapter
              ↓
      normalized ICU model
              ↓
     selection / derivation
              ↓
        report state
         ↙        ↘
 interactive UI   print/PDF
```

The UI never reads raw Epic payloads directly.

## Safety / privacy

- Mock or safely de-identified data only during prototype development.
- Never commit credentials, live Epic configuration, PHI, or real patient exports.
- Missing source data must remain missing rather than being converted to normal/default values.
- Report-only annotations must stay distinguishable from chart-sourced facts.

## Next milestone

Make the executable selection engine pass the deterministic test suite, then refine the first ICU layout and print behavior before adding any live EHR integration.
