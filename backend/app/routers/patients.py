from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.schemas import PatientDetail, PatientSummary
from app.services.patient_service import patient_service


router = APIRouter(prefix="/api/patients", tags=["patients"])


@router.get("", response_model=list[PatientSummary])
def list_patients() -> list[PatientSummary]:
    return patient_service.list_summaries()


@router.get("/{patient_id}", response_model=PatientDetail)
def get_patient(patient_id: str) -> PatientDetail:
    patient = patient_service.get_detail(patient_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
