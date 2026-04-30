from __future__ import annotations

from fastapi import APIRouter

from app.schemas import ReferenceSignal
from app.services.patient_service import patient_service


router = APIRouter(prefix="/api/reference-signals", tags=["reference signals"])


@router.get("", response_model=list[ReferenceSignal])
def list_reference_signals() -> list[ReferenceSignal]:
    return patient_service.list_reference_signals()
