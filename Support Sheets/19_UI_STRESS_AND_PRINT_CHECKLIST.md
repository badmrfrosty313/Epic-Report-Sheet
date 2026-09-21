# UI Stress + Print Validation Checklist

Last updated: 2026-09-20

## Purpose

This is the human nurse-workflow pass after the automated model/selection tests are green.

CI validates deterministic behavior and production build integrity. It does **not** prove that the report is pleasant to scan or prints well.

## Start

```text
git pull
npm install
npm run test:run
npm run dev
```

Open both modes:

- Standard: `http://localhost:5173/?fixture=standard`
- Stress: `http://localhost:5173/?fixture=stress`

The exact Vite port may differ.

---

## Standard Fixture Review

- [ ] Header can be understood in one glance.
- [ ] Two-column flow feels intentional rather than card soup.
- [ ] A/O, pupils, GCS, NIHSS, strength scan quickly.
- [ ] Rhythm/pulses/edema are separated cleanly.
- [ ] Lung layout stays readable without provenance clutter.
- [ ] Vent settings remain compact.
- [ ] Source clock times are visible but quiet.
- [ ] Pre-shift cue is noticeable without looking like an alarm.
- [ ] Nutrition lines do not run together.
- [ ] I/O snapshot clearly distinguishes Intake, Output, Net.
- [ ] UOP remains visibly separate from total Output.
- [ ] LDA names remain readable and consistently capitalized.
- [ ] Drip cards make medication + rate + access obvious.
- [ ] To Do dominates Treatment / To Do appropriately.
- [ ] Report-only notes remain visually distinct.
- [ ] Radiology impression is readable without swallowing the page.
- [ ] Lab grid remains dense but decipherable.
- [ ] Lab trend direction and prior value are understandable.
- [ ] HIGH/LOW source flags are not confused with ↑/↓ numeric direction.

## Stress Fixture Review

The stress fixture intentionally contains approximately:
- 12 LDA records
- 8 active drips
- 36 lab records
- 5 radiology reports
- 6 encounter diagnoses
- 6 PMH entries
- long To Do / report-note content

Review:

- [ ] No LDA disappears because of a row cap.
- [ ] Eight drips remain individually scannable.
- [ ] Long medication/access names wrap intentionally.
- [ ] Long To Do text stays prominent without crushing other sections.
- [ ] Expanded diagnoses and PMH remain usable.
- [ ] Additional labs flow naturally into the full-width grid.
- [ ] Unknown/additional lab codes do not disappear.
- [ ] Multiple radiology reports remain distinguishable.
- [ ] Neither column creates unusable horizontal overflow.
- [ ] Mobile collapse is acceptable enough for prototype purposes.

---

## Print / Save PDF

Use the browser's **Print / Save PDF** button.

Current CSS requests landscape printing.

- [ ] Report stays two-column where expected.
- [ ] Patient banner prints without clipping.
- [ ] Clinical sections do not split awkwardly across pages when avoidable.
- [ ] Lab tiles do not split internally.
- [ ] Drip cards do not split internally.
- [ ] To Do cards do not split internally.
- [ ] Debug/provenance controls are absent from print.
- [ ] Fixture switcher is absent from print.
- [ ] Lung-source detail is absent from print.
- [ ] Lab source details are absent from print.
- [ ] Font size remains readable on paper/PDF.
- [ ] Stress fixture page count is acceptable for the intended use.
- [ ] No content is clipped at the right or bottom page boundary.

## Decision Rule

Do not add more clinical domains until the standard fixture feels fast and the stress fixture remains usable.

If print is ugly but screen is good, fix the print stylesheet separately instead of compromising the interactive report.
