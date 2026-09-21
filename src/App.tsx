import { useState } from "react";
import fixtureJson from "../Support Sheets/15_MOCK_ICU_FIXTURE.json";
import stressFixtureJson from "../Support Sheets/18_STRESS_ICU_FIXTURE.json";
import { buildReportState } from "./selection";
import { saveReportPdf } from "./pdfExport";
import type {
  FieldProvenance,
  IcuFixture,
  ReportField,
  TrendDirection,
} from "./types";
import "./styles.css";

const requestedFixture = new URLSearchParams(window.location.search).get("fixture");
const fixtureKey = requestedFixture === "stress" ? "stress" : "standard";
const fixture = (
  fixtureKey === "stress" ? stressFixtureJson : fixtureJson
) as unknown as IcuFixture;
const report = buildReportState(fixture);

type DisplayCase = "sentence" | "title" | "preserve";

const clinicalAcronyms = new Set([
  "A/O",
  "BGM",
  "CVC",
  "DHT",
  "ETT",
  "FiO2",
  "GCS",
  "H/H",
  "HFNC",
  "ICU",
  "IJ",
  "IV",
  "LDA",
  "NIHSS",
  "NG",
  "OG",
  "PICC",
  "PIV",
  "RUE",
  "LUE",
  "RLE",
  "LLE",
  "UOP",
]);

function sentenceCase(value: string): string {
  return value.replace(/[A-Za-z]/, (letter) => letter.toUpperCase());
}

function titleCase(value: string): string {
  return value
    .split(/(\s+|\/|—|-)/)
    .map((part) => {
      if (!part.trim() || ["/", "—", "-"].includes(part)) return part;

      const bare = part.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9:+.%]+$/g, "");
      if (!bare) return part;

      if (
        clinicalAcronyms.has(bare) ||
        /^[A-Z0-9][A-Z0-9.+%]*$/.test(bare) ||
        /^\d/.test(bare)
      ) {
        return part;
      }

      const index = part.indexOf(bare);
      const formatted = bare.charAt(0).toUpperCase() + bare.slice(1);
      return part.slice(0, index) + formatted + part.slice(index + bare.length);
    })
    .join("");
}

function formatDisplayText(value: string, mode: DisplayCase): string {
  if (mode === "preserve") return value;

  const formatter = mode === "title" ? titleCase : sentenceCase;
  return value
    .split("\n")
    .map((line) => formatter(line))
    .join("\n");
}

function formatClock(value?: string): string | null {
  if (!value) return null;
  return value.slice(11, 16);
}

function formatDateTime(value?: string): string | null {
  if (!value) return null;
  return `${value.slice(5, 10).replace("-", "/")} ${value.slice(11, 16)}`;
}

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

function trendSymbol(trend?: TrendDirection): string {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  if (trend === "same") return "→";
  return "";
}

function FieldMeta({ field }: { field: ReportField<unknown> }) {
  const observed = formatClock(field.observedAt);

  return (
    <div className="field-meta">
      <span className={`badge badge-${field.provenance}`}>
        {provenanceLabel(field.provenance)}
      </span>
      {observed ? <span className="time-chip">@ {observed}</span> : null}
      {field.freshness === "pre-shift" ? (
        <span className="freshness-chip">Pre-shift</span>
      ) : null}
      {field.note ? <span>{field.note}</span> : null}
    </div>
  );
}

function DisplayField({
  label,
  field,
  valueCase = "sentence",
}: {
  label: string;
  field: ReportField<unknown>;
  valueCase?: DisplayCase;
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
                  {formatDisplayText(String(item), valueCase)}
                </div>
              ))
            : formatDisplayText(String(displayValue), valueCase)}
        </div>
        <FieldMeta field={field} />
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
        {formatDisplayText(
          field.value ?? field.note ?? "Not documented",
          "sentence",
        )}
      </div>
      {field.observedAt ? (
        <div className="lung-cell-time">
          {formatClock(field.observedAt)}
          {field.freshness === "pre-shift" ? " · pre-shift" : ""}
        </div>
      ) : null}
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
                {field.note ? <span>{field.note}</span> : <span />}
                <code>
                  {field.sourceIds.length
                    ? field.sourceIds.join(", ")
                    : "No source ID"}
                </code>
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
  const flag = field.flag?.toUpperCase();
  const trend = trendSymbol(field.trend);
  const observed = formatClock(field.observedAt);
  const previousObserved = formatClock(field.previousObservedAt);

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

      {field.previousValue && trend ? (
        <div className="lab-trend">
          <strong>{trend}</strong> from {field.previousValue}
          {previousObserved ? ` @ ${previousObserved}` : ""}
        </div>
      ) : null}

      {observed ? (
        <div className="lab-time">
          Current @ {observed}
          {field.freshness === "pre-shift" ? " · pre-shift" : ""}
        </div>
      ) : null}

      {field.sourceIds.length ? (
        <details className="lab-source-detail">
          <summary>Source</summary>
          <code>{field.sourceIds.join(", ")}</code>
        </details>
      ) : null}
    </div>
  );
}

function DripCard({
  field,
  index,
}: {
  field: ReportField<string>;
  index: number;
}) {
  const lines = String(field.value ?? "Not documented").split("\n");
  const medication = lines[0] ?? `Drip ${index + 1}`;
  const details = lines.slice(1);

  return (
    <div className="drip-card">
      <div className="drip-card-title">{titleCase(medication)}</div>
      {details.map((line, lineIndex) => (
        <div className="drip-card-line" key={lineIndex}>
          {sentenceCase(line)}
        </div>
      ))}
      <FieldMeta field={field} />
    </div>
  );
}

function IoSnapshot() {
  const items = [
    ["Intake", report.io.intake],
    ["Output", report.io.output],
    ["Net", report.io.net],
  ] as const;

  return (
    <div className="io-grid">
      {items.map(([label, field]) => (
        <div className="io-cell" key={label}>
          <div className="io-label">{label}</div>
          <div className={field.value === null ? "io-value missing" : "io-value"}>
            {field.value ?? "Not documented"}
          </div>
          {field.observedAt ? (
            <div className="io-time">{formatClock(field.observedAt)}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function TodoZone() {
  if (!report.treatment.todo.length) {
    return <p className="missing section-message">No source To Do items</p>;
  }

  return (
    <div className="todo-zone">
      {report.treatment.todo.map((item, index) => (
        <div className="todo-card" key={index}>
          <div className="todo-marker">TO DO</div>
          <div>
            <div className="todo-text">{item.value}</div>
            <FieldMeta field={item} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`report-section ${className}`.trim()}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}


function RadiologySection() {
  return (
    <Section title="Radiology" className="radiology-section">
      {report.radiology.length ? (
        report.radiology.map((item, index) => (
          <DisplayField
            key={index}
            label={`Study ${index + 1}`}
            field={item}
            valueCase="preserve"
          />
        ))
      ) : (
        <p className="missing section-message">No radiology results</p>
      )}
    </Section>
  );
}

function TreatmentSection() {
  return (
    <Section title="Treatment / To Do" className="treatment-section">
      <h3>Shift To Do</h3>
      <TodoZone />

      {report.treatment.annotations.length ? (
        <>
          <h3>Report Notes</h3>
          {report.treatment.annotations.map((item, index) => (
            <DisplayField
              key={index}
              label={`Note ${index + 1}`}
              field={item}
            />
          ))}
        </>
      ) : null}

      {(report.treatment.handoff.length ||
        report.treatment.interventions.length) ? (
        <details className="secondary-treatment">
          <summary>Other source context</summary>
          {report.treatment.handoff.length ? (
            <>
              <h3>Other Handoff</h3>
              {report.treatment.handoff.map((item, index) => (
                <DisplayField
                  key={index}
                  label={`Handoff ${index + 1}`}
                  field={item}
                />
              ))}
            </>
          ) : null}
          {report.treatment.interventions.length ? (
            <>
              <h3>Nursing Interventions</h3>
              {report.treatment.interventions.map((item, index) => (
                <DisplayField
                  key={index}
                  label={`Intervention ${index + 1}`}
                  field={item}
                />
              ))}
            </>
          ) : null}
        </details>
      ) : null}
    </Section>
  );
}

function LabsSection() {
  return (
    <section className="report-section labs-section">
      <h2>Labs</h2>
      <div className="lab-grid">
        {Object.entries(report.labs).map(([name, value]) => (
          <LabCell key={name} label={name} field={value} />
        ))}
      </div>
    </section>
  );
}

function PrimaryClinicalColumn({
  includeRadiology,
}: {
  includeRadiology: boolean;
}) {
  return (
    <>
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

      {includeRadiology ? <RadiologySection /> : null}
    </>
  );
}

function SecondaryClinicalColumn({
  includeTreatment,
}: {
  includeTreatment: boolean;
}) {
  return (
    <>
      <Section title="GI / Nutrition">
        <DisplayField label="Abdomen" field={report.gi.abdomen} />
        <DisplayField label="Nutrition" field={report.gi.nutrition} />
        <DisplayField
          label="Enteral access"
          field={report.gi.enteralAccess}
          valueCase="title"
        />
      </Section>

      <Section title="GU">
        <DisplayField label="Urine" field={report.gu.urine} />
        <DisplayField
          label="Device"
          field={report.gu.device}
          valueCase="title"
        />
        <DisplayField label="Shift UOP" field={report.gu.shiftUop} />
      </Section>

      <Section title="I/O Snapshot" className="io-section">
        <IoSnapshot />
      </Section>

      <Section title="Lines / Devices / Wounds" className="lines-section">
        <div className="lda-grid">
          {report.ldas.map((item, index) => (
            <DisplayField
              key={index}
              label={`LDA ${index + 1}`}
              field={item}
              valueCase="title"
            />
          ))}
        </div>
      </Section>

      <Section title="IV Drips" className="drips-section">
        {report.drips.length ? (
          <div className="drip-grid">
            {report.drips.map((item, index) => (
              <DripCard key={index} field={item} index={index} />
            ))}
          </div>
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

      {includeTreatment ? <TreatmentSection /> : null}
    </>
  );
}

export default function App() {
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  async function handleSavePdf() {
    const element = document.getElementById("report-sheet");
    if (!element || isExportingPdf) return;

    setIsExportingPdf(true);
    try {
      await saveReportPdf(
        element,
        `epic-report-sheet-${fixtureKey}-portrait.pdf`,
      );
    } finally {
      setIsExportingPdf(false);
    }
  }

  return (
    <main
      id="report-sheet"
      className={`page-shell fixture-${fixtureKey}`}
    >
      <header className="app-header">
        <div>
          <p className="eyebrow">
            ICU V0.1 · FICTIONAL MOCK DATA · {fixtureKey.toUpperCase()} FIXTURE
          </p>
          <h1>Epic Report Sheet</h1>
          <p className="subhead">
            Source-shaped history → deterministic selection → nurse report
          </p>
        </div>

        <div className="header-actions">
          <nav className="fixture-switcher" aria-label="Mock fixture">
            <a
              className={fixtureKey === "standard" ? "active" : ""}
              href="?fixture=standard"
            >
              Standard
            </a>
            <a
              className={fixtureKey === "stress" ? "active" : ""}
              href="?fixture=stress"
            >
              Stress Test
            </a>
          </nav>
          <button
            className="print-button"
            onClick={handleSavePdf}
            disabled={isExportingPdf}
          >
            {isExportingPdf ? "Building PDF..." : "Save Portrait PDF"}
          </button>
          <button className="print-button" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </header>

      <section className="patient-banner">
        <strong>{report.header.location.value ?? "Location unavailable"}</strong>
        <span>{report.header.patientName.value ?? "Patient unavailable"}</span>
        <span>Age {report.header.age.value ?? "?"}</span>
        <span>{report.header.weight.value ?? "Weight unavailable"}</span>
        <strong>{report.header.codeStatus.value ?? "Code status unavailable"}</strong>
      </section>

      <div className="report-columns screen-report-columns">
        <div className="report-column">
          <PrimaryClinicalColumn includeRadiology={true} />
        </div>

        <div className="report-column">
          <SecondaryClinicalColumn includeTreatment={true} />
        </div>
      </div>

      <div className="print-only-output output-page-one">
        <div className="output-page-one-grid">
          <div className="output-column">
            <PrimaryClinicalColumn includeRadiology={false} />
          </div>
          <div className="output-column">
            <SecondaryClinicalColumn includeTreatment={false} />
          </div>
        </div>
      </div>

      <div className="screen-only">
        <LabsSection />
      </div>

      <div className="print-only-output output-page-two">
        <LabsSection />
        <div className="output-page-two-lower">
          <RadiologySection />
          <TreatmentSection />
        </div>
      </div>

      <footer className="audit-footer">
        <details>
          <summary>Selection audit</summary>
          <p>
            <strong>Fixture:</strong> {fixture.fixture_name}
          </p>
          <p>
            <strong>Report time:</strong> {formatDateTime(report.reportTime)}
          </p>
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
