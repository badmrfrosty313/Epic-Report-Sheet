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

### Extremity Strength / Grips / Pedals
- Store strength as a **structured grade for each extremity**, not only a freeform `strong/weak` label.
- Keep right and left upper and lower extremities independently addressable: `RUE`, `LUE`, `RLE`, `LLE`.
- Preserve the actual documented strength grade from the source when available.
- The report can render the four values compactly, while the normalized model keeps each extremity as its own structured field.
- Do not infer a missing grade from narrative terms or manufacture a normal value when the source is absent.

Conceptual normalized shape:
```text
strength:
  rue: 5
  lue: 5
  rle: 4
  lle: 4
```

Potential compact display:
- `RUE 5/5 | LUE 5/5 | RLE 4/5 | LLE 4/5`

Rationale:
The prototype already separates upper and lower extremity findings by side. Since the application is intended to ingest charted data, retaining the documented structured grade avoids throwing away detail while still keeping the report scan-friendly.

### Governing Source-Preservation Rule
- If a value, code, unit, timestamp, status, label, component, or other clinically relevant attribute can be pulled directly from the approved Epic/EHR source, preserve it as **source data** rather than replacing it with a simplified interpretation.
- Normalization may reorganize source facts into the application's internal model, but must not silently change their meaning.
- Derived values, summaries, flags, comparisons, calculations, and display shorthand must be stored or generated separately from source values and clearly treated as **derived**.
- A derived value must never overwrite the source value that produced it.
- If source data are absent, the application should represent them as absent/unknown rather than inventing a normal/default value.
- When practical, retain useful provenance metadata such as source field/resource identity, source timestamp, units, coded value, display text, and status so later UI or audit behavior can distinguish what Epic supplied from what the report engine calculated.
- The UI may aggressively compress information for scanability, but expansion/detail views should be able to reveal the richer preserved source data when useful.

Examples:
- Pupil equality is derived from right/left pupil source values; the bilateral source values remain intact.
- GCS total may be validated/calculated from E/V/M, but source components and source total remain intact.
- NIHSS can display only the total by default while retaining all available source components underneath.
- Rhythm should preserve the source-documented rhythm and any additional source detail we can legitimately ingest; presentation may shorten it without altering the stored source value.

Rationale:
The application is not a replacement chart and should not become a second author of clinical facts. Its job is to preserve trusted source data, organize them into a useful ICU model, and render them efficiently for handoff.

## Pause Checkpoint
Project work paused on 2026-09-17 because two additional WGU classes became available.

### Exact Resume Point
Resume in the **Cardiac** section immediately after the completed Neuro pass.

Next unresolved model shape:
```text
cardiac:
  rhythm: <preserve source value/detail>
  pulses:
    radial:
      right: <TBD source-preserved detail>
      left: <TBD source-preserved detail>
    pedal:
      right: <TBD source-preserved detail>
      left: <TBD source-preserved detail>
  edema:
    - <TBD repeating structured finding: location/laterality/grade/type/source detail>
```

Do not treat the sketch above as a final schema. It is a resume marker showing exactly which decisions remain.

### Do Not Reopen on Resume
- PMH/Diagnosis/Allergy list behavior.
- A/O behavior.
- Bilateral pupil behavior.
- GCS component behavior.
- NIHSS expandable-detail behavior.
- Extremity strength behavior.
- The source-preservation rule.

Unless new evidence changes one of those assumptions, continue forward rather than re-litigating settled fields.
## 2026-09-20

### Cardiac: Rhythm, Pulses, and Edema
- Preserve **rhythm** as source data, including source value/display/code and useful timestamp/status/provenance when available.
- Store **pulse findings as repeating structured source observations** with site and laterality. This preserves right/left radial findings and more specific lower-extremity pulse sites if the EHR source distinguishes them.
- The ICU report template may group richer pulse findings into the paper sheet's compact `Radial` and `Pedal` display rows.
- Store **edema as repeating structured findings** rather than one text blob. Preserve source-provided location/laterality, grade, pitting/non-pitting/type, documented value/display text, timestamp, and useful provenance when available.
- Missing findings remain missing and are never defaulted to normal.

Conceptual shape:
```text
cardiac:
  rhythms:
    - value: <source value>
      code: <source code if available>
      observed_at: <source timestamp if available>
  pulses:
    - site: "radial"
      laterality: "right"
      value: <source-documented value/grade>
      observed_at: <source timestamp if available>
    - site: <source-specific lower-extremity pulse site>
      laterality: "left"
      value: <source-documented value/grade>
  edema:
    - location: <source location>
      laterality: <source laterality if available>
      grade: <source grade if available>
      type: <source type if available>
      observed_at: <source timestamp if available>
```

Exact field names above are conceptual, not a final implementation schema. Source-coded values and identifiers remain available rather than being replaced by display shorthand.

### Epic Source Feasibility Note
Public Epic FHIR documentation indicates that Observation APIs can retrieve vital-sign data and certain other flowsheet data using customer/environment-specific encoded flowsheet IDs, and Epic also exposes R4 Observation (Assessments). Exact rows, codes, permissions, and customer configuration remain a later source-mapping task.

### New Exact Resume Point
Continue with **Respiratory**: confirm the prototype's `Oxygen`, `LPM`, and `Percentage` semantics, preserve device/settings source detail, then model lobe-specific lung findings.
### Respiratory: Oxygen, LPM, and FiO2
- The prototype's `Percentage` field means **FiO2 / oxygen concentration percentage** and is intended primarily to accompany ventilator settings.
- Preserve FiO2 as source data when available, including source value, units/representation, timestamp, and useful provenance.
- `Oxygen` stores the source-documented delivery method/device.
- `LPM` stores source flow rate when applicable.
- Do not force oxygen device, LPM, and FiO2 into a mutually exclusive model. Preserve whichever combination the approved source actually provides.
- The report may compress these fields for scanability while an expanded view retains richer source detail.

Conceptual shape:
```text
respiratory:
  oxygen_device: <source device/method>
  flow_lpm: <source flow if applicable>
  fio2_percent: <source FiO2 if applicable>
  vent:
    mode: <source mode>
    tidal_volume: <source value + unit>
    peep: <source value + unit>
    rate: <source value>
```

### New Exact Resume Point
Continue Respiratory with **lung findings by lobe/site**. Preserve source-documented detail rather than collapsing every lobe to a single generic `clear/abnormal` flag.
### Respiratory: Lung Finding Scope
- The ICU report needs **one displayed value per lobe**: RUL, RML, RLL, LUL, and LLL.
- Preserve the source scope exactly as charted. A source observation can apply to a specific lobe, the entire right lung, or the entire left lung.
- If Epic/source data provide a right-lung-wide finding only, derive the same **display value** for RUL, RML, and RLL.
- If Epic/source data provide a left-lung-wide finding only, derive the same **display value** for LUL and LLL.
- Do not duplicate a side-level source finding into fake lobe-level source records.
- If a lobe-specific source value exists, that lobe-specific value overrides the broader side-level value for that lobe's display.
- The normalized model should retain whether a displayed lobe value is source-direct or derived from a broader source scope.

Conceptual shape:
```text
lung_findings:
  - scope: "right_lung"
    value: "clear"
    source_direct: true

effective_lobe_display:
  rul: { value: "clear", derived_from: "right_lung" }
  rml: { value: "clear", derived_from: "right_lung" }
  rll: { value: "clear", derived_from: "right_lung" }
```

If a source-direct RLL value later exists, the effective RLL display uses that lobe-specific value while RUL/RML can still inherit the right-lung-wide value.

### New Exact Resume Point
Respiratory is resolved for the current classification pass. Continue with **GI**, starting with the `Abdomen` field structure.
### Epic-First Model Authority
- Moving forward, build each remaining domain according to **how Epic/EHR actually represents the data**, even if that requires changing the old ICU report-sheet structure.
- The paper/PDF prototype remains valuable for identifying what nurses need to see and how quickly they need to scan it, but it is no longer the canonical data schema.
- Do not flatten, rename, split, merge, or duplicate Epic/source facts merely to fit legacy paper boxes unless that transformation is explicitly a presentation-layer derivation.
- Prefer a faithful source adapter plus a normalized model that preserves Epic semantics/cardinality, then let the ICU report template decide how to compress, group, or expand those facts.
- When Epic's public documentation does not expose a universal field or row because the data are customer-specific, record that uncertainty rather than inventing a universal Epic structure.
- Clinical questions should now be used mainly to resolve workflow/presentation choices or customer-specific ambiguity, not to recreate data structures that can be learned from Epic/source documentation.

Rationale:
The product's value comes from removing manual report reconstruction. Modeling around legacy handwritten boxes would reintroduce that constraint into software. Source-first modeling lets the report adapt to the EHR rather than making the EHR pretend to be paper.

### All-Fields Epic-First Pass Complete
The field-by-field questioning pass is complete. `13_EPIC_SOURCE_MAP.md` is now the authoritative conceptual map for the entire ICU prototype.

Decisions locked by this pass:
- The canonical model is organized by Epic/source domains rather than by paper boxes.
- Bedside nursing assessment concepts remain timestamped observations/history; exact FLO/assessment codes are customer-specific.
- GI abdominal findings and GU urine findings are not single canonical blobs.
- UOP, BGM, Pain, and other repeated assessments remain time-based source collections.
- LDA-W devices/assessments drive IV access, Foley, feeding tubes, airways, and wounds where the target Epic build represents them that way.
- NutritionOrder drives diet/enteral nutrition where exposed.
- MedicationAdministration represents administered infusion state; medication orders remain a separate intent/source collection.
- Lab results are generic coded Observation records; the report chooses which labs to display.
- Treatment/To Do is a presentation surface over handoff/intervention/note sources plus clearly marked manual annotations, not one untraceable clinical text field.
- Generic Misc is removed from the canonical clinical model.
- Customer-specific mapping is an adapter/deployment concern and does not block mock/source-shaped v0.1 development.

The next design artifact should be the canonical normalized ICU model/schema.
