# SchemeSaathi (स्कीम साथी / స్కీమ్ సాథి)
### Evidence-Based, Voice-Enabled Government Scheme Discovery Assistant

> **"Find your schemes. Understand your eligibility. Know your next step."**  
> *Developed for the MLH × NIAT Hacktoberfest Hack Day — Best Open-Source AI Project Category.*

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](./LICENSE)
[![Open-Weight Model](https://img.shields.io/badge/Open--Weight%20AI-Qwen2.5--3B%20%2F%20Llama%203.2-indigo.svg)](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct)
[![Backend](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/React%2018-Vite%20%2B%20Tailwind-blue.svg)](https://vitejs.dev)

---

## 1. Project Overview & The Problem

India has hundreds of government scholarships and social welfare schemes designed to support students and families. However, discovering the right scheme and understanding its complex statutory rules remains a major barrier:
- **Dispersed Information**: Eligibility guidelines, Government Orders (GOs), and application links are scattered across Central and State portals (myScheme, NSP, Telangana ePASS).
- **Complex Statutory Matrix**: Applicants struggle to interpret family income ceilings, reservation quotas, academic percentile thresholds, and document requirements.
- **Dead-End Rejections**: When applicants fail one scheme's threshold, existing portals typically show zero results without suggesting viable alternatives.

### Our Solution
**SchemeSaathi** is an evidence-backed assistant that discovers eligible government schemes, tests profile attributes against official criteria, explains results in plain language, and suggests **"Bridge the Gap"** alternatives when an applicant misses an income or quota cutoff.

> **Important Public Service Distinction**: SchemeSaathi does not attempt to replace official portals like myScheme, NSP, or Telangana ePASS. It empowers citizens to understand their eligibility *before* submitting applications through official government channels.

---

## 2. The Four Signature Features

### 🎙️ Feature A: Voice-First, Multilingual Access
- **Natural Language Parsing**: Speak or type naturally (e.g., *"I am a first-year B.Tech student in Telangana with family income 1.8 lakh and BC category."*).
- **Multilingual Web Speech Recognition**: Supports **English (`en-IN`)**, **Telugu (`te-IN`)**, and **Hindi (`hi-IN`)** with live transcript display.
- **Confirmation-First Architecture**: Transcribed profile fields are shown in an editable review card before searching, preventing silent overwrites.

### 🛡️ Feature B: Evidence-Backed Eligibility Reasoning
- **Deterministic Evaluation**: Numeric thresholds (income, age), state domiciles, and categories are strictly evaluated in Python application code—never hallucinated by an LLM.
- **Transparent Status Badges**:
  - `Potential Match`: All mandatory verified requirements are satisfied.
  - `A Requirement Appears Unmet`: Explicit failure of a statutory condition (e.g., income > ₹2,00,000).
  - `More Information Required`: Highlights missing fields (e.g., caste category or annual income).
- **Source Traceability**: Every criterion links directly to the official Government Order (GO) and portal excerpt.

### 🌉 Feature C: "Bridge the Gap" Alternative Recommendations
- **No Dead Ends**: When a scheme fails due to a mandatory criterion (such as parental income exceeding a ceiling), the engine re-evaluates the verified catalog to recommend compatible alternative schemes.
- **Example**: If a student exceeds the Telangana ePASS ₹2.0 Lakh limit with ₹3.5 Lakh income, SchemeSaathi immediately recommends **AICTE Pragati** (₹8.0 Lakh limit) and **Central Sector CSSS** (₹4.5 Lakh limit).

### 📋 Feature D: One-Click Action Checklist
- **Official Documentation**: Extracts mandatory certificates (Meeseva Income Certificate, Caste Certificate, College Bonafide) directly from verified guidelines.
- **Interactive Checkboxes**: Users can check off documents locally as they prepare their dossier.
- **Sequential Application Steps**: Direct links to official portals (telanganaepass.cgg.gov.in, scholarships.gov.in).

---

## 3. Curated Knowledge Base

SchemeSaathi indexes a curated dataset of official education schemes verified against current government circulars:

| Scheme Name | Authority | Scope | Income Limit | Target Group |
|---|---|---|---|---|
| **Telangana ePASS Post-Matric** | BC / Social Welfare Dept, Govt of Telangana | Telangana | ₹1.5L (Rural) / ₹2.0L (Urban) / ₹1.0L (Disabled) | SC, ST, BC, EBC, Minority |
| **AICTE Pragati Scholarship** | AICTE, Ministry of Education, Govt of India | All India | ₹8,00,000 p.a. | Female students in technical degree/diploma |
| **Central Sector CSSS** | Dept of Higher Education, Govt of India | All India | ₹4,50,000 p.a. | Top 20th percentile Class 12th board scorers |
| **PM-YASASVI Top Class Education** | Ministry of Social Justice & Empowerment | All India | ₹2,50,000 p.a. | OBC, EBC, DNT in premier institutions |
| **Telangana Overseas Vidya Nidhi** | Welfare Departments, Govt of Telangana | Telangana | ₹5,00,000 p.a. (Age ≤ 35) | SC, ST, BC, Minority pursuing Masters abroad |

*For complete source excerpts, verification dates, and government orders, see [`backend/data/data_sources.md`](file:///c:/Users/SPOORTHI/Downloads/schemesaathi/backend/data/data_sources.md).*

---

## 4. Open-Weight AI Architecture

SchemeSaathi strictly separates responsibilities to ensure zero hallucinations:

```
┌─────────────────────────────────────────────────────────────┐
│                       USER INTERACTION                      │
│   Voice (Web Speech API)  /  Typed Input  /  Questionnaire  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 OPEN-WEIGHT LANGUAGE MODEL                  │
│             Qwen2.5-3B-Instruct / Llama 3.2 3B              │
│  - Extracts structured profile fields from freeform speech  │
│  - Synthesizes plain-language rule explanations             │
│  - Answers grounded follow-up questions from source text    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Structured Profile
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                DETERMINISTIC ELIGIBILITY ENGINE             │
│                       (Pure Python Code)                    │
│  - Compares numeric income against verified ceilings        │
│  - Checks state domicile & educational qualifications       │
│  - Assigns: Satisfied | Not Satisfied | Needs Information   │
│  - Discovers "Bridge the Gap" alternatives                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     EVIDENCE LAYER & UI                     │
│  - Traceable official Government Order (GO) excerpts        │
│  - Official portal links (telanganaepass.cgg.gov.in, NSP)   │
│  - Actionable Document Checklist                            │
└─────────────────────────────────────────────────────────────┘
```

### Configurable Model Providers
Configure via `.env`:
1. **Hugging Face Serverless API**: `HF_TOKEN=your_token` using open-weight `Qwen/Qwen2.5-3B-Instruct`.
2. **Local OpenAI-Compatible Server**: `OPENAI_BASE_URL=http://localhost:11434/v1` for local Ollama (`ollama run qwen2.5:3b`).
3. **Transparent Heuristic Fallback**: Operates in deterministic mode when offline with clear UI attribution.

---

## 5. Three Judge Demonstration Scenarios

You can run these scenarios with 1-click presets on the homepage:

1. **Scenario 1: Potential Match**
   - *Profile*: 1st-year B.Tech student in Telangana, family income ₹1.8 Lakh, BC category.
   - *Result*: Telangana ePASS is identified as a **Potential Match**. Mandatory criteria pass, pending attendance & bonafide checks.
2. **Scenario 2: Known Failed Requirement & Bridge the Gap**
   - *Profile*: Female B.Tech student in Telangana, family income ₹3.5 Lakh.
   - *Result*: ePASS is marked as **Unmet** (exceeds ₹2.0 Lakh limit). "Bridge the Gap" immediately identifies **AICTE Pragati** (₹8L ceiling) and **Central Sector CSSS** (₹4.5L ceiling) as viable alternatives.
3. **Scenario 3: Missing Information**
   - *Profile*: Student provides B.Tech in Telangana, but omits income and category.
   - *Result*: The system flags **"Needs Information"** and requests the missing fields without guessing or hallucinating percentages.

---

## 6. Getting Started & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 7. Privacy, Ethics & Limitations

- **No Sensitive Identifiers**: SchemeSaathi never asks for Aadhaar numbers, phone numbers, or passwords.
- **Client-Side Storage**: Profile attributes reside strictly in temporary browser memory.
- **Limitation Notice**: The initial hackathon MVP contains 5 verified schemes. Scheme criteria, quotas, and application windows are subject to official government notification changes.

---

## 8. License

SchemeSaathi is open-source software licensed under the **[MIT License](./LICENSE)**.  
Upstream model weights are governed by respective community licenses (Qwen Research License / Apache 2.0 / Llama 3.2 Community License).
