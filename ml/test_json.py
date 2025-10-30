import json

with open("data/roadmaps.json", "r") as f:

    data = json.load(f)

print("✅ JSON loaded successfully!")
print("Available careers:", list(data.keys()))
