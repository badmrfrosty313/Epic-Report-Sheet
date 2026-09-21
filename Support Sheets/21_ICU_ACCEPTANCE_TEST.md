# ICU Acceptance Scenario

Date: 2026-09-20  
Fixture: `20_ICU_ACCEPTANCE_FIXTURE.json`  
Automated test: `tests/icuAcceptance.test.ts`

## Purpose

The user did not have enough detail from prior real patients to reconstruct a trustworthy historical shift. Instead of inventing a pseudo-memory, this acceptance test uses a **fully synthetic but clinically coherent ICU handoff scenario** designed to exercise the current report as a nurse-facing workflow artifact.

No real patient data are used.

## Scenario

A 66-year-old ICU patient with:

- septic shock due to multifocal pneumonia
- acute hypoxemic respiratory failure
- acute kidney injury
- mechanical ventilation
- norepinephrine + vasopressin
- propofol + fentanyl
- right IJ CVC
- left radial arterial line
- Foley
- ETT
- enteral feeding tube
- pressure injury
- positive shift fluid balance
- lab abnormalities with meaningful prior values
- current chest radiograph
- source-backed shift To Do items
- intentionally missing Orientation and NIHSS
- deliberately entered-in-error potassium and radiology records used as traps

The acceptance test asks whether the generated report preserves the **clinical story** without fabricating missing data or selecting invalid newer records.

## Acceptance Contract

The report must:

1. Surface identity, room, age, code status, and all active encounter diagnoses.
2. Preserve missing Orientation and NIHSS as missing.
3. Display GCS 10 from source components.
4. Show mechanical ventilation with FiO2 60%, AC/VC, tidal volume 420 mL, PEEP 10 cmH2O, and rate 22.
5. Preserve lung findings including side-level inheritance and lobe-specific override.
6. Show all four current infusions:
   - norepinephrine 0.08 mcg/kg/min
   - vasopressin 0.03 units/min
   - propofol 20 mcg/kg/min
   - fentanyl 75 mcg/hr
7. Exclude the completed older norepinephrine administration.
8. Preserve the active invasive-device picture, including the arterial line.
9. Calculate shift UOP separately from total I/O.
10. Produce Intake 1250 mL, Output 700 mL, Net +550 mL.
11. Show numeric lab direction from the immediately prior valid result:
    - WBC 18.4 HIGH, down from 22.1
    - potassium 3.3 LOW, down from 4.0
    - creatinine 2.4 HIGH, up from 1.8
    - lactate 2.8 HIGH, down from 5.2
12. Reject the newer entered-in-error potassium of 7.1 mmol/L.
13. Reject the newer entered-in-error clear-lungs radiology report.
14. Show the valid multifocal-pneumonia chest-radiograph impression.
15. Promote the source-backed shift To Do:
    - repeat lactate at 20:00
    - recheck potassium after replacement
    - titrate norepinephrine to ordered MAP goal
    - turn/reposition at 20:00
16. Keep the family-update note labeled report-only.
17. Preserve source timing and only use the current v0.1 freshness distinction of this-shift vs pre-shift.
18. Produce a coherent major-domain report without losing active LDAs, drips, labs, imaging, or To Do content.

## Result

**PASS**

GitHub Actions CI run **#94** completed successfully.

Automated output:

```text
selection.test.ts      18 passed
icuAcceptance.test.ts  11 passed

Test Files             2 passed
Tests                  29 passed
Production build       passed
```

The new acceptance suite itself contains **11 scenario-level tests**. It passed without changing the selection engine to accommodate the scenario.

## What This Proves

This is stronger than another feature-by-feature fixture check. A fresh coherent ICU story was fed into the existing normalized model and report engine, and the report correctly surfaced the expected bedside state, trends, active therapies, devices, results, tasks, missing data, and invalid-source exclusions.

It does **not** prove:
- clinical deployment safety
- universal Epic mapping
- usability at every organization
- replacement for human nurse review

Those require real deployment context and/or real end-user validation.

## v0.1 Interpretation

For the current mock/source-shaped scope, the acceptance scenario supports the claim that:

> A realistic ICU source-shaped patient/encounter can go in and a coherent nurse handoff report can come out without inventing absent clinical data.

That satisfies the functional half of the current v0.1 finish line. Print/browser appearance remains a separate human visual acceptance step.
