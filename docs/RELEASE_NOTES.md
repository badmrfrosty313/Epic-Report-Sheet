# ICU Report Sheet v0.1.0

**Portfolio milestone completed:** September 20, 2026.  
**Publication status:** release preparation, not yet a tagged GitHub release.

This standalone frontend demonstrates a source-first ICU nursing report workflow using invented patient data. The project is independent of Epic Systems; it has no live EHR connection and is not validated for clinical care.

## Implemented

- TypeScript + React interface with a compact, scan-friendly two-column bedside report.
- Typed synthetic patient/encounter records and deterministic field selection preserving source status, timestamps and provenance.
- Current/historical assessment, ventilation, active drip/device, nutrition, intake/output, radiology and laboratory reporting.
- Deliberately invalid/entered-in-error data excluded from the displayed clinical state.
- Missing data clearly distinguished from normal observations; lab trends calculated from the prior valid reading.
- Standard and high-density stress fixtures, plus a separate coherent synthetic ICU handoff scenario.
- Explicit browser-generated portrait PDF and native print paths.

## Verification

- 29 automated Vitest tests, including 11 scenario-level ICU acceptance tests.
- `npm run build` passed, together with automated tests, on `main` CI at commit `9617d900454cc10cb12ecc4c8f6fc2500f189a7f`.
- The synthetic acceptance scenario verifies active infusions and devices, error exclusions, intake/output calculations, lab trends and clinically relevant source-backed handoff tasks.

**These are engineering checks, not clinical validation.** Real-world nurse usability, browser/printer rendering, organization-specific Epic mappings, privacy/security certification, and clinical use would require separate approvals and testing.

## Limits

- No backend, database, authentication or live interoperability.
- No real patient information or organization-linked data should be used.
- No operational clinical workflow is supported or implied.
- The source-history privacy review, prototype PDF provenance and reuse license must be settled separately before making the private repository public.

See [README](../README.md), [synthetic acceptance test](../Support%20Sheets/21_ICU_ACCEPTANCE_TEST.md), and [publication checklist](PUBLICATION_CHECKLIST.md).
