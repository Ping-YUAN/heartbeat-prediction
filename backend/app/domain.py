from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PatientRecord:
    id: str
    source: str
    row_index: int
    label: int | None
    signal: list[float]
