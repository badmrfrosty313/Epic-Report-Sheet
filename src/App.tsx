import fixtureJson from "../Support Sheets/15_MOCK_ICU_FIXTURE.json";
import { buildReportState } from "./selection";
import type {
  FieldProvenance,
  IcuFixture,
  ReportField,
} from "./types";
import "./styles.css";

const fixture = fixtureJson as unknown as IcuFixture;
const report = buildReportState(fixture);

function provenanceLabel(provenance: FieldProvenance): string {
  switch (provenance) {
    case "source":
      return "Source";
    case "derived":
      return "Derived";
    case "report-only":
      return "Report only";
    case "missing":
      return "Missing";
  }
}

function DisplayField({
  label,
  field,
}: {
  label: string;
  field: ReportField<unknown>;
}) {
  const displayValue =
    field.value === null ? field.note ?? "Not documented" : field.value;

  return (
    <div className="field-row">
      <div className="field-label">{label}</div>
      <div className="field-content">
        <div className={field.value === null ? "field-value missing" : "field-value"}>
          {Array.isArray(displayValue)
            ? displayValue.map((item, index) => (
                <div className="field-value-line" key={index}>
                  {String(item)}
                </div>
              ))
            : String(displayValue)}
        </div>
        <div className="field-meta">
          <span className={`badge badge-${field.provenance}`}>
            {provenanceLabel(field.provenance)}
          </span>
          {field.note ? <span>{field.note}</span> : null}
        </div>
        {field.sourceIds.length ? (
          <details className="source-detail">
            <summary>Source IDs</summary>
            <code>{field.sourceIds.join(", ")}</code>
          </details>
        ) : null}
      </div>
    </div>
  );
}

function LungCell({
  label,
  field,
}: {
  label: string;
  field: ReportField<string>;
}) {
  return (
    <div className={`lung-cell ${field.value === null ? "lung-cell-missing" : ""}`}>
      <div className="lung-cell-label">{label}</div>
      <div className="lung-cell-value">
        {field.value ?? field.note ?? "Not documented"}
      </div>
    </div>
  );
}

function LungAssessment() {
  const lungs = [
    ["RUL", report.respiratory.rul],
    ["RML", report.respiratory.rml],
    ["RLL", report.respiratory.rll],
    ["LUL", report.respiratory.lul],
    ["LLL", report.respiratory.lll],
  ] as const;

  return (
    <div className="lung-assessment">
      <div className="lung-assessment-label">Lung sounds</div>
      <div className="lung-assessment-content">
        <div className="lung-side">
          <div className="lung-side-title">Right lung</div>
          <div className="lung-lobes lung-lobes-right">
            <LungCell label="RUL" field={report.respiratory.rul} />
            <LungCell label="RML" field={report.respiratory.rml} />
            <LungCell label="RLL" field={report.respiratory.rll} />
          </div>
        </div>

        <div className="lung-side">
          <div className="lung-side-title">Left lung</div>
          <div className="lung-lobes lung-lobes-left">
            <LungCell label="LUL" field={report.respiratory.lul} />
            <LungCell label="LLL" field={report.respiratory.lll} />
          </div>
        </div>

        <details className="lung-source-detail">
          <summary>Lung source details</summary>
          <div className="lung-source-list">
            {lungs.map(([label, field]) => (
              <div className="lung-source-item" key={label}>
                <strong>{label}</strong>
                <span>{provenanceLabel(field.provenance)}</span>
                {field.note ? <span>{field.note}</span> : null}
                {field.sourceIds.length ? (
                  <code>{field.sourceIds.join(", ")}</code>
                ) : (
                  <span>No source ID</span>
                )}
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}

function LabCell({
  label,
  field,
}: {
  label: string;
  field: ReportField<string>;
}) {
  const flag = field.note?.toUpperCase();

  return (
    <div className="lab-cell">
      <div className="lab-cell-label">{label}</div>
      <div className="lab-cell-reading">
        <span className="lab-cell-value">
          {field.value ?? field.note ?? "Not documented"}
        </span>
        {field.value !== null && flag ? (
          <span className={`lab-cell-flag lab-cell-flag-${flag.toLowerCase()}`}>
            {flag}
          </span>
        ) : null}
      </div>
      {field.sourceIds.length ? (
        <details className="lab-source-detail">
          <summary>Source</summary>
          <code>{field.sourceIds.join(", ")}</code>
        </details>
      ) : null}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="report-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  return (
    <main className="page-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">ICU V0.1 · FICTIONAL MOCK DATA</p>
          <h1>Epic Report Sheet</h1>
          <p className="subhead">
            Source-shaped history → deterministic selection → nurse report
          </p>
        </div>
        <button className="print-button" onClick={() => window.print()}>
          Print / Save PDF
        </button>
      </header>

      <section className="patient-banner">
        <strong>{report.header.location.value ?? "Location unavailable"}</strong>
        <span>{report.header.patientName.value ?? "Patient unavailable"}</span>
        <span>Age {report.header.age.value ?? "?"}</span>
        <span>{report.header.weight.value ?? "Weight unavailable"}</span>
        <strong>{report.header.codeStatus.value ?? "Code status unavailable"}</strong>
      </section>

      <div className="report-columns">
        <div className="report-column">
          <Section title="Header">
            <DisplayField label="Diagnosis" field={report.header.diagnoses} />
            <DisplayField label="PMH" field={report.header.pmh} />
            <DisplayField label="Allergies" field={report.header.allergies} />
          </Section>

          <Section title="Neuro">
            <DisplayField label="A/O" field={report.neuro.orientation} />
            <DisplayField label="Pupils" field={report.neuro.pupils} />
            <DisplayField label="GCS" field={report.neuro.gcs} />
            <DisplayField label="Strength" field={report.neuro.strength} />
            <DisplayField label="NIHSS" field={report.neuro.nihss} />
          </Section>

          <Section title="Cardiac">
            <DisplayField label="Rhythm" field={report.cardiac.rhythm} />
            <DisplayField label="Radial" field={report.cardiac.radial} />
            <DisplayField label="Pedal" field={report.cardiac.pedal} />
            <DisplayField label="Edema" field={report.cardiac.edema} />
          </Section>

          <Section title="Respiratory">
            <DisplayField label="Oxygen" field={report.respiratory.oxygen} />
            <LungAssessment />
            <DisplayField label="Vent" field={report.respiratory.vent} />
          </Section>


          <Section title="Radiology">
            {report.radiology.length ? (
              report.radiology.map((item, index) => (
                <DisplayField
                  key={index}
                  label={`Study ${index + 1}`}
                  field={item}
                />
              ))
            ) : (
              <p className="missing section-message">No radiology results</p>
            )}
          </Section>
        </div>

        <div className="report-column">
          <Section title="GI / Nutrition">
            <DisplayField label="Abdomen" field={report.gi.abdomen} />
            <DisplayField label="Nutrition" field={report.gi.nutrition} />
            <DisplayField label="Enteral access" field={report.gi.enteralAccess} />
          </Section>

          <Section title="GU">
            <DisplayField label="Urine" field={report.gu.urine} />
            <DisplayField label="Device" field={report.gu.device} />
            <DisplayField label="Shift UOP" field={report.gu.shiftUop} />
          </Section>

          <Section title="Lines / Devices / Wounds">
            {report.ldas.map((item, index) => (
              <DisplayField key={index} label={`LDA ${index + 1}`} field={item} />
            ))}
          </Section>

          <Section title="IV Drips">
            {report.drips.length ? (
              report.drips.map((item, index) => (
                <DisplayField key={index} label={`Drip ${index + 1}`} field={item} />
              ))
            ) : (
              <p className="missing section-message">No current drips</p>
            )}
          </Section>

          <Section title="BGM">
            {Object.entries(report.bgm).map(([slot, value]) => (
              <DisplayField key={slot} label={slot} field={value} />
            ))}
          </Section>

          <Section title="Pain">
            <DisplayField label="Current" field={report.pain} />
          </Section>

          <Section title="Treatment / To Do">
            <h3>Source-backed handoff</h3>
            {report.treatment.handoff.map((item, index) => (
              <DisplayField key={index} label={`Handoff ${index + 1}`} field={item} />
            ))}

            <h3>Nursing interventions</h3>
            {report.treatment.interventions.map((item, index) => (
              <DisplayField
                key={index}
                label={`Intervention ${index + 1}`}
                field={item}
              />
            ))}

            <h3>Report-only annotations</h3>
            {report.treatment.annotations.map((item, index) => (
              <DisplayField key={index} label={`Note ${index + 1}`} field={item} />
            ))}
          </Section>
        </div>
      </div>

      <section className="report-section labs-section">
        <h2>Labs</h2>
        <div className="lab-grid">
          {Object.entries(report.labs).map(([name, value]) => (
            <LabCell key={name} label={name} field={value} />
          ))}
        </div>
      </section>

      <footer className="audit-footer">
        <details>
          <summary>Selection audit</summary>
          <p>
            <strong>Excluded historical/invalid IDs:</strong>{" "}
            {report.audit.excludedIds.join(", ")}
          </p>
          <p>
            <strong>Derived keys:</strong>{" "}
            {report.audit.derivedKeys.join(", ")}
          </p>
        </details>
      </footer>
    </main>
  );
}
