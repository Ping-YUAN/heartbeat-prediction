import type {
  AnalysisResult,
  HealthResponse,
  PatientDetail,
  PatientSummary,
  ReferenceSignal,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function getHealth() {
  return requestJson<HealthResponse>('/api/health');
}

export function listPatients() {
  return requestJson<PatientSummary[]>('/api/patients');
}

export function getPatient(patientId: string) {
  return requestJson<PatientDetail>(`/api/patients/${patientId}`);
}

export function listReferenceSignals() {
  return requestJson<ReferenceSignal[]>('/api/reference-signals');
}

export function analyzePatient(patient: PatientDetail) {
  return requestJson<AnalysisResult>('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_id: patient.id, signal: patient.signal }),
  });
}
