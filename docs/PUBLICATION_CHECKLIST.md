# Public portfolio release checklist

This is a **publication gate**, not a new development roadmap. The user accepted the mock/source-shaped v0.1 app as complete. Live hospital access is not required and is not requested.

## Before changing repository visibility

- [ ] **Audit the entire Git history** for real patient information (PHI), employer-specific internal documents, tokens, logs, screenshots and any file removed from the current checkout. Publicizing the repo exposes history, not just its latest files.
- [x] **PDF contents and metadata privacy check:** independently inspected the two-page `Support Sheets/Report Sheet V.2 ICU - Prototype.pdf` against the user-supplied original. No populated patient data, hospital identifiers, embedded images, file attachments, annotations, script actions, or hidden form fields were found. Document metadata contains title `Report Sheet V.2 ICU` and creator `Google Sheets`, with no author name. Its Git blob SHA-1 `17f011d1e3c38a4595de4fcdbaf08d16284e119e` exactly matches the repository's PDF blob, proving the inspected file is the same bytes as the tracked PDF.
- [ ] **Confirm rights to redistribute the PDF:** the owner reports creating the blank design without patient data, but should confirm it is their original work and contains no hospital-owned confidential or restricted template content. This rights confirmation is separate from the completed technical privacy inspection.
- [ ] **Choose a license** for original code and documentation. A public repository without a license generally does not grant others permission to copy/modify/redistribute it. Separately identify any third-party assets or prototypes that the chosen license cannot cover.
- [ ] Confirm all JSON mock/stress/acceptance fixtures and clinical examples are fully fictional, with no identifying data derived from real encounters.
- [ ] Check that repository configuration and workflow permissions are appropriate before enabling public visibility.

## Engineering release checks

- [x] Automated acceptance: 29 tests passed and production build passed on original v0.1 `main` checkpoint (2026-09-20 UTC 2026-09-21).
- [x] User accepted v0.1 as complete for its mock-data prototype scope in September 2026.
- [ ] Final documentation-polish PR CI passes.
- [ ] Merge documentation PR only after review.
- [ ] Optionally tag and publish GitHub release `v0.1.0` after final checks and owner approval.
- [ ] Capture safe screenshots or a 45–90 second demo with fictional data only (recommended for portfolio use).
- [ ] Manually review the PDF and print layout on the final intended browser/printer; the historical checklist is intentionally not marked complete on the sole basis of CI.

## Claims to avoid

Do not claim the app connects to Epic, was authorized by a hospital, has been clinically validated, is production ready, or was tested with real patient records. The automated source-selection tests validate only fictional cases.
