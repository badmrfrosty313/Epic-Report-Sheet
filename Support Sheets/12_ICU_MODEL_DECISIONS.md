# ICU Model Decisions

This file records field-level workflow/model decisions made while converting the ICU prototype into a normalized data model. These decisions should later be reflected in `11_ICU_FIELD_CLASSIFICATION.md` and the implementation model.

## 2026-09-17

### PMH, Diagnosis, and Allergies
- Store each as a **discrete repeating list**, not a freeform text block.
- Individual items remain independently addressable in the normalized model.
- Exact Epic source/resource mapping is deferred to the source-mapping step.

### A/O (Alert and Oriented)
- Store the **final orientation level** as the primary value: `A/O x4`, `A/O x3`, etc.
- Do **not** model Person / Place / Time / Situation as four always-present boolean fields for the report model.
- When orientation is less than x4, also store which orientation domain(s) are incorrect/disoriented so the report can display the exception.

Examples:
- `A/O x4`
- `A/O x3 - disoriented to time`
- `A/O x2 - disoriented to time and situation`

Proposed normalized shape:
```text
orientation_level: 4
orientation_deficits: []
```

or, when abnormal:
```text
orientation_level: 3
orientation_deficits: ["time"]
```

Display rule:
- If `orientation_level == 4`, render simply as `A/O x4`.
- If `orientation_level < 4`, render the level plus the specific disoriented domain(s).

Rationale:
The report should preserve the compact bedside shorthand while retaining the clinically useful exception when the patient is not fully oriented.

### PERRLA / Pupils
- Model the **right and left pupil separately** because the report sheet already gives each eye its own field and future EHR ingestion should preserve source detail rather than flattening it.
- For each eye, store at minimum:
  - pupil size in millimeters
  - reaction to light
- Do not store only a derived `PERRLA = true/false` value.
- Pupil equality should be **derived from the two recorded pupil sizes**, not entered as an independent source-of-truth field.
- The report may render a compact summary when findings are normal, but the normalized model keeps the detailed right/left values.

Proposed normalized shape:
```text
pupils:
  right:
    size_mm: 3
    reaction: "brisk"
  left:
    size_mm: 3
    reaction: "brisk"
```

Example abnormal/asymmetric data:
```text
pupils:
  right:
    size_mm: 4
    reaction: "sluggish"
  left:
    size_mm: 3
    reaction: "brisk"
```

Potential display examples:
- `R 3 mm brisk | L 3 mm brisk`
- `R 4 mm sluggish | L 3 mm brisk`

Derived display logic may later label pupils equal/unequal or summarize PERRLA-style normality, but derived labels must never overwrite or replace the source values.

Rationale:
This project is intended to pull structured chart data rather than reproduce handwritten shorthand. Keeping size and reaction separately for each eye preserves the useful clinical detail while still allowing the final report to stay compact.

### GCS / EMV
- Store the full Glasgow Coma Scale component scores, not only the final total.
- Preserve **Eye**, **Verbal**, and **Motor** as separate structured values.
- Also retain the total GCS score when supplied by the source.
- The application may calculate the total from the three components for validation/display, but a calculated value should not silently overwrite a source-provided total if they disagree.

Proposed normalized shape:
```text
gcs:
  eye: 4
  verbal: 5
  motor: 6
  total: 15
```

Potential display examples:
- `GCS 15 (E4 V5 M6)`
- `GCS 10 (E3 V2 M5)`

Rationale:
The ICU prototype explicitly includes `GCS/EMV`, and the system is intended to ingest structured chart data. Preserving the component scores keeps clinically useful detail while allowing the printed report to remain compact.

### NIHSS
- Store the **full NIH Stroke Scale assessment at the item/component level** when those source data are available, plus the total NIHSS score.
- The default ICU report view should remain compact and show the **total NIHSS score** rather than permanently consuming report space with every NIHSS component.
- In the interactive application, the NIHSS field should be **expandable/clickable** so a nurse can open the full component breakdown when needed.
- The expanded detail is a presentation behavior; the normalized model retains the detailed components regardless of whether they are currently visible.
- Preserve source-provided component values and source-provided total when available. The application may calculate/validate a total from the components, but must not silently overwrite a conflicting source value.

Conceptual normalized shape:
```text
nihss:
  total: 4
  items:
    - item: "..."
      score: 1
    - item: "..."
      score: 0
```

The exact NIHSS item names/codes should be mapped from the approved Epic/EHR source rather than invented in the prototype model.

Display behavior:
- Collapsed/default: `NIHSS 4`
- Expanded: show the available structured item-by-item assessment beneath or beside the total.
- Print/PDF output should default to the compact total unless a later workflow decision explicitly includes the expanded assessment.

Rationale:
The report sheet needs rapid scanability, while an interactive digital version is not constrained to paper. Keeping the detailed assessment in the data model and exposing it on demand gives the nurse depth without turning the primary report into a wall of stroke-scale fields.
