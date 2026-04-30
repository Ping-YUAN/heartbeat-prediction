from __future__ import annotations

import statistics

import numpy as np

from app.config import MIT_MODEL_INPUT_LENGTH, R_PEAK_CENTER_INDEX
from app.domain import PatientRecord
from app.schemas import Metrics


def find_peaks(signal: list[float]) -> list[int]:
    if len(signal) < 3:
        return []
    signal_range = max(signal) - min(signal)
    threshold = min(signal) + signal_range * 0.45
    return [
        index
        for index in range(1, len(signal) - 1)
        if signal[index] > signal[index - 1]
        and signal[index] >= signal[index + 1]
        and signal[index] >= threshold
    ]


def align_peak(signal: list[float]) -> list[float]:
    peaks = [index for index in find_peaks(signal) if 6 <= index <= 160]
    peak = max(peaks or range(len(signal)), key=lambda index: signal[index])
    shift = R_PEAK_CENTER_INDEX - peak
    aligned = [0.0] * len(signal)
    for index, value in enumerate(signal):
        new_index = index + shift
        if 0 <= new_index < len(signal):
            aligned[new_index] = value
    return aligned


def resample(signal: list[float], target_length: int = MIT_MODEL_INPUT_LENGTH) -> list[float]:
    if len(signal) == target_length:
        return signal
    source_x = np.linspace(0, 1, num=len(signal))
    target_x = np.linspace(0, 1, num=target_length)
    return np.interp(target_x, source_x, np.array(signal, dtype=float)).tolist()


def normal_template(patients: list[PatientRecord]) -> list[float] | None:
    normal = [patient.signal for patient in patients if patient.label == 0]
    return aggregate_template(normal)


def aggregate_template(signals: list[list[float]], align: bool = True) -> list[float] | None:
    if not signals:
        return None
    prepared = [align_peak(signal) if align else signal for signal in signals]
    length = min(len(row) for row in prepared)
    stacked = np.array([row[:length] for row in prepared], dtype=float)
    return stacked.mean(axis=0).round(6).tolist()


def source_matched_normal_template(patient: PatientRecord, patients: list[PatientRecord]) -> list[float] | None:
    source_prefix = patient.source.split("_", 1)[0]
    normal = [
        item.signal
        for item in patients
        if item.label == 0 and item.source.startswith(source_prefix)
    ]
    if not normal:
        normal = [item.signal for item in patients if item.label == 0]
    return aggregate_template(normal)


def calculate_metrics(signal: list[float], sample_rate_hz: int = 125) -> Metrics:
    peaks = find_peaks(signal)
    duration_seconds = len(signal) / sample_rate_hz
    bpm = round((len(peaks) / duration_seconds) * 60) if duration_seconds else 0
    peak_values = [signal[index] for index in peaks]
    rr_intervals_ms = [
        ((peaks[index] - peaks[index - 1]) / sample_rate_hz) * 1000
        for index in range(1, len(peaks))
    ]
    return Metrics(
        sample_count=len(signal),
        sample_rate_hz=sample_rate_hz,
        duration_seconds=round(duration_seconds, 2),
        peak_count=len(peaks),
        estimated_bpm=bpm,
        mean_amplitude=round(float(statistics.fmean(signal)), 4),
        min_amplitude=round(min(signal), 4),
        max_amplitude=round(max(signal), 4),
        amplitude_range=round(max(signal) - min(signal), 4),
        mean_rr_ms=round(float(statistics.fmean(rr_intervals_ms)), 1) if rr_intervals_ms else 0,
        peak_indexes=peaks[:16],
        peak_values=[round(value, 4) for value in peak_values[:16]],
    )
