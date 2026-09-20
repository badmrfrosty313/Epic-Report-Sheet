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
  const value =
    field.value === null
      ? field.note ?? "Not documented"
      : Array.isArray(field.value)
        ? field.value.join("; ")
        : String(field.value);

  return (
    <div className="field-row">
      <div className="field-label">{label}</div>
      <div className="field-content">
        <div className={field.value === null ? "field-value missing" : "field-value"}>
          {value}
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

      <div className="report-grid">
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
          <div className="five-column">
            <DisplayField label="RUL" field={report.respiratory.rul} />
            <DisplayField label="RML" field={report.respiratory.rml} />
            <DisplayField label="RLL" field={report.respiratory.rll} />
            <DisplayField label="LUL" field={report.respiratory.lul} />
            <DisplayField label="LLL" field={report.respiratory.lll} />
          </div>
          <DisplayField label="Vent" field={report.respiratory.vent} />
        </Section>

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
            <p className="missing">No current drips</p>
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

        <Section title="Labs">
          {Object.entries(report.labs).map(([name, value]) => (
            <DisplayField key={name} label={name} field={value} />
          ))}
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
