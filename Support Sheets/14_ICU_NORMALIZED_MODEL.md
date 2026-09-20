# Canonical ICU Normalized Model

Last updated: 2026-09-20  
Status: **v0.1 model specification**  
Authority: `13_EPIC_SOURCE_MAP.md`

## Purpose

This document defines the canonical internal model for the ICU report-sheet system.

The model is intentionally **source-shaped, not paper-shaped**. It preserves the structure, timing, status, coding, encounter context, and provenance of Epic/EHR data, then allows the report layer to derive a fast nurse-friendly view.

The model must work with:
- deterministic mock fixtures now,
- an authorized Epic/EHR adapter later,
- more than one unit/report template without rebuilding the core patient model.

## Core Invariants

1. **Source facts remain source facts.**
   - Never silently overwrite a source value with a calculated or simplified value.
   - Preserve source codes, display text, units, timestamps, statuses, and identifiers when available.

2. **Derived values are first-class and traceable.**
   - Every derived report value records the source record IDs it came from.
   - Examples: age, H/H display, shift UOP total, side-level lung inheritance, BGM time-slot projection.

3. **Encounter boundaries are explicit.**
   - Data from a prior encounter must not become current ICU data merely because it is the newest item in a global list.

4. **History is preserved.**
   - The canonical model stores repeating/time-based observations.
   - The report engine chooses what is current/relevant through explicit selection rules.

5. **Missing is not normal.**
   - Unknown, unavailable, not documented, not applicable, and truly negative/normal values must remain distinguishable when the source supports that distinction.

6. **Paper limits do not constrain cardinality.**
   - Four IV rows, three BGM slots, one pain box, one treatment box, and similar paper conveniences are report-layer concerns only.

7. **Customer-specific Epic configuration stays in the adapter.**
   - FLO IDs, local value lists, LDA codes, room/bed exposure, Purewick representation, and similar organization-specific mappings must not leak into the canonical domain model.

---

# 1. Top-Level Model

```text
IcuReportContext
  schema_version
  generated_at
  patient
  encounter

  code_status[]
  medical_history[]
  encounter_diagnoses[]
  allergies[]

  observations[]
  ldas[]
  nutrition_orders[]
  medication_orders[]
  medication_administrations[]
  lab_results[]

  handoff_fields[]
  clinical_notes[]
  nursing_interventions[]

  manual_report_annotations[]
  derived_values[]

  source_records[]
  provenance[]
  normalization_issues[]
```

### Why this shape

- `patient` and `encounter` establish identity and encounter scope.
- Source collections preserve their natural cardinality and history.
- `derived_values` contains report-facing calculations/projections without mutating source records.
- `source_records` and `provenance` provide traceability to the adapter/source layer.
- `normalization_issues` makes missing, conflicting, stale, or unmappable data visible rather than silently repairing it.

---

# 2. Shared Primitives

## 2.1 SourceRecordRef

Every normalized source-backed record must be traceable to the source payload or source entity that created it.

```text
SourceRecordRef
  id                    # internal stable ID used by derived_from links
  source_system         # e.g. "epic-fhir-r4", "mock-fixture"
  source_resource_type  # Patient, Observation, Device, etc.
  source_resource_id    # FHIR/resource identifier when available
  source_endpoint       # conceptual adapter endpoint/family, not credentials
  encounter_ref?        # normalized encounter ID when scoped to encounter
  patient_ref
  source_last_updated?
  imported_at
```

Rules:
- `source_resource_id` is source identity, not the application's database primary key.
- Never place credentials, tokens, host secrets, or PHI exports in repository fixtures.
- A source record can be referenced by many normalized records when the source contains multiple usable components.

## 2.2 ProvenanceRef

```text
ProvenanceRef
  id
  target_source_record_ids[]
  recorded_at?
  author_or_agent_display?
  author_or_agent_ref?
  source_resource_id?
```

Use source provenance when Epic supplies it. Do not invent authorship.

## 2.3 ClinicalCode

```text
ClinicalCode
  system?
  code?
  display?
  text?
```

Rules:
- Preserve local Epic codes as well as standard codes when both are available.
- Do not replace a local source code with a guessed LOINC/SNOMED code.
- Normalized report selectors may recognize one or more approved codes later.

## 2.4 QuantityValue

```text
QuantityValue
  value
  unit?
  system?
  code?
```

Never discard the source unit before conversion. If the report converts units, store that conversion as derived.

## 2.5 TimeRange

```text
TimeRange
  start?
  end?
```

## 2.6 SourceValue

An observation or assessment can carry different source value forms.

```text
SourceValue =
    QuantityValue
  | ClinicalCode
  | string
  | integer
  | decimal
  | boolean
  | TimeRange
  | null
```

The normalized layer should not coerce a coded result into plain text if source coding is available.

## 2.7 Availability

```text
Availability
  state:
    present
    missing
    unavailable
    not_documented
    not_applicable
    unknown
  source_reason?
```

Use only distinctions supported by source data or adapter knowledge. Do not guess why a value is absent.

## 2.8 DerivedValue

```text
DerivedValue
  id
  key
  value
  unit?
  generated_at
  rule_id
  derived_from_source_record_ids[]
  derived_from_normalized_record_ids[]
  notes?
```

Examples:
- `patient.age_years`
- `respiratory.rul_effective_display`
- `labs.hh_display`
- `gu.shift_uop_ml`
- `bgm.slot_1200`

---

# 3. Patient

Source family: **Patient (Demographics)**.

```text
PatientSummary
  id
  source_ref
  identifiers[]
  names[]
  display_name?
  birth_date?
  sex_or_gender_source_values[]
  deceased_status?
  availability
```

v0.1 report requirements:
- display name
- birth date when available so age can be derived

### Age rule

Do not store age as the source-of-truth patient fact.

```text
DerivedValue
  key: "patient.age_years"
  derived_from: patient.birth_date
  rule_id: "age-at-report-time-v1"
```

If DOB is missing, age is missing unless Epic provides another explicitly sourced age datum that the adapter maps separately.

---

# 4. Encounter Context

Source family: **Encounter (Patient Chart)** plus referenced location/context when exposed.

```text
EncounterContext
  id
  source_ref
  status?
  class?
  type_codes[]
  period?
  admission_time?
  discharge_time?
  service_type?
  location_history[]
  current_location?
  availability
```

```text
EncounterLocation
  source_ref?
  location_ref?
  display?
  physical_type?
  period?
  status?
```

### Room / bed rule

Room/bed belongs to encounter/location context, never permanent patient identity.

Exact room/bed availability is deployment-specific. The adapter may populate `current_location` only from authorized source data.

---

# 5. Code Status

Source family: **Consent (Code Status)**, with Code Status Questionnaire data only when intentionally incorporated.

```text
CodeStatusRecord
  id
  source_ref
  status?
  category_codes[]
  scope?
  display?
  effective_period?
  date_time?
  policy_or_detail_refs[]
  note_texts[]
  availability
```

Canonical model keeps multiple records/history. The report engine selects the effective current code-status record by status + effective period + encounter/report time.

Do not collapse historical directives into one permanent patient field.

---

# 6. Conditions

## 6.1 Medical History

Source family: **Condition (Medical History)**.

```text
ConditionRecord
  id
  source_ref
  domain                # medical_history | encounter_diagnosis | future problem list, etc.
  code
  clinical_status?
  verification_status?
  category_codes[]
  severity?
  body_sites[]
  onset?
  abatement?
  recorded_date?
  encounter_ref?
  notes[]
  availability
```

`medical_history[]` contains ConditionRecords with `domain = medical_history`.

## 6.2 Encounter Diagnoses

Source family: **Condition (Encounter Diagnosis)**.

`encounter_diagnoses[]` uses the same ConditionRecord shape with:
- encounter reference preserved,
- source category preserved,
- no assumption that “first item” is primary diagnosis.

If primary/admitting/principal distinctions are exposed, preserve them as source metadata rather than inferring them from list position.

---

# 7. Allergies

Source family: **AllergyIntolerance (Patient Chart)**.

```text
AllergyRecord
  id
  source_ref
  clinical_status?
  verification_status?
  type?
  category_codes[]
  criticality?
  substance
  onset?
  recorded_date?
  last_occurrence?
  reactions[]
  notes[]
  availability
```

```text
AllergyReaction
  manifestations[]
  severity?
  onset?
  exposure_route?
  notes[]
```

Do not reduce allergies to comma-separated text in the canonical model.

“No known allergies” and “not reviewed/not on file” must remain distinguishable if Epic returns that distinction.

---

# 8. Generic Clinical Observations

Source families:
- Observation (Vital Signs)
- Observation (Assessments)
- Observation (SmartData Elements)
- customer-configured flowsheet rows exposed through approved interfaces

This is the primary canonical representation for bedside nursing assessments.

```text
ObservationRecord
  id
  source_ref

  domain                 # neuro, cardiac, respiratory, gi, gu, pain, bgm, etc.
  code
  category_codes[]
  status?

  value?
  components[]

  effective_time?
  effective_period?
  issued_time?

  body_site?
  laterality?
  scope?                  # e.g. right_lung, RLL, RUE, bladder; source-preserved

  interpretation_codes[]
  method?
  device_ref?
  performer_refs[]

  panel_parent_id?
  member_ids[]
  derived_from_ids[]

  encounter_ref?
  availability
  notes[]
```

```text
ObservationComponent
  code
  value?
  interpretation_codes[]
  reference_ranges[]
```

### Panel / assessment rule

Epic publicly documents assessment data as potentially:
- panel observations referencing member items with `hasMember`, or
- item observations referencing a source panel through `derivedFrom`.

The normalized model must preserve those relationships rather than flattening the panel into arbitrary report fields.

---

# 9. Domain Tags for Bedside Assessments

The adapter maps customer-specific codes/FLO IDs into stable **application concepts** without discarding the source code.

Examples of application concept keys:

```text
neuro.orientation
neuro.pupil.size
neuro.pupil.reaction
neuro.gcs.eye
neuro.gcs.verbal
neuro.gcs.motor
neuro.gcs.total
neuro.nihss.*
neuro.strength

cardiac.rhythm
cardiac.pulse
cardiac.edema

respiratory.oxygen_device
respiratory.flow
respiratory.fio2
respiratory.vent.mode
respiratory.vent.tidal_volume
respiratory.vent.peep
respiratory.vent.rate
respiratory.lung_sound

gi.assessment.*
gu.assessment.*
gu.void
gu.output

pain.score
pain.location
pain.quality

bgm.glucose
```

These application concepts are **adapter mappings**, not claims that Epic uses these exact names.

The original Epic/FHIR code remains attached to every ObservationRecord.

---

# 10. Neuro Projection Rules

The source model is ObservationRecords. The report may derive compact displays.

## Orientation

Keep source observation(s). If a validated adapter mapping can reliably produce:
- final orientation level
- specific deficits

then the report may derive:

```text
A/O x4
A/O x3 - disoriented to time
```

Do not generate deficits that are not present in source data.

## Pupils

Preserve source size and reaction by eye.

Derived report values may compare right/left size, but equality is not a replacement source field.

## GCS

Preserve source Eye / Verbal / Motor components and source total.

A calculated total can be used for validation or display, but source and calculated totals remain separate if they disagree.

## NIHSS

Preserve panel/item detail and source total when available.

Default report projection may display total only and expose source items on expansion.

## Strength

Preserve the actual source scope and scale by limb/site.

The report may group into RUE/LUE/RLE/LLE when the source mapping supports that grouping.

---

# 11. Cardiac Projection Rules

## Rhythm

Use source ObservationRecord(s). Report chooses the effective current rhythm through selection policy.

## Pulses

Canonical data are repeating observations with:
- source site/body site
- laterality
- source value/grade
- timestamp/status

The report may group source sites under “Radial” or “Pedal” labels.

## Edema

Canonical data are repeating source observations.

Preserve:
- location/body site
- laterality
- source grade/value
- source type such as pitting/non-pitting only when actually returned
- timestamp/status

---

# 12. Respiratory Projection Rules

## Oxygen / Flow / FiO2 / Vent Settings

Each source value remains a time-based ObservationRecord.

Do not make oxygen device, LPM, FiO2, and vent settings mutually exclusive.

## Lung sounds

Canonical model preserves the actual source scope.

Example:

```text
ObservationRecord
  code: <source lung-sound code>
  scope: right_lung
  value: clear
```

The report may derive:

```text
RUL = clear   derived_from right_lung observation
RML = clear   derived_from right_lung observation
RLL = clear   derived_from right_lung observation
```

If a source-direct RLL finding exists, that source-specific value takes precedence for the RLL display.

Never create fake lobe-level source records.

---

# 13. Lines, Drains, Airways, and Wounds

Source families:
- Device (Lines, Drains, Airways)
- DeviceUseStatement (Lines, Drains, Airways)
- Observation (Lines, Drains, Airways)

Epic's public LDA-W documentation describes lines, drains, airways, and wound data, including LDA properties and assessments.

```text
LdaRecord
  id
  source_refs[]

  device_source_ref?
  use_statement_source_ref?

  type_code
  display?
  status?
  patient_ref
  encounter_ref?

  site?
  laterality?
  placement_time?
  effective_period?

  identifiers[]
  properties[]
  assessment_observation_ids[]

  availability
```

```text
LdaProperty
  code
  value
  source_ref
```

### Important rule

An assessment such as “blood return” is not an immutable IV property if Epic charts it as a time-based LDA assessment.

Keep it as an ObservationRecord linked to the LDA.

### v0.1 device examples

Potential LDA types include, depending on target Epic configuration:
- peripheral IV
- central line / vascular access
- Foley
- feeding tube
- airway
- drain
- wound

Do not invent the target organization's LDA taxonomy.

---

# 14. Nutrition Orders

Source family: **NutritionOrder**.

Epic publicly documents NutritionOrder as supporting oral diets and enteral nutrition/tube feedings.

```text
NutritionOrderRecord
  id
  source_ref
  status?
  intent?
  patient_ref
  encounter_ref?
  ordered_at?

  oral_diet?
  supplements[]
  enteral_feeding?
  instructions[]
  exclusions_or_preferences[]

  availability
```

```text
OralDiet
  types[]
  nutrient_modifications[]
  texture_modifications[]
  fluid_consistency_types[]
  instruction?
```

```text
EnteralFeeding
  base_formula?
  additive_products[]
  caloric_density?
  route?
  administration_instructions[]
  schedule?
  source_detail
```

### Tube-feed rate / FWF

Do not invent one universal field location.

If the approved Epic NutritionOrder exposes the needed rate/flush detail, normalize it there.

If the target build documents current delivery/flushes in flowsheet observations, preserve those as ObservationRecords and link them to the nutrition/device context where possible.

---

# 15. Medication Orders

Source family: **MedicationRequest / signed medication order** where applicable.

```text
MedicationOrderRecord
  id
  source_ref
  status?
  intent?
  medication_code?
  medication_ref?
  patient_ref
  encounter_ref?
  authored_on?
  requester_ref?
  dosage_instructions[]
  availability
```

Do not treat an active order as proof the medication is currently infusing.

---

# 16. Medication Administrations / IV Drips

Source family: **MedicationAdministration** where the target Epic interface exposes administered medication state.

```text
MedicationAdministrationRecord
  id
  source_ref
  status?
  medication_code?
  medication_ref?
  order_ref?

  patient_ref
  encounter_ref?

  effective_time?
  effective_period?

  route?
  site?
  dose?
  rate?

  performer_refs[]
  device_refs[]
  notes[]
  availability
```

### Drip selection rule

A report “current drip” is a report projection selected from administration records by:
- encounter,
- source status,
- effective timing,
- medication domain relevance,
- any target-specific stop/hold/resume semantics exposed by source.

Never select “current” by array position.

Ordered rate and administered rate remain different source facts.

---

# 17. Labs

Primary source family: **Observation (Labs)**.  
Optional grouping/context: DiagnosticReport.  
Narrative/addenda when deliberately needed: DocumentReference (Labs).

```text
LabResultRecord
  id
  source_ref
  patient_ref
  encounter_ref?

  code
  display?
  category_codes[]
  status?

  value?
  components[]

  reference_ranges[]
  interpretation_codes[]

  specimen_ref?
  effective_time?
  issued_time?

  diagnostic_report_refs[]
  performer_refs[]
  notes[]

  availability
```

```text
ReferenceRange
  low?
  high?
  type?
  text?
```

### Report lab selector

The report template contains selectors such as:
- WBC
- RBC
- hemoglobin
- hematocrit
- platelets
- PT
- INR
- PTT
- Na
- K
- Cl
- CO2
- creatinine
- anion gap
- BUN
- eGFR
- calcium
- albumin
- total protein
- ALT
- AST
- total bilirubin
- phosphorus
- magnesium

These selectors match approved source codes/display mappings. They are not schema properties.

### H/H

`H/H` is a DerivedValue combining the selected hemoglobin and hematocrit results unless Epic itself returns a source result explicitly representing the combination.

---

# 18. Handoff Fields

Source family: **DocumentReference (Handoff) + Binary**.

Epic publicly documents handoff reports as specialty-specific reports split into purpose-based fields such as “To Do” and “Medications.”

```text
HandoffFieldRecord
  id
  source_ref
  encounter_ref?
  patient_ref

  specialty?
  purpose?
  title?
  status?
  authored_at?
  author_refs[]

  content_ref?
  content_text?          # only after authorized Binary retrieval / mock fixture
  availability
```

The report can choose which handoff purposes to surface.

Do not merge all handoff fields into one untraceable “Treatment” string.

---

# 19. Clinical Notes

Source family: **DocumentReference (Clinical Notes) + Binary**.

```text
ClinicalNoteRef
  id
  source_ref
  encounter_ref?
  patient_ref
  category_codes[]
  type_code?
  status?
  authored_at?
  author_refs[]
  content_ref?
  selected_excerpt?
  availability
```

v0.1 should not ingest entire notes and silently generate clinical conclusions.

Only explicitly selected source-backed note content belongs in the report projection.

---

# 20. Nursing Interventions

Source family: **Procedure (Nursing Intervention)** where exposed by the target workflow.

```text
NursingInterventionRecord
  id
  source_ref
  patient_ref
  encounter_ref?
  status?
  code
  performed_time?
  performed_period?
  performer_refs[]
  reason_codes[]
  body_sites[]
  notes[]
  availability
```

These remain separate from handoff narrative and manual report notes.

---

# 21. Manual Report Annotations

Manual report notes are intentionally **not chart facts**.

```text
ManualReportAnnotation
  id
  report_context_id
  section_key?
  text
  created_at
  created_by_local_user?
  source_label: "report-only"
  linked_normalized_record_ids[]
```

Rules:
- Never label manual report annotations as Epic data.
- Never silently write them back to Epic.
- If future write-back exists, that is a separate explicit feature with authorization and workflow requirements.

This replaces generic canonical `Misc` fields.

---

# 22. BGM

Canonical model:
- repeating timestamped glucose observations in `observations[]` or `lab_results[]`, depending on approved source mapping.

The report may derive legacy display slots:

```text
DerivedValue
  key: "bgm.slot_0800"
  derived_from: [selected glucose source record]
```

Selection windows must be configurable and explicit.

Do not create canonical properties named `8a`, `12p`, or `16p`.

---

# 23. Pain

Pain is a repeating timestamped assessment.

Possible source records may include separate observations for:
- score
- scale
- location
- quality/type
- reassessment
- intervention relationship

Do not assume all pain detail arrives in one source object.

A report-facing “current pain” display is derived from explicit selection/grouping rules.

---

# 24. GU / UOP

Urinary assessment and output remain time-based ObservationRecords.

## UOP

Preserve each source measurement.

Shift total is derived:

```text
DerivedValue
  key: "gu.shift_uop_total"
  value: <sum>
  unit: "mL"
  rule_id: "uop-within-shift-window-v1"
  derived_from_source_record_ids: [...]
```

If the report displays a rate, the time denominator must be explicit and derived from known timestamps/window.

Never turn missing UOP documentation into zero output.

---

# 25. Treatment / To Do Projection

The report's old Treatment area becomes a projection over:

```text
selected_handoff_fields[]
recent_nursing_interventions[]
selected_clinical_note_refs[]
manual_report_annotations[]
```

The UI must visually distinguish:
- Epic/EHR-sourced content
- report-derived summaries
- local/manual annotations

---

# 26. Current-Value Selection Framework

The canonical model stores history. A separate selection layer produces the report snapshot.

```text
SelectionPolicy
  id
  domain
  encounter_scope
  allowed_source_statuses[]
  disallowed_source_statuses[]
  time_basis                 # effective, issued, authored, etc.
  recency_window?            # configurable; not globally hard-coded
  tie_break_rule?
  required_codes_or_tags[]
```

```text
SelectionResult
  policy_id
  selected_record_ids[]
  rejected_record_ids[]
  reason
  evaluated_at
```

## Universal selection order

1. Restrict to the active report patient.
2. Restrict to the intended encounter when the source is encounter-scoped.
3. Exclude source states the adapter marks unusable, such as entered-in-error, when that semantics is provided by the source.
4. Apply the domain-specific time basis.
5. Apply domain-specific recency/current-state semantics.
6. Preserve ties/conflicts when there is no trustworthy rule to choose one.
7. Record the selection result and source IDs used by the report.

### No global “latest wins” rule

Different domains mean different things:
- current device status
- active nutrition order
- current medication administration
- latest pain assessment
- most recent valid weight
- lab result nearest/within a configured report window
- active code status by effective period

Each gets its own policy.

---

# 27. Minimum v0.1 Selection Policies

The implementation must define explicit policies for:

1. active encounter
2. current encounter location
3. current code status
4. report weight
5. latest/relevant bedside assessment by concept
6. current LDA/device list
7. current nutrition order(s)
8. current/active drips
9. displayed lab result per selector
10. current/relevant pain
11. BGM slot/timeline projection
12. UOP shift total/window
13. current handoff fields
14. source-note excerpt inclusion

No fixed recency duration is locked in this document unless workflow validation defines one.

---

# 28. Normalization Issues

```text
NormalizationIssue
  id
  severity              # info | warning | error
  code
  message
  source_record_ids[]
  normalized_record_ids[]
  created_at
```

Examples:
- unmapped customer FLO code
- source value has unsupported unit
- conflicting source records with no safe tie-break
- missing encounter association
- source panel references missing member
- required report selector found no qualifying source data

The system should surface issues rather than silently inventing a value.

---

# 29. Mock Fixture Contract

Mock fixtures should mimic the **normalized source-shaped model**, not the old paper form.

Minimum fixture sections:

```text
patient
encounter
code_status[]
medical_history[]
encounter_diagnoses[]
allergies[]
observations[]
ldas[]
nutrition_orders[]
medication_orders[]
medication_administrations[]
lab_results[]
handoff_fields[]
clinical_notes[]
nursing_interventions[]
manual_report_annotations[]
source_records[]
provenance[]
```

Fixture rules:
- fake names/identifiers only
- deterministic timestamps
- at least one missing datum
- at least one repeating collection
- at least one source-vs-derived example
- at least one conflict or stale-value scenario for testing
- no real PHI

---

# 30. Example Source-Shaped Mock Skeleton

```text
IcuReportContext
  patient:
    id: patient-001
    display_name: "Jordan Example"
    birth_date: 1978-04-11

  encounter:
    id: enc-001
    status: in-progress
    class: inpatient
    current_location:
      display: "ICU 12"

  code_status:
    - id: cs-001
      display: "Full Code"
      effective_period: ...

  medical_history:
    - id: mh-001
      code: ...

  encounter_diagnoses:
    - id: dx-001
      code: ...

  allergies:
    - id: alg-001
      substance: ...

  observations:
    - id: obs-weight
      domain: vital
      code: ...
      value: 82 kg
      effective_time: ...

    - id: obs-r-lung
      domain: respiratory
      code: <source lung-sound code>
      scope: right_lung
      value: clear
      effective_time: ...

    - id: obs-pain
      domain: pain
      code: <source pain-score code>
      value: 4
      effective_time: ...

  ldas:
    - id: lda-piv-001
      type_code: <source PIV type>
      site: ...

  nutrition_orders:
    - id: nut-001
      status: active
      oral_diet: ...

  medication_administrations:
    - id: mar-001
      status: in-progress
      medication_code: ...
      rate: ...

  lab_results:
    - id: lab-hgb
      code: <hemoglobin code>
      value: ...
      effective_time: ...

  handoff_fields:
    - id: handoff-todo
      purpose: "To Do"
      content_text: "Mock handoff content"

  manual_report_annotations:
    - id: note-local-001
      section_key: "treatment"
      text: "Mock report-only reminder"
```

This is illustrative, not a final storage format.

---

# 31. Report Projection Boundary

The report template consumes the canonical model through selectors/derivations.

Example:

```text
ICU template
  header.patient_name
    <- patient.display_name

  header.age
    <- derived_values["patient.age_years"]

  neuro.gcs
    <- selected ObservationRecords tagged neuro.gcs.*

  respiratory.lungs
    <- selected source lung observations
    <- derived per-lobe display values

  iv_access
    <- selected current LdaRecords

  drips
    <- selected current MedicationAdministrationRecords

  bgm
    <- selected glucose observations
    <- derived time-slot projection

  labs.h_h
    <- selected hemoglobin + hematocrit LabResultRecords
    <- derived H/H display

  treatment
    <- selected handoff + interventions + annotations
```

The UI/template must never reach directly into Epic-specific raw payloads.

---

# 32. Adapter Boundary

A future Epic adapter is responsible for:

1. calling authorized Epic interfaces,
2. preserving raw source identity,
3. mapping customer-local codes/FLO IDs into stable application concept tags,
4. emitting this normalized model,
5. preserving the original source code/value alongside the application concept,
6. reporting unknown/unmapped source items as normalization issues.

The adapter must **not**:
- choose nurse-facing layout,
- erase source history,
- replace missing values with normal defaults,
- invent universal Epic IDs,
- collapse order intent and administration state,
- derive clinical conclusions beyond explicit deterministic mapping rules.

---

# 33. Persistence Boundary

v0.1 does not require a database.

The model can initially be serialized as deterministic local fixture data.

If persistence is later added, the logical model should survive unchanged:
- source records/history
- normalized domain records
- derived values
- report annotations
- provenance
- selection results/issues

Storage technology must not become the domain model.

---

# 34. Security / Privacy Boundary

Prototype:
- mock/de-identified data only
- no tokens or credentials
- no live Epic host configuration committed
- no real Binary note content
- no real patient identifiers

Future clinical deployment requires separate design for:
- authentication/authorization
- least privilege
- audit
- encrypted transport/storage
- retention
- access logging
- organizational privacy/security controls

Those production requirements are outside v0.1 but must not be architecturally blocked.

---

# 35. Public Epic Basis

This model is grounded in the Epic source map and Epic's public R4 API catalog.

Key public interfaces used as architectural anchors:

- Patient.Read (Demographics) (R4)
- Encounter.Search (Patient Chart) (R4)
- Condition (Medical History) (R4)
- Condition.Search (Encounter Diagnosis) (R4)
- AllergyIntolerance.Search (Patient Chart) (R4)
- Consent (Code Status) (R4)
- Observation (Vital Signs) (R4)
- Observation.Search (Assessments) (R4)
- Observation (SmartData Elements) (R4)
- Device / DeviceUseStatement / Observation (Lines, Drains, Airways) (R4)
- NutritionOrder.Read/Search (R4)
- MedicationRequest (Signed Medication Order) (R4)
- MedicationAdministration (R4 catalog surface)
- Observation.Search (Labs) (R4)
- DocumentReference.Search (Handoff) (R4)
- DocumentReference.Search (Clinical Notes) (R4)
- Procedure (Nursing Intervention) (R4 catalog surface)
- Provenance (R4 catalog surface)

Official catalog:
- https://fhir.epic.com/

Selected public specifications:
- https://fhir.epic.com/Specifications?api=931
- https://fhir.epic.com/Specifications?api=909
- https://fhir.epic.com/Specifications?api=952
- https://fhir.epic.com/Specifications?api=947
- https://fhir.epic.com/Specifications?api=11052
- https://fhir.epic.com/Specifications?api=10224
- https://fhir.epic.com/Specifications?api=10227
- https://fhir.epic.com/Specifications?api=999
- https://fhir.epic.com/Specifications?api=10131
- https://fhir.epic.com/Specifications?api=1048
- https://fhir.epic.com/Specifications?api=974
- https://fhir.epic.com/Specifications?api=996

## Public-documentation limitation

The model intentionally does **not** define customer-specific:
- FLO IDs
- assessment IDs
- local value lists
- LDA types/properties
- Purewick mapping
- room/bed mapping
- enteral-rate/FWF mapping
- handoff-purpose values
- security/scopes

Those belong to the deployment adapter for a real Epic customer.

---

# 36. v0.1 Vertical Slice Contract

A v0.1 implementation is complete at the model layer when it can:

1. load one deterministic source-shaped mock `IcuReportContext`,
2. validate source identity, encounter scope, timestamps, status, units, and availability,
3. select current/relevant records through explicit policies,
4. generate derived values with traceable `derived_from` links,
5. project the normalized model into the ICU nurse report,
6. visibly distinguish source, derived, missing, and manual-annotation data,
7. render repeating devices/drips/conditions/allergies without arbitrary paper limits,
8. print/export the report without changing the canonical data,
9. run without live Epic access.

## Completed validation artifacts

The model is now exercised by:
- `15_MOCK_ICU_FIXTURE.json`
- `16_ICU_SELECTION_POLICIES.md`
- `17_FIRST_REPORT_PROJECTION.md`

The fixture/policy audit passes deterministically. Next: implement the model and selection engine in executable code.
