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

## Fixture modes

The UI can switch between two deterministic fictional fixtures:

- `?fixture=standard` — normal development patient
- `?fixture=stress` — high-density ICU patient with many LDAs, eight active drips, expanded labs, extra imaging, and longer handoff text

The in-app fixture switcher changes between them.

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
- `Support Sheets/18_STRESS_ICU_FIXTURE.json`
- `Support Sheets/19_UI_STRESS_AND_PRINT_CHECKLIST.md`

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

## Current UI capabilities

- two-column nurse report layout
- source timestamps with pre-shift cues
- dynamic full-width lab panel
- numeric lab trends against the immediately prior valid result
- compact ICU drip cards with rate/access and source timing
- shift I/O snapshot from explicit intake/output observations
- prominent source-backed To Do area
- radiology source impressions
- standard/stress fixture switcher
- landscape print CSS

## Next milestone

Run the standard and stress fixtures locally as a nurse-workflow review, then manually inspect Print / Save PDF using the checklist in `19_UI_STRESS_AND_PRINT_CHECKLIST.md`. Do not add live EHR integration yet.
