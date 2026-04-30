from __future__ import annotations

from fastapi import APIRouter

from app.config import settings
from app.schemas import HealthResponse
from app.services.model_service import model_service


router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        model_status=model_service.status,
        model_path=str(settings.model_path),
        sample_data_dir=str(settings.sample_data_dir),
    )
