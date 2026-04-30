from __future__ import annotations

from fastapi import APIRouter

from app.schemas import AnalysisResponse, AnalyzeRequest
from app.services.model_service import model_service
from app.services.signal_service import calculate_metrics


router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze", response_model=AnalysisResponse)
def analyze(payload: AnalyzeRequest) -> AnalysisResponse:
    signal = [float(value) for value in payload.signal]
    return AnalysisResponse(
        patient_id=payload.patient_id,
        prediction=model_service.predict(signal),
        metrics=calculate_metrics(signal),
    )
