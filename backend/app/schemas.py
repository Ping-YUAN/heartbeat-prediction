from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    patient_id: str | None = None
    signal: list[float] = Field(min_length=8)


class Metrics(BaseModel):
    sample_count: int
    sample_rate_hz: int
    duration_seconds: float
    peak_count: int
    estimated_bpm: int
    mean_amplitude: float
    min_amplitude: float
    max_amplitude: float
    amplitude_range: float
    mean_rr_ms: float
    peak_indexes: list[int]
    peak_values: list[float]


class Prediction(BaseModel):
    label: Literal["normal", "abnormal"]
    confidence: float
    abnormal_probability: float
    model_status: str
    method: str


class PatientSummary(BaseModel):
    id: str
    source: str
    row_index: int
    label: int | None
    sample_count: int


class PatientDetail(PatientSummary):
    signal: list[float]
    normal_template: list[float] | None
    metrics: Metrics


class ReferenceSignal(BaseModel):
    id: str
    label: int
    name: str
    dataset: str
    kind: Literal["normal", "abnormal"]
    source_count: int
    signal: list[float]


class AnalysisResponse(BaseModel):
    patient_id: str | None
    prediction: Prediction
    metrics: Metrics


class HealthResponse(BaseModel):
    status: str
    model_status: str
    model_path: str
    sample_data_dir: str
