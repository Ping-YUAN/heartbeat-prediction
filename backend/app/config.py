from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_SAMPLE_DIR = BASE_DIR / "sample_data"
APP_MODEL_DIR = Path(os.getenv("MODEL_DIR", BASE_DIR / "models"))
HEARTBEAT_ANALYSIS_AI_RAW_BASE = "https://raw.githubusercontent.com/Ping-YUAN/heartbeat-analysis-ai/main"
DEFAULT_MODEL_URL = f"{HEARTBEAT_ANALYSIS_AI_RAW_BASE}/src/streamlit/utils/model_mit_binary_shift_cnn.h5"
DEFAULT_SCALER_URL = f"{HEARTBEAT_ANALYSIS_AI_RAW_BASE}/src/streamlit/utils/mit_shift_scaler.pkl"

MIT_MODEL_INPUT_LENGTH = 187
R_PEAK_CENTER_INDEX = 87


def _env_or_default(name: str, default: str) -> str:
    return os.getenv(name) or default


@dataclass(frozen=True)
class Settings:
    sample_data_dir: Path = Path(os.getenv("SAMPLE_DATA_DIR", DEFAULT_SAMPLE_DIR))
    model_path: Path = Path(os.getenv("MODEL_PATH", APP_MODEL_DIR / "model_mit_binary_shift_cnn.h5"))
    scaler_path: Path = Path(os.getenv("SCALER_PATH", APP_MODEL_DIR / "mit_shift_scaler.pkl"))
    model_url: str | None = _env_or_default("MODEL_URL", DEFAULT_MODEL_URL)
    scaler_url: str | None = _env_or_default("SCALER_URL", DEFAULT_SCALER_URL)
    static_dir: Path = BASE_DIR / "static"
    cors_origins: list[str] = field(default_factory=lambda: os.getenv("CORS_ORIGINS", "*").split(","))


settings = Settings()
