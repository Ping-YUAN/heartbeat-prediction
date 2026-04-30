FROM node:22-bookworm-slim AS frontend-build

WORKDIR /workspace/heartbeat-prediction
COPY package*.json ./
COPY frontend/package.json ./frontend/package.json
RUN npm ci

COPY . ./
RUN npx nx build frontend

FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    MODEL_DIR=/app/backend/models

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend /app/backend
COPY --from=frontend-build /workspace/heartbeat-prediction/frontend/dist /app/backend/static

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
