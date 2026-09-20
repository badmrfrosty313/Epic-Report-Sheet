# ICU Field Behavior Classification

Source: `10_ICU_FIELD_INVENTORY.md`, transcribed from `Report Sheet V.2 ICU - Prototype.pdf`.

This file separates what can be inferred safely from the prototype's layout from decisions that still require clinical/workflow confirmation. `TBD` means the prototype does not provide enough information to decide without inventing behavior.

## Checkpoint Status
- Field inventory: complete.
- Header modeling: partially resolved.
- Neuro modeling: resolved for the current v0.1 specification.
- **Resume next at Cardiac.**
- Project paused 2026-09-17 while two newly available WGU classes take priority.

## Classification Key
- **Scalar structured**: one discrete value for the patient/report.
- **Repeating structured**: zero or more records sharing the same fields.
- **Narrative**: freeform text.
- **Composite structured**: multiple related source values represented together.
- **Conditional**: relevant only when the corresponding therapy/device/condition applies.
- **Derived**: calculated/summarized from preserved source fields and never used to overwrite them.

## Governing Rule
Preserve clinically relevant source values and useful provenance that can legitimately be pulled from the approved Epic/EHR source. Normalization may reorganize those facts but must not silently reinterpret them. Derived values/display shorthand remain separate. Missing source data remain missing rather than being defaulted to normal.

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
| Field | Behavior | Data Shape | Cardinality | Required Status |
|---|---|---|---|---|
| A/O | Composite structured | final orientation level + explicit deficit list when abnormal | single | TBD |
| PERRLA - Right | Composite structured | pupil size mm + reaction | single | TBD |
| PERRLA - Left | Composite structured | pupil size mm + reaction | single | TBD |
| GCS/EMV | Composite structured | Eye + Verbal + Motor + total | single assessment/current display | TBD |
| NIH | Composite structured | full NIHSS item breakdown + total | conditional/current assessment | Conditional/TBD |
| Grips - RUE | Scalar structured | documented strength grade | single | TBD |
| Grips - LUE | Scalar structured | documented strength grade | single | TBD |
| Pedals - RLE | Scalar structured | documented strength grade | single | TBD |
| Pedals - LLE | Scalar structured | documented strength grade | single | TBD |
| Misc | Narrative | text | single | Optional |

### Neuro Display / Derivation Rules
- A/O displays compactly as `A/O x4`; if below x4, include the specific disoriented domain(s).
- Pupil equality/symmetry is derived from right/left source values; the bilateral source data remain intact.
- GCS may display as `GCS 15 (E4 V5 M6)` while preserving component and total source values.
- NIHSS shows total by default in the primary report; the interactive UI may expand to the full item-level assessment.
- Extremity strength remains side-specific and limb-specific. Missing strength grades are not assumed normal.

## Cardiac
| Field | Behavior | Data Shape | Cardinality | Required Status |
|---|---|---|---|---|
| Rhythm | Source-preserved structured observation | source value/display/code plus available timestamp/status/provenance | current display from one or more source observations | TBD |
| Pulses - Radial | Repeating structured pulse findings | site + laterality + source-documented quality/grade/value + available metadata | zero or more | TBD |
| Pulses - Pedal | Repeating structured pulse findings | site + laterality + source-documented quality/grade/value + available metadata | zero or more | TBD |
| Edema | Repeating structured findings | location + laterality + source grade/type/value + available metadata | zero or more | TBD |
| Misc | Narrative | text | single | Optional |

### Cardiac Modeling Decision
- Preserve the source-documented rhythm and any clinically relevant source metadata rather than reducing it to a hand-entered label.
- Model pulses as **repeating site-specific findings**, not only four hard-coded software fields. This preserves right/left radial findings while allowing more specific pedal sites if the approved EHR source provides them.
- The ICU template can still render compact `Radial` and `Pedal` rows by grouping the richer source findings.
- Model edema as a repeating structured collection. Preserve source-provided location/laterality, grade, pitting/non-pitting/type, value/display text, timestamp, and useful provenance when available.
- Missing pulse or edema findings remain missing; no normal values are inferred.
- Interactive detail may expose richer source values while the primary report remains compact.

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

Exact rate representation is TBD because the prototype does not specify units. When source data provide units/timestamps/status, preserve them.

## BGM
| Field | Proposed Behavior | Proposed Data Type | Cardinality | Required Status |
|---|---|---|---|---|
| 8a | Scalar structured | decimal/number | single display slot | Conditional/TBD |
| 12p | Scalar structured | decimal/number | single display slot | Conditional/TBD |
| 16p | Scalar structured | decimal/number | single display slot | Conditional/TBD |
| Misc | Narrative | text | single | Optional |

The prototype uses fixed display slots. We still need to decide whether the underlying software model stores timestamped glucose measurements and merely renders the appropriate display slots.

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
All named lab fields are discrete structured values in the prototype. Software should preserve result values and any available source units/timestamps/status/flags/reference information separately from report formatting.

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

## Decisions Locked So Far
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
11. A/O stores final orientation level plus specific deficits when abnormal.
12. Pupils preserve bilateral size/reaction; equality is derived.
13. GCS preserves E/V/M plus total.
14. NIHSS preserves item-level detail plus total and is expandable in the digital UI.
15. Extremity strength preserves RUE/LUE/RLE/LLE documented grades separately.
16. Source facts are preserved; derived values remain separate; missing data are never defaulted to normal.

## Clinical / Workflow Decisions Still Needed
1. Exact representation of respiratory oxygen/FiO2 and lung findings.
2. Exact representation of abdomen and urine.
3. Which fields are mandatory for every ICU report vs conditional/optional.
4. Whether BGM should be stored as timestamped readings beneath fixed display slots.
5. Whether Pain is one current assessment or a repeating/time-based set.
6. Which metadata labs should retain beyond what the approved source provides and what the report needs to display.
7. Which Epic diagnosis category should populate the report's `Diagnosis` list for the ICU workflow.

## Resume Pin
**Next action: Respiratory -> confirm Oxygen/LPM/Percentage semantics and model lung findings while preserving source detail.** Cardiac is resolved for the current v0.1 classification pass.