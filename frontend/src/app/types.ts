export type PatientSummary = {
  id: string;
  source: string;
  row_index: number;
  label: number | null;
  sample_count: number;
};

export type Metrics = {
  sample_count: number;
  sample_rate_hz: number;
  duration_seconds: number;
  peak_count: number;
  estimated_bpm: number;
  mean_amplitude: number;
  min_amplitude: number;
  max_amplitude: number;
  amplitude_range: number;
  mean_rr_ms: number;
  peak_indexes: number[];
  peak_values: number[];
};

export type PatientDetail = PatientSummary & {
  signal: number[];
  normal_template: number[] | null;
  metrics: Metrics;
};

export type ReferenceSignal = {
  id: string;
  label: number;
  name: string;
  dataset: string;
  kind: 'normal' | 'abnormal';
  source_count: number;
  signal: number[];
};

export type AnalysisResult = {
  patient_id: string | null;
  prediction: {
    label: 'normal' | 'abnormal';
    confidence: number;
    abnormal_probability: number;
    model_status: string;
    method: string;
  };
  metrics: Metrics;
};

export type HealthResponse = {
  status: string;
  model_status: string;
  model_path: string;
  sample_data_dir: string;
};
