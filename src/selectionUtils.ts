import type {
  IcuFixture,
  LabResultRecord,
  ObservationRecord,
  Period,
  QuantityValue,
  ReportField,
  TrendDirection,
} from "./types";

const unusable = new Set(["entered-in-error", "cancelled", "invalid"]);

export const time = (value?: string | null) =>
  value ? Date.parse(value) : Number.NEGATIVE_INFINITY;

export const usableStatus = (status?: string) =>
  !status || !unusable.has(status);

export const present = (availability?: { state: string }) =>
  !availability || availability.state === "present";

export function field<T>(
  value: T | null,
  provenance: ReportField<T>["provenance"],
  sourceIds: string[] = [],
  note?: string,
  meta: Partial<Omit<ReportField<T>, "value" | "provenance" | "sourceIds" | "note">> = {},
): ReportField<T> {
  return { value, provenance, sourceIds, note, ...meta };
}

export const missing = <T>(note: string): ReportField<T> =>
  field<T>(null, "missing", [], note);

export function inPeriod(period: Period | undefined, at: string) {
  return (
    (!period?.start || time(period.start) <= time(at)) &&
    (!period?.end || time(period.end) >= time(at))
  );
}

export function valueText(value: unknown): string {
  if (
    value &&
    typeof value === "object" &&
    "value" in value &&
    typeof (value as { value: unknown }).value === "number"
  ) {
    const quantity = value as QuantityValue;
    return `${quantity.value}${quantity.unit ? ` ${quantity.unit}` : ""}`;
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  return value ? JSON.stringify(value) : "";
}

export function latest<T>(
  items: T[],
  getTime: (item: T) => string | null | undefined,
): T | null {
  return [...items].sort(
    (a, b) => time(getTime(b)) - time(getTime(a)),
  )[0] ?? null;
}

export function observations(
  fixture: IcuFixture,
  code: string,
  predicate: (obs: ObservationRecord) => boolean = () => true,
) {
  return fixture.observations.filter(
    (obs) =>
      obs.code.code === code &&
      obs.encounter_ref === fixture.encounter.id &&
      usableStatus(obs.status) &&
      present(obs.availability) &&
      time(obs.effective_time) <= time(fixture.report_config.report_time) &&
      predicate(obs),
  );
}

export function oneObservation(
  fixture: IcuFixture,
  code: string,
  predicate?: (obs: ObservationRecord) => boolean,
) {
  return latest(
    observations(fixture, code, predicate),
    (obs) => obs.effective_time,
  );
}

export function calculateAge(birthDate: string, reportTime: string) {
  const [birthYear, birthMonth, birthDay] = birthDate.split("-").map(Number);
  const [reportYear, reportMonth, reportDay] = reportTime
    .slice(0, 10)
    .split("-")
    .map(Number);

  return (
    reportYear -
    birthYear -
    (reportMonth < birthMonth ||
    (reportMonth === birthMonth && reportDay < birthDay)
      ? 1
      : 0)
  );
}

export function latestLab(fixture: IcuFixture, code: string): LabResultRecord | null {
  return latest(
    fixture.lab_results.filter(
      (lab) =>
        lab.code.code === code &&
        lab.encounter_ref === fixture.encounter.id &&
        lab.status === "final" &&
        usableStatus(lab.status) &&
        present(lab.availability) &&
        time(lab.effective_time) <= time(fixture.report_config.report_time),
    ),
    (lab) => lab.effective_time,
  );
}


export function numericValue(value: unknown): number | null {
  if (typeof value === "number") return value;

  if (
    value &&
    typeof value === "object" &&
    "value" in value &&
    typeof (value as { value?: unknown }).value === "number"
  ) {
    return (value as { value: number }).value;
  }

  return null;
}

export function trendDirection(
  current: unknown,
  previous: unknown,
): TrendDirection | undefined {
  const currentNumber = numericValue(current);
  const previousNumber = numericValue(previous);

  if (currentNumber === null || previousNumber === null) return undefined;
  if (currentNumber > previousNumber) return "up";
  if (currentNumber < previousNumber) return "down";
  return "same";
}
