from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import json
import numpy as np
from pathlib import Path

# ---------- Setup paths ----------
BASE = Path(__file__).resolve().parent.parent

# ---------- Load all models and assets ----------
model = joblib.load(BASE / "data" / "model" / "career_model.pkl")
vectorizer = joblib.load(BASE / "data" / "processed" / "vectorizer.pkl")
label_encoder = joblib.load(BASE / "data" / "processed" / "label_encoder.pkl")
scaler = joblib.load(BASE / "data" / "processed" / "scaler.pkl")

with open(BASE / "data" / "roadmaps.json", "r") as f:
    roadmaps = json.load(f)

# ---------- FastAPI app ----------
app = FastAPI(title="AI Career Path Recommender API (Final Viva)", version="1.0")

# ---------- ✅ Enable CORS Middleware ----------
# This allows your frontend (like React, v0.dev, or Netlify) to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # you can replace '*' with your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Input schema ----------
class CareerInput(BaseModel):
    academic: str
    skills: str
    interests: str
    cgpa: float

# ---------- API Endpoints ----------
@app.get("/")
def root():
    return {"message": "Welcome to AI Career Recommender API 🚀"}

@app.post("/predict")
def predict_career(data: CareerInput):
    # Combine user input
    input_text = f"{data.academic} {data.skills} {data.interests}"

    # Transform text + CGPA
    X_text = vectorizer.transform([input_text]).toarray()
    X_cgpa = scaler.transform(np.array([[data.cgpa]]))
    X_input = np.hstack((X_text, X_cgpa))

    # Predict career
    prediction = model.predict(X_input)
    career_name = label_encoder.inverse_transform(prediction)[0]

    # Fetch roadmap
    roadmap_data = roadmaps.get(career_name, {})

    return {
        "career": career_name,
        "skills": roadmap_data.get("skills", []),
        "courses": roadmap_data.get("courses", []),
        "roadmap": roadmap_data.get("roadmap", [])
    }
