# Epic Source Map — ICU Report Sheet

Last updated: 2026-09-20

## Purpose

This document maps every field or section from the ICU report-sheet prototype to the **best public Epic/FHIR source family we can identify today**.

The governing rule is source-first:

1. Epic/EHR source structure and semantics are authoritative.
2. The old ICU PDF is a workflow and display reference, not the canonical data schema.
3. Preserve source values, codes, units, timestamps, statuses, cardinality, and provenance when available.
4. Derived report values remain separate and reference the source data they came from.
5. Missing source data remain missing.
6. Exact customer-specific flowsheet rows, LDA codes, value lists, security, and mappings are deployment configuration, not things to invent in the prototype.

## Confidence Labels

- **Public standard source** — Epic publicly documents a purpose-built R4 resource/API family for this domain.
- **Public configurable source** — Epic publicly exposes a generic Observation/LDA/SmartData surface, but the exact row/code/value set is customer/environment specific.
- **Presentation-derived** — calculated or projected from source data only for the report.
- **Manual report annotation** — report-specific text that is not represented as a source clinical fact.
- **Deployment validation required** — public documentation is insufficient to name one universal Epic row or code.

## Canonical Source Domains

The normalized model should be organized around source domains rather than paper sections:

- `patient` — Patient (Demographics)
- `encounter` — Encounter, with referenced location/context as available
- `code_status` — Consent (Code Status); Code Status Questionnaire can be supplementary
- `medical_history[]` — Condition (Medical History)
- `encounter_diagnoses[]` — Condition (Encounter Diagnosis)
- `allergies[]` — AllergyIntolerance (Patient Chart)
- `observations[]` — Observation (Vital Signs), Observation (Assessments), Observation (SmartData Elements), and customer-configured flowsheet rows
- `ldas[]` — Device, DeviceUseStatement, and Observation (Lines, Drains, Airways), including LDA-W properties/assessments
- `nutrition_orders[]` — NutritionOrder
- `medication_administrations[]` — MedicationAdministration
- `medication_orders[]` — MedicationRequest / Medication Order where needed to distinguish ordered intent from administered state
- `lab_results[]` — Observation (Labs), with DiagnosticReport for grouping/context when useful
- `radiology_reports[]` — DiagnosticReport (Results), preserving study identity/status/timing/impression and references to imaging/media where available
- `handoff_fields[]` — DocumentReference (Handoff) + Binary
- `clinical_notes[]` — DocumentReference (Clinical Notes) + Binary
- `nursing_interventions[]` — Procedure (Nursing Intervention)
- `provenance[]` — Provenance where supported
- `manual_report_annotations[]` — local report-only notes, explicitly distinct from chart-sourced facts

---

# Field-by-Field Map

## Patient / Header

| Prototype field | Source-first model | Epic/FHIR source family | Behavior / caveat |
|---|---|---|---|
| Room Number | current encounter/location context | Encounter (Patient Chart), referenced Location/context where exposed | **Deployment validation required.** Encounter is the source context; exact room/bed exposure can vary by organization. Do not store room as permanent patient data. |
| Patient Name | patient demographic names | Patient (Demographics) | **Public standard source.** Preserve source name structure; report chooses display name. |
| Age | derived report age | Patient (Demographics), normally from DOB/birth date | **Presentation-derived.** Calculate at report time when source gives DOB rather than trusting a stale stored age. |
| Wt | timestamped weight observation | Observation (Vital Signs) | Keep history, units, timestamp, status. Report selects the appropriate current/recent weight by explicit rule. |
| Code | current code-status directive | Consent (Code Status); Code Status Questionnaire may supplement | **Public standard source.** Preserve effective period/status/comments when exposed. |
| PMH | medical-history condition collection | Condition (Medical History) | **Public standard source.** Do not reduce to one text box. Problem List can remain a separate source collection if the workflow later wants both. |
| Diagnosis | encounter diagnosis collection | Condition (Encounter Diagnosis) | **Public standard source.** Admission/visit/discharge diagnosis distinctions are source metadata/presentation-selection concerns. |
| Allergies | allergy/intolerance collection | AllergyIntolerance (Patient Chart) | **Public standard source.** Preserve substance/code, clinical status, criticality/severity/reaction/onset/notes when returned. |

## Neuro

These bedside findings are not safely represented by one universal public Epic row set. The canonical model should ingest the actual customer-configured chart rows rather than inventing universal Epic IDs.

| Prototype concept | Source-first model | Likely public Epic surface | Report behavior |
|---|---|---|---|
| A/O | timestamped orientation assessment observations | customer-configured Observation flowsheet/assessment/SmartData mapping | Preserve actual source row/value. The existing `A/O x4` + deficit display is a projection if the source supports it. |
| PERRLA R/L | pupil observations, scoped to eye and source row | customer-configured Observation flowsheet/assessment mapping | Preserve source size/reaction rows independently. Equality is derived only for display. |
| GCS / E-V-M | structured score components + source total if available | customer-configured Observation/assessment rows | Preserve panel/item structure if Epic exposes it that way. Calculated total never overwrites source total. |
| NIHSS | source assessment panel/items + total | customer-configured assessment/flowsheet source; use Observation assessment structures only where the target organization exposes NIHSS there | Total can stay compact in report; expand to source components. |
| RUE/LUE/RLE/LLE strength | timestamped limb-specific source observations | customer-configured flowsheet/Observation rows | Preserve source limb/site and value scale. |
| Neuro Misc | source-backed note excerpt or report annotation | Handoff / Clinical Notes if explicitly selected; otherwise manual report annotation | Never pretend local free text came from Epic unless it did. |

**Deployment task for Neuro:** identify the target customer's exact FLO IDs / assessment codes / value lists and whether each is exposed through Vital Signs, Assessments, SmartData, or another approved interface.

## Cardiac

| Prototype concept | Source-first model | Epic/FHIR source family | Behavior |
|---|---|---|---|
| Rhythm | timestamped rhythm observations | customer-configured Observation/flowsheet rows | Preserve source coding/display/status/time. |
| Radial pulses | repeating pulse findings by site + laterality | customer-configured Observation/flowsheet rows | Do not hard-code only R/L radial in canonical model. |
| Pedal pulses | repeating pulse findings by actual source site + laterality | customer-configured Observation/flowsheet rows | Preserve source site if Epic distinguishes dorsalis pedis/posterior tibial/etc.; report may group as “Pedal.” |
| Edema | repeating structured findings | customer-configured Observation/flowsheet rows | Preserve location/laterality/grade/type/time/source value. |
| Cardiac Misc | source-backed handoff/note excerpt or manual annotation | Handoff / Clinical Notes, or manual report annotation | Presentation only. |

## Respiratory

| Prototype concept | Source-first model | Epic/FHIR source family | Behavior |
|---|---|---|---|
| Oxygen | oxygen delivery device/method observation | customer-configured Observation/flowsheet rows; airway devices may also appear in LDA resources | Preserve source device/method and time. |
| LPM | oxygen flow observation with units | customer-configured Observation/flowsheet row | Conditional, timestamped source observation. |
| Percentage | FiO2 / oxygen concentration | customer-configured Observation/flowsheet row | Confirmed workflow meaning. Preserve actual source representation; report displays percent. |
| Vent Mode | ventilator setting observation | customer-configured Observation/flowsheet row | Keep timestamp/history. |
| Tidal Volume | ventilator setting observation | customer-configured Observation/flowsheet row | Preserve value + unit. |
| PEEP | ventilator setting observation | customer-configured Observation/flowsheet row | Preserve value + unit. |
| Vent Rate | ventilator setting observation | customer-configured Observation/flowsheet row | Preserve source value/time. |
| Lung sounds | source observations with the scope Epic actually charts | customer-configured Observation/flowsheet rows | Preserve source scope. Side-wide values may project to lobe boxes for display, but do not fabricate lobe-level source records. |
| Airway device detail | LDA collection | Device / DeviceUseStatement / Observation (Lines, Drains, Airways) | Keep separate from respiratory assessment observations. |
| Respiratory Misc | source-backed note/handoff excerpt or manual annotation | Handoff / Clinical Notes, or manual report annotation | Distinguish source text from report-only text. |

## GI / Nutrition / Enteral Devices

The old single `Abdomen` box should **not** become one canonical field. Build GI from the rows/orders/devices Epic actually supplies.

| Prototype concept | Source-first model | Epic/FHIR source family | Behavior |
|---|---|---|---|
| Abdomen | collection of timestamped abdominal/GI assessment observations | customer-configured Observation/flowsheet/SmartData rows | Preserve separate source concepts such as bowel sounds, distention, tenderness, contour, etc. only if those rows actually exist in the target build. Do not invent a fixed universal list. |
| Diet | active nutrition order(s) | NutritionOrder | **Public standard source.** Preserve order status, type, texture, instruction, timing/data returned. |
| Tube Feeds | active enteral nutrition order(s) | NutritionOrder where exposed | Public Epic docs explicitly include enteral nutrition/tube feedings. |
| Tube Feed Rate | order detail and/or timestamped administration/flowsheet detail | NutritionOrder if returned there; otherwise customer-specific order/Observation mapping | **Deployment validation required.** Do not assume one universal Epic element. |
| FWF | free-water flush order/documentation | NutritionOrder if exposed by customer/resource; otherwise customer-specific order/flowsheet Observation | **Deployment validation required.** |
| DHT | enteral tube LDA/device | Device / DeviceUseStatement / Observation (Lines, Drains, Airways) | Preserve actual device type, status, insertion/effective period, site/properties/assessments. |
| NG/OG Tube | enteral tube LDA/device | Device / DeviceUseStatement / Observation (Lines, Drains, Airways) | Same LDA-first model. |
| GI Misc | source handoff/note excerpt or manual annotation | Handoff / Clinical Notes, or manual report annotation | Not a canonical clinical fact blob. |

## GU / Output / Urinary Devices

| Prototype concept | Source-first model | Epic/FHIR source family | Behavior |
|---|---|---|---|
| Urine | timestamped urinary assessment observations | customer-configured Observation/flowsheet rows | Preserve source characteristics separately if Epic does. |
| Foley | urinary-catheter LDA/device + assessments | Device / DeviceUseStatement / Observation (Lines, Drains, Airways) | Preserve device status/effective period and LDA assessment/property rows. |
| Purewick | external urinary device if represented in target build | LDA/external-device resources when available; otherwise customer flowsheet/Observation | **Customer-specific.** Do not guess universal Epic modeling. |
| Voids | timestamped elimination/voiding observations | customer-configured Observation/flowsheet rows | Repeating/time-based, not one permanent boolean. |
| UOP | timestamped output measurements | customer-configured Observation/flowsheet rows | Preserve each source measurement/time/unit. Report may derive shift total/rate, clearly marked derived. |
| GU Misc | source-backed note/handoff excerpt or manual annotation | Handoff / Clinical Notes, or manual report annotation | Keep provenance explicit. |

## IV Access

The canonical model has **no four-row cap**.

| Prototype field | Source-first model | Epic/FHIR source family | Behavior |
|---|---|---|---|
| Type | LDA device type | Device / DeviceUseStatement (Lines, Drains, Airways) | Repeating device collection. |
| Location | source LDA site/location property | Device / DeviceUseStatement + LDA Observation properties | Preserve exact source coding/display. |
| Site | LDA site/assessment | Observation (Lines, Drains, Airways) and device metadata | Preserve source semantics; do not collapse different site concepts. |
| Blood Return | LDA assessment observation | Observation (Lines, Drains, Airways) / customer LDA assessment row | Timestamped assessment, not an immutable IV property. |
| IV Misc | selected LDA assessments or manual annotation | LDA Observations; optional manual report note | Prefer structured source rows when available. |

Epic publicly documents LDA-W data as including lines, drains, airways, **and wounds**, with LDA properties and assessments. Encoded flowsheet IDs can be organization/environment specific.

## Skin / Wounds

Do not force all skin data into `Location / Type / Treatment` triples.

| Prototype concept | Source-first model | Epic/FHIR source family | Behavior |
|---|---|---|---|
| Wound / skin device-like entries | LDA-W wound records + properties/assessments | Device / DeviceUseStatement / Observation (Lines, Drains, Airways) | Use when Epic represents the wound through LDA-W. |
| General skin assessment | timestamped structured skin observations | customer-configured Observation/flowsheet rows | Preserve actual source rows/values. |
| Treatment/intervention | documented intervention records and/or LDA assessment detail | Procedure (Nursing Intervention), LDA observations, selected note/handoff content | Keep source types distinct; do not flatten all treatment into one string. |

The report can still present a compact wound/skin table, but the canonical data model should preserve whether something is an LDA wound, a general assessment, or an intervention.

## IV Drips / Infusions

The old `Medication + Rate` pair is only a display projection.

| Prototype concept | Source-first model | Epic/FHIR source family | Behavior |
|---|---|---|---|
| Active/administered drip | medication administration event/state | MedicationAdministration | Preserve medication reference/code, status, effective timing, dosage/rate/route/site details that the approved source actually returns. |
| Ordered infusion | medication order/intention | MedicationRequest / Medication Order where available | Keep order separate from actual administration. |
| Rate | administration or order rate as source exposes it | MedicationAdministration / MedicationRequest | Do not assume the ordered rate equals the current administered rate. |

The report should select current/clinically relevant infusions with an explicit time/status rule rather than assuming the last record in a list is current.

## BGM / Point-of-Care Glucose

The paper slots `8a / 12p / 16p` are **presentation only**.

- Canonical model: repeating timestamped glucose observations.
- Source: Observation (Labs) when represented as lab result, or customer-configured vital-sign/flowsheet Observation depending the target Epic build.
- Preserve source code, value, unit, timestamp, status, flags/reference information when returned.
- The report projects readings into time slots or a timeline using explicit window rules.
- Do not store three fixed software properties named `8a`, `12p`, and `16p`.

## Pain

Pain is a **repeating timestamped assessment**, not one report-level scalar.

- Source: customer-configured Observation/flowsheet/assessment rows.
- Preserve the source scale, score, location, quality/type, intervention/reassessment links if the target source exposes them.
- Do not assume location/type/score always arrive in one Epic object.
- Report chooses the current/relevant pain assessment by time/status rule and can expose history on expansion.

## Treatment / To Do / Narrative

The large paper `Treatment` box should **not** become one canonical clinical field.

Potential source collections:

1. **DocumentReference (Handoff)** + Binary  
   Epic publicly documents specialty-specific handoff reports split into purpose-based fields such as “To Do” or “Medications.” This is the strongest source for existing handoff narrative when available.

2. **Procedure (Nursing Intervention)**  
   Preserve documented nursing interventions as structured procedure records where the target workflow uses them.

3. **DocumentReference (Clinical Notes)** + Binary  
   Use only deliberately selected note content. Do not ingest an entire chart and silently generate clinical conclusions.

4. **Manual report annotations**  
   If nurses need report-only reminders not represented in Epic, store them explicitly as local annotations and label them as non-Epic data.

The v0.1 UI may still expose a `Treatment / To Do` panel, but it should be a **projection of selected source collections plus clearly marked report annotations**, not an untraceable text blob.

## Labs

Canonical model: **generic repeating lab result collection**, not one software property per paper label.

Primary source:
- Observation (Labs) for component-level result detail.
- DiagnosticReport can provide grouping/procedure context and references to Observation results where useful.
- DocumentReference (Labs) may carry narratives/addenda when needed.

Preserve, when returned:
- source code / LOINC / local code
- source display name
- value
- unit
- reference range
- interpretation/abnormal flag
- result status
- specimen/effective/result times
- provenance/performer context where available

### Current v0.1 Lab Presentation

Current v0.1 presentation rule: render **all usable available lab results for the active encounter**, newest valid result per distinct source lab code. The UI does not use a hard-coded allowlist. Common ICU labs may be presented in a stable scan order, while additional source labs remain eligible to render automatically.

Missing/unresulted labs are not fabricated into the available-results grid. Source records that explicitly represent missing/unavailable states remain preserved in the normalized history/issues layer.

### Original Prototype Lab Display Selectors

The following are **template selectors**, not canonical schema fields:

- WBC
- RBC
- H/H
- Platelets
- PT
- INR
- PTT
- Na
- K
- Cl
- CO2
- Creatinine
- Anion Gap
- BUN
- eGFR
- Ca
- Albumin
- Total Protein
- ALT
- AST
- Total Bili
- Phos
- Mag

Special rule:
- `H/H` is a **presentation combination** of hemoglobin and hematocrit source results. Do not create a fake source result called H/H unless Epic itself returns one.

## Radiology / Imaging Results

Canonical model: repeating **DiagnosticReport** records for radiology, not a single free-text imaging box.

Primary source:
- DiagnosticReport.Search / Read (Results) (R4).
- Epic's public R4 documentation states DiagnosticReport Results supports radiology and can return text-based radiology content such as narratives or impressions.
- Preserve source report status, code/study name, clinically relevant time, issued time, impression/conclusion text, full findings text when returned, and referenced imaging/media/study identifiers when available.

Report behavior:
- Show encounter-scoped usable radiology reports newest-first.
- Do not use a global "latest radiology replaces all older radiology" rule; multiple studies can remain relevant.
- Lead with **study + time + status + impression** for nurse scanability.
- Preserve fuller findings underneath for source detail.
- Exclude source records marked entered-in-error/cancelled/invalid by source semantics.
- Do not generate or summarize a radiology impression beyond what the source report states.

Official Epic public specification:
- DiagnosticReport.Search (Results) (R4): https://fhir.epic.com/Specifications?api=989
- DiagnosticReport.Read (Results) (R4): https://fhir.epic.com/Specifications?api=988

## Misc Fields

Every `Misc` box in the paper sheet becomes one of two things:

1. a selected source-backed note/handoff excerpt with provenance, or
2. a **manual report annotation**.

There should be no generic `misc` clinical-data field in the canonical patient model. A report annotation belongs to the report/workspace layer, not the source patient chart layer.

---

# Source Selection and Time Rules

The normalized model should keep source history. The report layer chooses what to display.

Rules for implementation:

- Never use “last array item” as a clinical-current-value rule.
- Select by source status, effective/issued/documented time, encounter context, and domain-specific recency.
- If source values conflict, preserve both; do not silently reconcile.
- A derived report value must identify the source record(s) it came from.
- If a source record is deleted/entered-in-error/superseded and Epic exposes that status, honor it.
- Keep the encounter boundary explicit so old values from prior encounters are not accidentally treated as current ICU findings.

# Public Epic Interfaces Supporting This Map

Official Epic public FHIR catalog:
- https://fhir.epic.com/

Specific public specifications used in this mapping:
- Patient.Read (Demographics) (R4): https://fhir.epic.com/Specifications?api=931
- Encounter.Search (Patient Chart) (R4): https://fhir.epic.com/Specifications?api=909
- Condition.Search (Encounter Diagnosis) (R4): https://fhir.epic.com/Specifications?api=952
- AllergyIntolerance.Search (Patient Chart) (R4): https://fhir.epic.com/Specifications?api=947
- Observation.Search (Assessments) (R4): https://fhir.epic.com/Specifications?api=11052
- NutritionOrder.Read (R4): https://fhir.epic.com/Specifications?api=10224
- NutritionOrder.Search (R4): https://fhir.epic.com/Specifications?api=10227
- Observation.Search (Labs) (R4): https://fhir.epic.com/Specifications?api=999
- DocumentReference.Search (Clinical Notes) (R4): https://fhir.epic.com/Specifications?api=1048
- DocumentReference.Search (Handoff) (R4): https://fhir.epic.com/Specifications?api=10131
- Observation.Update (Lines, Drains, Airways) (R4), which documents LDA-W properties/assessments: https://fhir.epic.com/Specifications?api=974

The public Epic catalog also lists R4 interfaces for:
- Condition (Medical History)
- Consent (Code Status)
- Device (Lines, Drains, Airways)
- DeviceUseStatement (Lines, Drains, Airways)
- MedicationAdministration
- Observation (Vital Signs)
- Observation (SmartData Elements)
- Observation (Lines, Drains, Airways)
- Procedure (Nursing Intervention)
- Provenance

## Important Public-Documentation Limitation

Epic's public API catalog identifies resource families, but many bedside nursing flowsheet rows are **not universal identifiers**.

Encoded flowsheet IDs can differ:
- between Epic organizations, and
- between production and non-production environments at the same organization.

Therefore the following remain a deployment-adapter mapping job, not a product-modeling blocker:

- exact FLO IDs for neuro assessments
- GCS / NIHSS rows or assessment mappings
- pupil rows/value lists
- strength rows/value lists
- rhythm/pulse/edema rows
- oxygen/FiO2/ventilator rows
- lung assessment rows
- abdominal/GI assessment rows
- urine/UOP/void rows
- pain rows
- BGM source path if not exposed as lab
- exact LDA types/properties for IVs, Foley, feeding tubes, wounds, airways, and external urinary devices
- exact Purewick representation
- enteral-rate/FWF exposure
- exact room/bed exposure
- handoff field purpose names
- customer security, scopes, and authorization

# Status After This Mapping Pass

Conceptual source identification and field-to-source-family mapping are now complete for **every field on the ICU prototype**.

What is **not** complete:
- customer-specific Epic code/row binding
- final normalized schema names/types in code
- explicit current-value/time-window selection rules by domain
- v0.1 mock fixture
- report UI implementation
- live Epic authorization/integration

## Next Engineering Step

Define the canonical normalized ICU model from these source domains, including:
- source identity/provenance
- timestamps/status
- encounter scoping
- generic Observation representation
- LDA/device representation
- nutrition orders
- medication administrations/orders
- lab results
- handoff/intervention/note references
- manual report annotations

Then build realistic mock fixtures against that model and choose the implementation stack based on the actual shape we now know.
