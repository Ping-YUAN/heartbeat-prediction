import { useEffect, useMemo, useState } from 'react';

import {
  analyzePatient,
  getHealth,
  getPatient,
  listReferenceSignals,
  listPatients,
} from '../lib/api';
import { patientLabel } from '../lib/labels';
import type {
  AnalysisResult,
  PatientDetail,
  PatientSummary,
  ReferenceSignal,
} from '../types';

export function useHeartbeatWorkbench() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [referenceSignals, setReferenceSignals] = useState<ReferenceSignal[]>([]);
  const [selectedReferenceId, setSelectedReferenceId] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [detail, setDetail] = useState<PatientDetail | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [query, setQuery] = useState('');
  const [modelStatus, setModelStatus] = useState('checking');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [health, patientList, references] = await Promise.all([
          getHealth(),
          listPatients(),
          listReferenceSignals(),
        ]);
        setModelStatus(health.model_status);
        setPatients(patientList);
        setReferenceSignals(references);
        setSelectedId(patientList[0]?.id ?? '');
      } catch {
        setError('Unable to reach the ECG analysis API.');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    async function loadPatientDetail() {
      try {
        setError('');
        setDetail(await getPatient(selectedId));
        setAnalysis(null);
      } catch {
        setError('Unable to load the selected patient sample.');
      }
    }
    loadPatientDetail();
  }, [selectedId]);

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return patients;
    return patients.filter((patient) =>
      `${patient.id} ${patient.source} ${patientLabel(patient.label)}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [patients, query]);

  const metrics = analysis?.metrics ?? detail?.metrics;
  const selectedReference =
    referenceSignals.find((reference) => reference.id === selectedReferenceId) ?? null;

  async function runAnalysis() {
    if (!detail) return;
    setAnalyzing(true);
    setError('');
    try {
      setAnalysis(await analyzePatient(detail));
    } catch {
      setError('The model analysis request failed.');
    } finally {
      setAnalyzing(false);
    }
  }

  return {
    analysis,
    analyzing,
    detail,
    error,
    filteredPatients,
    loading,
    metrics,
    modelStatus,
    query,
    referenceSignals,
    runAnalysis,
    selectedId,
    selectedReference,
    selectedReferenceId,
    setQuery,
    setSelectedId,
    setSelectedReferenceId,
  };
}
