from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import analysis, health, patients, references


def create_app() -> FastAPI:
    api = FastAPI(title="Heartbeat Prediction API", version="0.1.0")
    api.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api.include_router(health.router)
    api.include_router(patients.router)
    api.include_router(references.router)
    api.include_router(analysis.router)

    @api.get("/")
    def root() -> dict[str, str]:
        return {"message": "Heartbeat Prediction API", "docs": "/docs"}

    if settings.static_dir.exists():
        api.mount("/app", StaticFiles(directory=settings.static_dir, html=True), name="static")

    return api
