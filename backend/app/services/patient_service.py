from __future__ import annotations

import csv
from pathlib import Path

import numpy as np

from app.config import MIT_MODEL_INPUT_LENGTH, settings
from app.domain import PatientRecord
from app.schemas import PatientDetail, PatientSummary, ReferenceSignal
from app.services.signal_service import aggregate_template, calculate_metrics, source_matched_normal_template


PATIENT_SAMPLE_FILES = ["mit_test.csv", "mit_train.csv", "ptb_normal.csv", "ptb_abnormal.csv"]
MIT_CLASS_NAMES = {
    1: "Supraventricular ectopic beat",
    2: "Ventricular ectopic beat",
    3: "Fusion beat",
    4: "Unclassifiable beat",
}


class PatientService:
    def __init__(self, sample_data_dir: Path = settings.sample_data_dir) -> None:
        self.sample_data_dir = sample_data_dir

    def list_records(self) -> list[PatientRecord]:
        patients: list[PatientRecord] = []
        for file_name in PATIENT_SAMPLE_FILES:
            patients.extend(self._read_csv_records(self.sample_data_dir / file_name))
        return patients or self._synthetic_patients()

    def list_summaries(self) -> list[PatientSummary]:
        return [
            PatientSummary(
                id=patient.id,
                source=patient.source,
                row_index=patient.row_index,
                label=patient.label,
                sample_count=len(patient.signal),
            )
            for patient in self.list_records()
        ]

    def get_detail(self, patient_id: str) -> PatientDetail | None:
        patients = self.list_records()
        patient = next((item for item in patients if item.id == patient_id), None)
        if patient is None:
            return None
        return PatientDetail(
            id=patient.id,
            source=patient.source,
            row_index=patient.row_index,
            label=patient.label,
            sample_count=len(patient.signal),
            signal=patient.signal,
            normal_template=source_matched_normal_template(patient, patients),
            metrics=calculate_metrics(patient.signal),
        )

    def list_reference_signals(self) -> list[ReferenceSignal]:
        mit_records = [
            patient
            for file_name in ["mit_test.csv", "mit_train.csv"]
            for patient in self._read_csv_records(self.sample_data_dir / file_name)
        ]
        ptb_records = [
            patient
            for file_name in ["ptb_normal.csv", "ptb_abnormal.csv"]
            for patient in self._read_csv_records(self.sample_data_dir / file_name)
        ]
        records = mit_records or self._synthetic_patients()
        abnormal_labels = sorted({patient.label for patient in records if patient.label and patient.label > 0})

        references: list[ReferenceSignal] = []
        references.extend(
            reference
            for reference in [
                self._build_reference("mit-normal", 0, "MIT normal beat", "MIT", "normal", mit_records),
                self._build_reference("ptb-normal", 0, "PTB normal beat", "PTB", "normal", ptb_records),
            ]
            if reference is not None
        )
        for label in abnormal_labels:
            reference = self._build_reference(
                id=f"mit-class-{label}",
                label=label,
                name=MIT_CLASS_NAMES.get(label, f"MIT abnormal class {label}"),
                dataset="MIT",
                kind="abnormal",
                records=records,
            )
            if reference is not None:
                references.append(reference)
        return references

    def _build_reference(
        self,
        id: str,
        label: int,
        name: str,
        dataset: str,
        kind: str,
        records: list[PatientRecord],
    ) -> ReferenceSignal | None:
        signals = [patient.signal for patient in records if patient.label == label]
        signal = aggregate_template(signals)
        if signal is None:
            return None
        return ReferenceSignal(
            id=id,
            label=label,
            name=name,
            dataset=dataset,
            kind=kind,  # type: ignore[arg-type]
            source_count=len(signals),
            signal=signal,
        )

    def _read_csv_records(self, path: Path, limit: int = 80) -> list[PatientRecord]:
        if not path.exists():
            return []

        records: list[PatientRecord] = []
        with path.open(newline="") as handle:
            reader = csv.DictReader(handle)
            feature_columns = [name for name in (reader.fieldnames or []) if name.startswith("c_")]
            feature_columns.sort(key=lambda name: int(name.split("_")[1]))

            for index, row in enumerate(reader):
                if index >= limit:
                    break
                signal = [float(row[column]) for column in feature_columns]
                label = int(float(row["target"])) if row.get("target") not in (None, "") else None
                slug = path.stem.replace("_", "-")
                records.append(
                    PatientRecord(
                        id=f"{slug}-{index + 1:03d}",
                        source=path.name,
                        row_index=index,
                        label=label,
                        signal=signal,
                    )
                )
        return records

    def _synthetic_patients(self) -> list[PatientRecord]:
        x_axis = np.linspace(0, 1, MIT_MODEL_INPUT_LENGTH)
        patients: list[PatientRecord] = []
        for index in range(8):
            center = 0.45 + (index % 3) * 0.03
            qrs = np.exp(-((x_axis - center) ** 2) / 0.0009)
            p_wave = 0.18 * np.exp(-((x_axis - 0.24) ** 2) / 0.004)
            t_wave = 0.28 * np.exp(-((x_axis - 0.68) ** 2) / 0.012)
            baseline = 0.04 * np.sin(2 * np.pi * x_axis * 4)
            signal = (p_wave + qrs + t_wave + baseline).round(6)
            label = 0
            if index >= 4:
                signal = (signal * (0.75 + index * 0.05)).round(6)
                signal[70:92] = (signal[70:92] * 0.35).round(6)
                label = 1
            patients.append(
                PatientRecord(
                    id=f"demo-{index + 1:03d}",
                    source="synthetic",
                    row_index=index,
                    label=label,
                    signal=signal.tolist(),
                )
            )
        return patients


patient_service = PatientService()
