import pandas as pd
import random

# ----- Define possible values -----
subjects = ["DBMS", "Maths", "AI", "OS", "Networking", "Cloud", "Statistics", "Programming", "Web Design", "Security", "UI", "Ethics"]
skills = ["Python", "C++", "SQL", "JavaScript", "HTML", "CSS", "R", "AWS", "Docker", "TensorFlow", "Linux", "Excel", "React"]
interests = ["Data Science", "Web Development", "Cybersecurity", "Cloud Computing", "AI Research", "UI/UX Design", "Software Development", "Data Analytics"]
careers = {
    "Data Science": "Data Scientist",
    "Web Development": "Frontend Developer",
    "Cybersecurity": "Security Analyst",
    "Cloud Computing": "Cloud Engineer",
    "AI Research": "ML Engineer",
    "UI/UX Design": "UI/UX Designer",
    "Software Development": "Software Developer",
    "Data Analytics": "Data Analyst"
}
skill_levels = ["Beginner", "Intermediate", "Advanced"]

# ----- Generate Random Data -----
data = []
for _ in range(250):  # 250 rows
    cgpa = round(random.uniform(6.0, 9.8), 2)
    fav_subj = ",".join(random.sample(subjects, 3))
    tech_skills = ",".join(random.sample(skills, 3))
    skill_level = random.choice(skill_levels)
    interest = random.choice(interests)
    recommended = careers[interest]
    data.append([cgpa, fav_subj, tech_skills, skill_level, interest, recommended])

# ----- Create DataFrame -----
df = pd.DataFrame(data, columns=[
    "cgpa",
    "favourite_subjects",
    "technical_skills",
    "skill_level",
    "career_interests",
    "recommended_career"
])

# ----- Save to CSV -----
df.to_csv("../data/student_career_dataset.csv", index=False)
print("✅ Dataset generated successfully! File saved to data/student_career_dataset.csv")
