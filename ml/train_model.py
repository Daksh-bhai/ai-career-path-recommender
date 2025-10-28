import numpy as np
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
import os

# ---------- Load preprocessed data ----------
X_train = np.load("../data/processed/X_train.npy")
X_test = np.load("../data/processed/X_test.npy")
y_train = np.load("../data/processed/y_train.npy")
y_test = np.load("../data/processed/y_test.npy")

print("✅ Data loaded successfully")
print("Training samples:", X_train.shape[0])
print("Testing samples:", X_test.shape[0])

# ---------- Train three baseline models ----------
models = {
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "KNN": KNeighborsClassifier(n_neighbors=5)
}

best_model = None
best_accuracy = 0

for name, model in models.items():
    print(f"\n🔹 Training {name}...")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Accuracy ({name}): {acc:.4f}")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Track best model
    if acc > best_accuracy:
        best_accuracy = acc
        best_model = model
        best_name = name

# ---------- Save best model ----------
os.makedirs("../data/model", exist_ok=True)
joblib.dump(best_model, f"../data/model/career_model.pkl")

print(f"\n✅ Training complete! Best model: {best_name} ({best_accuracy:.4f})")
print("Model saved to data/model/career_model.pkl")
