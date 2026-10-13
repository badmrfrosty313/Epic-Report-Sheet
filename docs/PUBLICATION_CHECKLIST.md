# Public portfolio release checklist

This is a **publication gate**, not a new development roadmap. The user accepted the mock/source-shaped v0.1 app as complete. Live hospital access is not required and is not requested.

## Before changing repository visibility

- [x] **Repository-history disclosure audit:** [GitHub Actions history audit](https://github.com/badmrfrosty313/Epic-Report-Sheet/actions/runs/38449401721) scanned **203 reachable historical Git blobs across 54 historical paths** with no flagged email addresses, high-confidence secret patterns, or unexpected sensitive filenames. This is a heuristic screening test, **not** a categorical guarantee of zero PHI or confidential material. The attached prototype PDF and the three synthetic fixture files were also reviewed separately.
- [x] **PDF contents and metadata privacy check:** independently inspected the two-page `Support Sheets/Report Sheet V.2 ICU - Prototype.pdf` against the user-supplied original. No populated patient data, hospital identifiers, embedded images, file attachments, annotations, script actions, or hidden form fields were found. Document metadata contains title `Report Sheet V.2 ICU` and creator `Google Sheets`, with no author name. Its Git blob SHA-1 `17f011d1e3c38a4595de4fcdbaf08d16284e119e` exactly matches the repository's PDF blob, proving the inspected file is the same bytes as the tracked PDF.
- [x] **Original PDF ownership:** owner explicitly confirms the blank design is their own and does not include hospital-owned content. The separately completed PDF technical inspection found no patient or hospital identifiers.
- [x] **License:** MIT for project-authored code, documentation and original prototype design. Third-party libraries remain under their own licenses and are installed separately through npm.
- [x] Checked the three mock/stress/acceptance fixtures: IDs are `MOCK-*` and patient names are explicitly invented `Jordan Example`, `Morgan Stress Test`, and `Taylor Acceptance`; no email addresses, real facility names, or API tokens were detected. This is a structured-text review, not formal anonymization certification.
- [ ] Check that repository configuration and workflow permissions are appropriate before enabling public visibility.

## Engineering release checks

- [x] Automated acceptance: 29 tests passed and production build passed on original v0.1 `main` checkpoint (2026-09-20 UTC 2026-09-21).
- [x] User accepted v0.1 as complete for its mock-data prototype scope in September 2026.
- [x] Release-candidate CI: [GitHub Actions run 38449401771](https://github.com/badmrfrosty313/Epic-Report-Sheet/actions/runs/38449401771) at commit `1f6c5ad` passed `npm audit --audit-level=high` (**zero reported vulnerabilities**), **29 tests**, and the production build. Tooling is now Vite **6.4.4** + Vitest **4.1.11** + React Vite plugin **4.4.1**.
- [ ] Merge documentation PR only after review.
- [ ] Optionally tag and publish GitHub release `v0.1.0` after final checks and owner approval.
- [ ] Capture safe screenshots or a 45–90 second demo with fictional data only (recommended for portfolio use).
- [ ] Manually review the PDF and print layout on the final intended browser/printer; the historical checklist is intentionally not marked complete on the sole basis of CI.

## Claims to avoid

Do not claim the app connects to Epic, was authorized by a hospital, has been clinically validated, is production ready, or was tested with real patient records. The automated source-selection tests validate only fictional cases.
