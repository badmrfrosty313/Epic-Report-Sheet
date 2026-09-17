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
