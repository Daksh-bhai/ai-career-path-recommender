import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
import numpy as np
import joblib
import os

# ---------- Load dataset ----------
df = pd.read_csv("../data/student_career_dataset.csv")
print("✅ Dataset loaded:", df.shape)

# ---------- Combine text features ----------
df["combined_features"] = (
    df["favourite_subjects"] + " " +
    df["technical_skills"] + " " +
    df["career_interests"]
)

# ---------- Feature extraction using TF-IDF ----------
vectorizer = TfidfVectorizer(max_features=500)
X_text = vectorizer.fit_transform(df["combined_features"]).toarray()

# ---------- Numeric feature (CGPA) ----------
scaler = StandardScaler()
X_cgpa = scaler.fit_transform(df[["cgpa"]])

# ---------- Combine text + numeric ----------
X = np.hstack((X_text, X_cgpa))

# ---------- Encode target labels ----------
le = LabelEncoder()
y = le.fit_transform(df["recommended_career"])

# ---------- Train/test split ----------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("✅ Data split complete:")
print("Training shape:", X_train.shape)
print("Testing shape:", X_test.shape)

# ---------- Save preprocessed files ----------
os.makedirs("../data/processed", exist_ok=True)
np.save("../data/processed/X_train.npy", X_train)
np.save("../data/processed/X_test.npy", X_test)
np.save("../data/processed/y_train.npy", y_train)
np.save("../data/processed/y_test.npy", y_test)
joblib.dump(vectorizer, "../data/processed/vectorizer.pkl")
joblib.dump(le, "../data/processed/label_encoder.pkl")
joblib.dump(scaler, "../data/processed/scaler.pkl")

print("✅ Preprocessing complete! Files saved to data/processed/")
