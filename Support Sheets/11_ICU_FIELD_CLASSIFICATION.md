# ICU Field Behavior Classification

Source: `10_ICU_FIELD_INVENTORY.md`, transcribed from `Report Sheet V.2 ICU - Prototype.pdf`.

This file separates what can be inferred safely from the prototype's layout from decisions that still require clinical/workflow confirmation. `TBD` means the prototype does not provide enough information to decide without inventing behavior.

## Classification Key
- **Scalar structured**: one discrete value for the patient/report.
- **Repeating structured**: zero or more records sharing the same fields.
- **Narrative**: freeform text.
- **Composite / TBD**: visibly structured concept, but exact software representation needs workflow confirmation.
- **Conditional**: relevant only when the corresponding therapy/device/condition applies.

## Patient / Header
| Field | Proposed Behavior | Proposed Data Type | Cardinality | Required Status |
|---|---|---|---|---|
| Room Number | Scalar structured | text | single | TBD |
| PMH | Repeating structured | history/problem item | zero or more | TBD |
| Patient Name | Scalar structured | text | single | TBD |
| Age | Scalar structured | integer/number | single | TBD |
| Wt | Scalar structured | decimal + unit | single | TBD |
| Code | Scalar structured | coded/text value | single | TBD |
| Diagnosis | Repeating structured | diagnosis item | zero or more | TBD |
| Allergies | Repeating structured | allergy item | zero or more | TBD |

### Header List Decision
PMH, Diagnosis, and Allergies are discrete lists in the normalized model, not freeform text blocks. The report template may render them compactly, but each item remains independently addressable so source metadata can be retained and future Epic/EHR ingestion can map cleanly into the model.

Likely conceptual source categories to validate during Epic mapping:
- PMH: medical-history/problem-list conditions.
- Diagnosis: encounter/admission/visit/discharge diagnoses as appropriate to the ICU workflow.
- Allergies: patient-chart allergy/intolerance records.

Exact Epic API/resource fields, authorization, customer configuration, and which diagnosis category belongs on this specific report remain source-mapping decisions rather than assumptions in the normalized model.

## Neuro
| Field | Proposed Behavior | Proposed Data Type | Cardinality | Required Status |
|---|---|---|---|---|
| A/O | Composite / structured | TBD | single | TBD |
| PERRLA - Right | Composite / structured | TBD | single | TBD |
| PERRLA - Left | Composite / structured | TBD | single | TBD |
| GCS/EMV | Composite / structured | TBD | single | TBD |
| NIH | Scalar structured | integer/score | single | Conditional/TBD |
| Grips - RUE | Scalar structured | categorical/text | single | TBD |
| Grips - LUE | Scalar structured | categorical/text | single | TBD |
| Pedals - RLE | Scalar structured | categorical/text | single | TBD |
| Pedals - LLE | Scalar structured | categorical/text | single | TBD |
| Misc | Narrative | text | single | Optional |

## Cardiac
| Field | Proposed Behavior | Proposed Data Type | Cardinality | Required Status |
|---|---|---|---|---|
| Rhythm | Scalar structured | coded/text value | single | TBD |
| Pulses - Radial | Composite / structured | TBD | single | TBD |
| Pulses - Pedal | Composite / structured | TBD | single | TBD |
| Edema | Composite / structured | TBD | single | TBD |
| Misc | Narrative | text | single | Optional |

## Respiratory
| Field | Proposed Behavior | Proposed Data Type | Cardinality | Required Status |
|---|---|---|---|---|
| Oxygen | Scalar structured | text/device | single | Conditional/TBD |
| LPM | Scalar structured | decimal/number | single | Conditional |
| Percentage | Scalar structured | decimal/number | single | Conditional |
| Vent - Mode | Scalar structured | coded/text value | single | Conditional |
| Vent - Tidal Volume | Scalar structured | decimal/number + unit | single | Conditional |
| Vent - PEEP | Scalar structured | decimal/number + unit | single | Conditional |
| Vent - Rate | Scalar structured | integer/number | single | Conditional |
| Lungs - RUL | Scalar structured | categorical/text | single | TBD |
| Lungs - LUL | Scalar structured | categorical/text | single | TBD |
| Lungs - RML | Scalar structured | categorical/text | single | TBD |
| Lungs - RLL | Scalar structured | categorical/text | single | TBD |
| Lungs - LLL | Scalar structured | categorical/text | single | TBD |
| Misc | Narrative | text | single | Optional |

## GI
| Field | Proposed Behavior | Proposed Data Type | Cardinality | Required Status |
|---|---|---|---|---|
| Abdomen | Composite / structured | TBD | single | TBD |
| Diet | Scalar structured | coded/text value | single | TBD |
| Tube Feeds | Scalar structured | text/formula | single | Conditional |
| Rate | Scalar structured | decimal/number + unit | single | Conditional |
| FWF | Scalar structured | decimal/number + unit/frequency | single | Conditional |
| DHT | Scalar structured | boolean/device detail | single | Conditional |
| NG/OG Tube | Scalar structured | boolean/device detail | single | Conditional |
| Misc | Narrative | text | single | Optional |

## GU
| Field | Proposed Behavior | Proposed Data Type | Cardinality | Required Status |
|---|---|---|---|---|
| Urine | Composite / structured | TBD | single | TBD |
| Foley | Scalar structured | boolean/device detail | single | Conditional |
| Purewick | Scalar structured | boolean/device detail | single | Conditional |
| Voids | Scalar structured | boolean/categorical | single | Conditional/TBD |
| UOP | Scalar structured | decimal/number + unit/time | single | TBD |
| Misc | Narrative | text | single | Optional |

## IV Access
The prototype clearly presents four repeated IV rows. Software should model IV access as a repeating collection rather than four hard-coded objects unless later workflow requirements say otherwise.

Per IV access record:
| Field | Proposed Behavior | Proposed Data Type |
|---|---|---|
| Type | Repeating structured | coded/text value |
| Location | Repeating structured | coded/text value |
| Site | Repeating structured | coded/text value |
| Blood Return | Repeating structured | boolean/categorical |

Additional:
- `Misc`: narrative text, optional.

## Skin
The open table layout implies a repeating collection.

Per skin record:
| Field | Proposed Behavior | Proposed Data Type |
|---|---|---|
| Location | Repeating structured | text/coded value |
| Type | Repeating structured | text/coded value |
| Treatment | Repeating structured | text |

Exact semantics and required status are TBD.

## IV Drips
The open table layout implies a repeating collection.

Per drip record:
| Field | Proposed Behavior | Proposed Data Type |
|---|---|---|
| Medication | Repeating structured | text/coded medication |
| Rate | Repeating structured | decimal/text + unit |

Exact rate representation is TBD because the prototype does not specify units.

## BGM
| Field | Proposed Behavior | Proposed Data Type | Cardinality | Required Status |
|---|---|---|---|---|
| 8a | Scalar structured | decimal/number | single time slot | Conditional/TBD |
| 12p | Scalar structured | decimal/number | single time slot | Conditional/TBD |
| 16p | Scalar structured | decimal/number | single time slot | Conditional/TBD |
| Misc | Narrative | text | single | Optional |

The prototype uses fixed display slots. We still need to decide whether the underlying software model should use fixed slots or timestamped glucose measurements and merely render these slots.

## Pain
| Field | Proposed Behavior | Proposed Data Type | Cardinality | Required Status |
|---|---|---|---|---|
| Location | Scalar/composite structured | text/coded value | single/TBD | TBD |
| Type | Scalar/composite structured | text/coded value | single/TBD | TBD |
| 1-10 | Scalar structured | integer 1-10 | single | TBD |

The prototype does not show whether multiple pain assessments should be retained, so cardinality remains a workflow decision.

## Treatment
- Behavior: Narrative.
- Proposed type: multiline text.
- Cardinality: one report-level narrative area.
- Required status: TBD.

## Labs
All named lab fields are discrete structured values in the prototype. Software should keep the numeric/result value separate from display formatting and units if source data eventually provide them.

Fields:
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
- Co2
- Creatinine
- Anion Gap
- BUN
- EGFR
- Ca
- Albumin
- Total Protein
- ALT
- AST
- Total Bili
- Phos
- Mag

Proposed behavior: scalar structured result values for v0.1 display. Whether to retain timestamps, reference ranges, abnormal flags, units, and result history in the normalized model is TBD.

## Decisions We Can Lock In Now
1. IV access is a repeating collection.
2. Skin findings are a repeating collection.
3. IV drips are a repeating collection.
4. `Misc` fields are narrative/freeform.
5. `Treatment` is narrative/freeform.
6. Named labs are structured result fields, not one lab text blob.
7. Conditional therapies/devices should not require fabricated/default values when absent.
8. PMH is a discrete repeating list of history/problem items.
9. Diagnosis is a discrete repeating list of diagnosis items.
10. Allergies is a discrete repeating list of allergy items.

## Clinical / Workflow Decisions Still Needed
1. Exact representation of A/O, PERRLA, GCS/EMV, grips, pedals, pulses, edema, lung findings, abdomen, and urine.
2. Which fields are mandatory for every ICU report vs conditional/optional.
3. Whether BGM should be stored as fixed slots or timestamped readings.
4. Whether Pain is one current assessment or a repeating/time-based set.
5. Which metadata labs should retain beyond the displayed value.
6. Which Epic diagnosis category should populate the report's `Diagnosis` list for the ICU workflow.
