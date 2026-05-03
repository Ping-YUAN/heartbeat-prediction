# Heartbeat Prediction

> **Experimental project only. Not medical advice.**
>
> This application is a research and learning prototype. It is not a medical device, has not been clinically validated, and must not be used to diagnose, treat, monitor, or make decisions about any real patient. Any prediction, confidence score, ECG visualization, or dashboard metric shown by this app is for experimentation only.

Doctor-facing ECG review app backed by a FastAPI inference service and a React dashboard.

## What it does

- Lists ECG patient samples from CSV fixtures committed in this repo.
- Ships local sample CSV files under `backend/sample_data` for the demo dashboard.
- Shows the selected ECG waveform with detected R peaks.
- Overlays the mean normal heartbeat template when normal samples are available.
- Computes basic dashboard metrics: estimated pulse, beat count, RR interval, duration, and amplitude range.
- Calls the Python API for first-pass binary classification: normal vs abnormal plus confidence.

## Local Development

Run these commands from the `heartbeat-prediction` repo.

Backend, in one terminal:

```sh
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The default backend install does not include TensorFlow, so the API can still run if your platform cannot install a compatible TensorFlow wheel. In that mode, `/api/analyze` uses the development fallback classifier. To enable the Keras model downloaded from the training repo, install:

```sh
pip install -r requirements-ml.txt
```

Frontend, in a second terminal from the repo root:

```sh
npm install
npx nx serve frontend
```

Open:

- App: `http://localhost:4200`
- API docs: `http://localhost:8000/docs`

The frontend calls `http://localhost:8000` by default. Set `VITE_API_BASE_URL` to use another API host.

## Docker

The Docker image builds the React app, serves it from FastAPI at `/app`, and exposes the API under `/api`.

```sh
docker compose up --build
```

Open:

- App: `http://localhost:8000/app`
- API docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/api/health`

## Data and Model Sources

`heartbeat-prediction` is independent from the training repo.

Training code, source notebooks, and model artifact history live in:

- `https://github.com/Ping-YUAN/heartbeat-analysis-ai`

The demo patient sample CSV files are generated into this repo at:

- `backend/sample_data/mit_test.csv`
- `backend/sample_data/mit_train.csv`
- `backend/sample_data/ptb_normal.csv`
- `backend/sample_data/ptb_abnormal.csv`

By default, the API downloads the trained model and scaler from the GitHub raw URLs for the training repo:

- `https://raw.githubusercontent.com/Ping-YUAN/heartbeat-analysis-ai/main/src/streamlit/utils/model_mit_binary_shift_cnn.h5`
- `https://raw.githubusercontent.com/Ping-YUAN/heartbeat-analysis-ai/main/src/streamlit/utils/mit_shift_scaler.pkl`

If TensorFlow or the model is unavailable, the API still returns a heuristic fallback result so the UI remains usable during development.

If sample CSV files are unavailable in the container, the API generates a small synthetic ECG sample set so the dashboard can still be exercised end to end.
