# 🧩 Step 2.1 — Input Goals Definition

The system will collect 3 types of data from students: **Academic**, **Skills**, and **Interests**.

---

## 🎓 Academic Section
| Field | Type | Example | Description |
|--------|------|----------|-------------|
| `cgpa` | float | 8.5 | Average grade or CGPA |
| `favourite_subjects` | list of strings | ["DBMS", "Maths", "AI"] | Subjects student enjoys most |
| `academic_stream` | string | "BCA" | Student’s academic program |

---

## 💻 Skills Section
| Field | Type | Example | Description |
|--------|------|----------|-------------|
| `technical_skills` | list of strings | ["Python", "C++", "SQL"] | Programming or software skills |
| `soft_skills` | list of strings | ["Communication", "Problem Solving"] | Optional interpersonal skills |
| `skill_level` | string | "Intermediate" | General proficiency level |

---

## 🌱 Interests Section
| Field | Type | Example | Description |
|--------|------|----------|-------------|
| `career_interests` | list of strings | ["Data Science", "Web Development"] | Domains of career interest |
| `learning_interest_level` | integer | 9 | Motivation or enthusiasm level (1–10) |
| `preferred_work_area` | string | "Software Development" | Broader goal (e.g., research, design) |

---

## ✅ Example Combined Input (JSON)
```json
{
  "academic": {
    "cgpa": 8.5,
    "favourite_subjects": ["DBMS", "Maths", "AI"],
    "academic_stream": "BCA"
  },
  "skills": {
    "technical_skills": ["Python", "C++", "SQL"],
    "soft_skills": ["Communication", "Problem Solving"],
    "skill_level": "Intermediate"
  },
  "interests": {
    "career_interests": ["Data Science", "Web Development"],
    "learning_interest_level": 9,
    "preferred_work_area": "Software Development"
  }
}
