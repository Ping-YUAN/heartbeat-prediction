from __future__ import annotations

import urllib.request
from pathlib import Path
from typing import Any

import joblib
import numpy as np

from app.config import MIT_MODEL_INPUT_LENGTH, settings
from app.schemas import Prediction
from app.services.signal_service import align_peak, calculate_metrics, resample


class ModelService:
    def __init__(self) -> None:
        self.model: Any | None = None
        self.scaler: Any | None = None
        self.status = "not_loaded"
        self._load_warnings: list[str] = []
        self.load()

    def predict(self, signal: list[float]) -> Prediction:
        if self.model is None:
            return self._heuristic_prediction(signal)

        prepared = resample(signal)
        prepared = align_peak(prepared)
        model_input = np.array(prepared, dtype=float).reshape(1, -1)
        if self.scaler is not None:
            model_input = self.scaler.transform(model_input)
        model_input = model_input.reshape(1, MIT_MODEL_INPUT_LENGTH, 1)
        raw = np.asarray(self.model.predict(model_input, verbose=0)).reshape(-1)
        abnormal_probability = float(raw[-1])
        if len(raw) == 2:
            abnormal_probability = float(raw[1])
        label = "abnormal" if abnormal_probability >= 0.5 else "normal"
        confidence = abnormal_probability if label == "abnormal" else 1 - abnormal_probability
        return Prediction(
            label=label,
            confidence=round(confidence, 3),
            abnormal_probability=round(abnormal_probability, 3),
            model_status=self.status,
            method="mit_binary_shift_cnn",
        )

    def load(self) -> None:
        self._download_if_missing(settings.model_path, settings.model_url)
        self._download_if_missing(settings.scaler_path, settings.scaler_url)

        if not settings.model_path.exists():
            suffix = f" ({'; '.join(self._load_warnings)})" if self._load_warnings else ""
            self.status = f"missing_model{suffix}"
            return

        try:
            import tensorflow as tf

            self.model = tf.keras.models.load_model(settings.model_path)
            self.scaler = joblib.load(settings.scaler_path) if settings.scaler_path.exists() else None
            self.status = "ready"
        except Exception as exc:  # pragma: no cover - depends on local ML runtime.
            self.model = None
            self.scaler = None
            self.status = f"unavailable: {exc}"

    def _heuristic_prediction(self, signal: list[float]) -> Prediction:
        metrics = calculate_metrics(signal)
        bpm = float(metrics.estimated_bpm)
        amplitude_range = float(metrics.amplitude_range)
        score = 0.0
        if bpm < 45 or bpm > 120:
            score += 0.35
        if amplitude_range < 0.35 or amplitude_range > 1.15:
            score += 0.25
        if metrics.peak_count == 0:
            score += 0.3
        probability = min(0.88, max(0.12, score + 0.22))
        label = "abnormal" if probability >= 0.5 else "normal"
        confidence = probability if label == "abnormal" else 1 - probability
        return Prediction(
            label=label,
            confidence=round(confidence, 3),
            abnormal_probability=round(probability, 3),
            model_status=self.status,
            method="heuristic_fallback",
        )

    def _download_if_missing(self, target: Path, url: str | None) -> None:
        if target.exists() or not url:
            return
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            urllib.request.urlretrieve(url, target)
        except Exception as exc:
            self._load_warnings.append(f"download_failed:{target.name}:{exc}")


model_service = ModelService()
