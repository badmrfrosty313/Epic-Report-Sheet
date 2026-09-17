# ICU Prototype Field Inventory

Source artifact: `Support Sheets/Report Sheet V.2 ICU - Prototype.pdf`

This inventory is a transcription of the fields visibly present in the two-page ICU prototype. It is intentionally descriptive. Required/optional status, Epic source locations, value constraints, and final software data types are separate follow-up decisions unless the layout itself clearly implies repetition or freeform entry.

## Page 1

### Patient / Header
- Room Number
- PMH
- Patient Name
- Age
- Wt
- Code
- Diagnosis
- Allergies

### Neuro
- A/O
- PERRLA - Right
- PERRLA - Left
- GCS/EMV
- NIH
- Grips - RUE
- Grips - LUE
- Pedals - RLE
- Pedals - LLE
- Misc

### Cardiac
- Rhythm
- Pulses - Radial
- Pulses - Pedal
- Edema
- Misc

### Respiratory
- Oxygen
- LPM
- Percentage
- Vent - Mode
- Vent - Tidal Volume
- Vent - PEEP
- Vent - Rate
- Lungs - RUL
- Lungs - LUL
- Lungs - RML
- Lungs - RLL
- Lungs - LLL
- Misc

### GI
- Abdomen
- Diet
- Tube Feeds
- Rate
- FWF
- DHT
- NG/OG Tube
- Misc

### GU
- Urine
- Foley
- Purewick
- Voids
- UOP
- Misc

### IV Access
The prototype shows four numbered IV rows with the same columns, so this is visibly a repeating structure.

Per IV row:
- Type
- Location
- Site
- Blood Return

Additional:
- Misc

### Skin
The prototype provides a section with the following columns and open space for multiple entries, so this is visibly a repeating structure.

Per skin entry:
- Location
- Type
- Treatment

### IV Drips
The prototype provides repeated-entry space with these columns.

Per drip entry:
- Medication
- Rate

### BGM
- 8a
- 12p
- 16p
- Misc

### Pain
- Location
- Type
- 1-10

## Page 2

### Treatment
- Treatment freeform area

### Labs

#### CBC / Coagulation column
- WBC
- RBC
- H/H
- Platelets
- PT
- INR
- PTT

#### Chemistry / Renal column
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

#### Liver / Electrolyte column
- ALT
- AST
- Total Bili
- Phos
- Mag

## Structural Observations From the Prototype
These observations come from the visual structure of the prototype itself, not from an Epic data-source assumption.

- The report is organized primarily by body system plus devices/therapies.
- `IV Access`, `Skin`, and `IV Drips` are clearly intended to support multiple entries.
- `Misc` appears repeatedly as a catch-all narrative field inside several systems.
- `Treatment` on page 2 is a large narrative/freeform area rather than a predefined set of discrete fields.
- Labs are presented as discrete named values rather than a freeform lab narrative.
- BGM is laid out around fixed time slots in the prototype: 8a, 12p, and 16p.

## Next Step
For every field above, classify:
1. Proposed software data type.
2. Single value vs repeating collection.
3. Structured vs freeform.
4. Required, optional, or conditional for the first ICU workflow.
5. Conceptual Epic/EHR source, once the field behavior is agreed upon.

Do not silently infer clinical defaults or manufacture values for missing data.
