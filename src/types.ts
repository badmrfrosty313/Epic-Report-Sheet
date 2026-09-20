export interface ClinicalCode {
  system?: string;
  code?: string;
  display?: string;
  text?: string;
}

export interface Availability {
  state: string;
  source_reason?: string;
}

export interface Period {
  start?: string | null;
  end?: string | null;
}

export interface QuantityValue {
  value: number;
  unit?: string;
  system?: string;
  code?: string;
}

export interface ObservationRecord {
  id: string;
  source_ref: string;
  domain: string;
  code: ClinicalCode;
  status?: string;
  value?: unknown;
  effective_time?: string | null;
  effective_period?: Period | null;
  body_site?: string;
  laterality?: string;
  scope?: string;
  encounter_ref?: string;
  panel_parent_id?: string;
  availability?: Availability;
}

export interface LabResultRecord {
  id: string;
  source_ref: string;
  patient_ref: string;
  encounter_ref?: string;
  code: ClinicalCode;
  status?: string;
  value?: unknown;
  effective_time?: string | null;
  issued_time?: string | null;
  interpretation_codes?: string[];
  availability?: Availability;
}

export interface LdaRecord {
  id: string;
  source_refs: string[];
  type_code: ClinicalCode;
  display?: string;
  status?: string;
  patient_ref: string;
  encounter_ref?: string;
  site?: string;
  laterality?: string;
  placement_time?: string;
  effective_period?: Period;
  properties?: Array<{
    code: ClinicalCode;
    value: unknown;
    source_ref: string;
  }>;
  availability?: Availability;
}

export interface NutritionOrderRecord {
  id: string;
  source_ref: string;
  status?: string;
  patient_ref: string;
  encounter_ref?: string;
  ordered_at?: string;
  oral_diet?: Record<string, unknown>;
  enteral_feeding?: {
    base_formula?: string;
    route?: string;
    administration_instructions?: string[];
    schedule?: string;
  };
  availability?: Availability;
}

export interface MedicationAdministrationRecord {
  id: string;
  source_ref: string;
  status?: string;
  medication_code?: ClinicalCode;
  order_ref?: string;
  patient_ref: string;
  encounter_ref?: string;
  effective_time?: string;
  effective_period?: Period;
  route?: string;
  rate?: QuantityValue;
  device_refs?: string[];
  availability?: Availability;
}

export interface HandoffFieldRecord {
  id: string;
  source_ref: string;
  encounter_ref?: string;
  patient_ref: string;
  purpose?: string;
  title?: string;
  status?: string;
  authored_at?: string;
  content_text?: string;
  availability?: Availability;
}

export interface NursingInterventionRecord {
  id: string;
  source_ref: string;
  patient_ref: string;
  encounter_ref?: string;
  status?: string;
  code: ClinicalCode;
  performed_time?: string;
  body_sites?: string[];
  availability?: Availability;
}

export interface ManualReportAnnotation {
  id: string;
  report_context_id: string;
  section_key?: string;
  text: string;
  created_at: string;
  source_label: "report-only";
}

export interface BgmSlotConfig {
  key: string;
  target_time: string;
  window_start: string;
  window_end: string;
}

export interface IcuFixture {
  schema_version: string;
  fixture_id: string;
  fixture_name: string;
  generated_at: string;
  report_config: {
    report_time: string;
    shift_start: string;
    shift_end: string;
    bgm_slots: BgmSlotConfig[];
  };
  patient: {
    id: string;
    display_name?: string;
    birth_date?: string;
    availability?: Availability;
  };
  encounter: {
    id: string;
    status?: string;
    period?: Period;
    current_location?: {
      source_ref?: string;
      display?: string;
      status?: string;
    };
    location_history?: Array<{
      source_ref?: string;
      display?: string;
      period?: Period;
      status?: string;
    }>;
    availability?: Availability;
  };
  code_status: Array<{
    id: string;
    source_ref: string;
    status?: string;
    display?: string;
    effective_period?: Period;
    availability?: Availability;
  }>;
  medical_history: Array<{
    id: string;
    source_ref: string;
    code: ClinicalCode;
    clinical_status?: string;
    availability?: Availability;
  }>;
  encounter_diagnoses: Array<{
    id: string;
    source_ref: string;
    code: ClinicalCode;
    clinical_status?: string;
    encounter_ref?: string;
    availability?: Availability;
  }>;
  allergies: Array<{
    id: string;
    source_ref: string;
    substance: ClinicalCode;
    clinical_status?: string;
    criticality?: string;
    reactions?: Array<{
      manifestations?: ClinicalCode[];
      severity?: string;
    }>;
    availability?: Availability;
  }>;
  observations: ObservationRecord[];
  ldas: LdaRecord[];
  nutrition_orders: NutritionOrderRecord[];
  medication_administrations: MedicationAdministrationRecord[];
  lab_results: LabResultRecord[];
  handoff_fields: HandoffFieldRecord[];
  nursing_interventions: NursingInterventionRecord[];
  manual_report_annotations: ManualReportAnnotation[];
}

export type FieldProvenance = "source" | "derived" | "missing" | "report-only";

export interface ReportField<T> {
  value: T | null;
  provenance: FieldProvenance;
  sourceIds: string[];
  note?: string;
}

export interface ReportState {
  reportTime: string;
  header: {
    location: ReportField<string>;
    patientName: ReportField<string>;
    age: ReportField<number>;
    weight: ReportField<string>;
    codeStatus: ReportField<string>;
    diagnoses: ReportField<string[]>;
    pmh: ReportField<string[]>;
    allergies: ReportField<string[]>;
  };
  neuro: {
    orientation: ReportField<string>;
    pupils: ReportField<string>;
    gcs: ReportField<string>;
    strength: ReportField<string>;
    nihss: ReportField<string>;
  };
  cardiac: {
    rhythm: ReportField<string>;
    radial: ReportField<string>;
    pedal: ReportField<string>;
    edema: ReportField<string>;
  };
  respiratory: {
    oxygen: ReportField<string>;
    rul: ReportField<string>;
    rml: ReportField<string>;
    rll: ReportField<string>;
    lul: ReportField<string>;
    lll: ReportField<string>;
    vent: ReportField<string>;
  };
  gi: {
    abdomen: ReportField<string>;
    nutrition: ReportField<string>;
    enteralAccess: ReportField<string>;
  };
  gu: {
    urine: ReportField<string>;
    device: ReportField<string>;
    shiftUop: ReportField<string>;
  };
  ldas: ReportField<string>[];
  drips: ReportField<string>[];
  bgm: Record<string, ReportField<string>>;
  pain: ReportField<string>;
  labs: Record<string, ReportField<string>>;
  treatment: {
    handoff: ReportField<string>[];
    interventions: ReportField<string>[];
    annotations: ReportField<string>[];
  };
  audit: {
    excludedIds: string[];
    derivedKeys: string[];
  };
}
