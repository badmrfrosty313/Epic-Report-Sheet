# ICU Report Sheet | Source-first nursing handoff prototype

**Status: v0.1 scope complete (September 2026).** This is a local, synthetic-data portfolio application, **not** a clinically deployed EHR product.

An independently developed React/TypeScript application that transforms source-shaped ICU patient data into a compact bedside handoff report. It keeps clinical source facts, derived values, missing data and report-only annotations separate so a nurse can inspect *where* a displayed value came from.

> **Independent project.** Not affiliated with, endorsed by, or integrated into Epic Systems. “Epic” and related marks belong to their respective owners. There is no live Epic connection, no real patient data, and no claim of certification or fitness for clinical use.

## What it demonstrates

- **Source-first data modeling:** a normalized ICU patient/encounter model with timestamps, provenance, status, and repeating clinical records.
- **Deterministic projection:** patient information, assessments, ventilation, infusions, LDAs, labs and radiology projected into a scan-friendly report.
- **Clinical data safeguards:** missing data stay missing; entered-in-error observations and reports are excluded; numeric lab trends use prior valid source readings rather than arbitrary values.
- **Multiple fixture conditions:** a standard fictional case, a dense stress case, and an independent synthetic ICU handoff acceptance scenario.
- **Readable presentation:** two-column interactive report, expandable source details, explicit report-only notes, and client-side **Save Portrait PDF** plus native print support.

**Technology:** TypeScript, React 18, Vite, Vitest, HTML/CSS, and browser PDF tooling. No backend, database, API credentials, or paid service is needed to run the included demo.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run test:run
npm run build
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`).

Use `?fixture=standard` for the normal fictional encounter and `?fixture=stress` for the high-density scenario, or switch fixtures in the UI. Use **Save Portrait PDF** for the browser-generated Letter portrait document; **Print** uses the browser and printer's settings.

## Architecture

```text
Fictional source-shaped clinical records
                 ↓
 Typed normalized model + provenance
                 ↓
 Deterministic selection / derivation
                 ↓
          Report state
           ↙       ↘
   React report    Browser PDF / Print
```

The proposed future EHR adapter is **not implemented**. In particular, no real hospital's Epic flowsheet identifiers, local observations, device codes, access scopes or organizational mappings have been validated.

## Tests and scope

`npm run test:run` runs **29 automated tests** including an 11-test independent synthetic ICU handoff acceptance case. The last checked `main` CI ran tests and the production build successfully on September 20, 2026 (UTC: September 21). See [the acceptance record](Support%20Sheets/21_ICU_ACCEPTANCE_TEST.md) for precise assertions and limitations.

The automated acceptance checks data selection and internal consistency on invented cases. They do **not** establish clinical safety, usability in a hospital, accessibility conformance, or successful print behavior across every browser and printer. The [human print and stress checklist](Support%20Sheets/19_UI_STRESS_AND_PRINT_CHECKLIST.md) remains available for anyone reproducing that separate review.

The v0.1 software work was accepted as complete within this limited mock-data scope. Real EHR deployment, organizational validation, user research and integration remain out of scope rather than unfinished requirements.

## Project documentation

- [Architecture and source-preservation decisions](Support%20Sheets/14_ICU_NORMALIZED_MODEL.md)
- [Selection policies](Support%20Sheets/16_ICU_SELECTION_POLICIES.md)
- [Independent ICU acceptance scenario](Support%20Sheets/21_ICU_ACCEPTANCE_TEST.md)
- [Human visual, stress and print checklist](Support%20Sheets/19_UI_STRESS_AND_PRINT_CHECKLIST.md)
- [v0.1 release notes](docs/RELEASE_NOTES.md)
- [Publication and disclosure checklist](docs/PUBLICATION_CHECKLIST.md)

The `Support Sheets/` directory also preserves historical planning notes and prototype decisions. Older unchecked tasks are retained as history, not a statement that the accepted v0.1 implementation lacks core functionality.

## Safety, privacy and reuse

All included JSON encounters and tests are intended to be fictional. Do not add protected health information, credentials, organization-specific clinical exports, or live patient records. No live Epic/FHIR connection is supplied. This prototype is not suitable for making treatment decisions.

The original source code, tests, and project-authored documentation are [MIT licensed](LICENSE), subject to the separate third-party dependencies' licenses. This repository is prepared for a portfolio release; confirm the remaining history and disclosure checks before enabling public visibility. See [publication checks](docs/PUBLICATION_CHECKLIST.md).
