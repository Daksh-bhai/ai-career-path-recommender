import joblib
import json
import numpy as np
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder

# make paths robust relative to this file
BASE = Path(__file__).resolve().parent.parent  # project root
model = joblib.load(BASE / "data" / "model" / "career_model.pkl")
vectorizer = joblib.load(BASE / "data" / "processed" / "vectorizer.pkl")
label_encoder = joblib.load(BASE / "data" / "processed" / "label_encoder.pkl")
scaler = joblib.load(BASE / "data" / "processed" / "scaler.pkl")  # <- added

# ---------- Load roadmap JSON ----------
with open(BASE / "data" / "roadmaps.json", "r") as f:
    roadmaps = json.load(f)

print("✅ Model and roadmap data loaded successfully!\n")

# ---------- Function to predict career ----------
def predict_career(academic, skills, interests, cgpa=7.0):
    # Combine user input
    input_text = f"{academic} {skills} {interests}"
    
    # Convert to TF-IDF features
    X_text = vectorizer.transform([input_text]).toarray()  # shape (1, n_text_features)
    
    # Scale and append CGPA numeric feature (ensures same feature count as training)
    X_cgpa = scaler.transform(np.array([[cgpa]]))  # shape (1,1)
    X_input = np.hstack((X_text, X_cgpa))  # final shape (1, n_text_features + 1)
    
    # Predict career
    prediction = model.predict(X_input)
    career_name = label_encoder.inverse_transform(prediction)[0]
    
    # Fetch roadmap details
    career_data = roadmaps.get(career_name, {})
    
    # Display result
    print(f"🎯 Predicted Career Path: {career_name}\n")
    
    if career_data:
        print("📘 Key Skills Needed:")
        for s in career_data["skills"]:
            print("   •", s)
        
        print("\n🎓 Recommended Courses:")
        for c in career_data["courses"]:
            print("   •", c)
        
        print("\n🛣️  Roadmap:")
        for step in career_data["roadmap"]:
            print("   ➤", step)
    else:
        print("No roadmap found for this career yet. Please update roadmaps.json")

# ---------- Example test ----------
if __name__ == "__main__":
    print("🔍 Example Test Run:\n")
    predict_career(
        academic="Computer Science graduate with good math background",
        skills="Python, SQL, statistics, machine learning",
        interests="data analysis, AI, visualization",
        cgpa=8.0  # pass cgpa so input vector matches training shape
    )
