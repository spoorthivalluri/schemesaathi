# SchemeSaathi: 90-Second Hackathon Judge Demonstration Script

This script allows the team to present a flawless, high-impact demonstration of **SchemeSaathi** in exactly 90 seconds.

---

### [00:00 – 00:15] Hook & The Real-World Problem
**Presenter 1:**
> *"Judges, India has hundreds of government scholarships and welfare schemes, but finding them is painful. Official circulars are buried in PDFs, income ceilings vary by caste and location, and existing portals often give you a blank screen if you fail just one rule.  
> We built **SchemeSaathi**—an evidence-backed, voice-enabled assistant that doesn't just check eligibility with deterministic precision; it **Bridges the Gap** to suggest viable alternatives when you miss a cutoff."*

---

### [00:15 – 00:30] Voice & Natural Language Profile Entry
**Presenter 2 (Screen Shared on `http://localhost:5173`):**
> *"Let's test it live. Users can fill a simple multi-step form, or click the **Voice button** to speak in English, Telugu, or Hindi:  
> *(Click Microphone or Quick Scenario 1)*  
> **'I am a first-year B.Tech student in Telangana. My family's annual income is around ₹1.8 lakh and I belong to BC category.'**  
> Notice how SchemeSaathi transcribes the speech, extracts the structured fields using our open-weight model, and asks for confirmation before searching. No Aadhaar numbers, no logins."*

---

### [00:30 – 00:50] Evidence-Backed Reasoning
**Presenter 2:**
> *"Clicking **Evaluate Eligible Schemes** runs our pure deterministic Python engine.  
> Look at the **Telangana ePASS Post-Matric Scholarship**: It's marked as a **Potential Match**.  
> Notice we **never invent match percentages**. Clicking **View Evidence & Details** reveals the full matrix:
> - Family income ₹1,80,000 is verified against the ₹2,00,000 statutory limit.
> - State domicile matches Telangana.
> - Every single line links directly to the official government order and portal excerpt."*

---

### [00:50 – 01:05] The Signature "Bridge the Gap" Feature
**Presenter 3:**
> *"Now for our key differentiator. What happens when a student fails a requirement?  
> Let's load **Scenario 2**: A female student whose family income is ₹3.5 Lakh—exceeding the ePASS ceiling.  
> Other portals give a dead-end rejection. SchemeSaathi immediately marks ePASS as **'A requirement appears unmet'**, highlights the exact ₹2.0L ceiling, and triggers **Bridge the Gap**.  
> In one click, the engine scans the catalog and discovers **AICTE Pragati** (with an ₹8.0 Lakh limit) and **Central Sector CSSS** (with a ₹4.5 Lakh limit) as verified alternatives!"*

---

### [01:05 – 01:20] One-Click Action Checklist & Grounded Q&A
**Presenter 2:**
> *"Under the **Action Checklist** tab, SchemeSaathi generates a source-grounded list of required documents: Meeseva Income Certificate, Caste Certificate, and College Bonafide.  
> The student can check off documents locally as they prepare them, and click through directly to the official application portal."*

---

### [01:20 – 01:30] Open-Weight AI Architecture & Close
**Presenter 1:**
> *"Under the hood, SchemeSaathi combines **Qwen2.5-3B-Instruct** for natural language translation and Q&A with a **strict deterministic Python boundary** for all numeric and statutory logic. The model explains the rules, but never hallucinates eligibility.  
> SchemeSaathi is open-source, privacy-preserving, and built for public good. Thank you!"*

---

### Quick Cheat Sheet for Demo Scenarios
| Scenario | Profile Input | Key Screen to Show | Wow Factor |
|---|---|---|---|
| **Scenario 1** | TG, B.Tech, ₹1.8L, BC | Results Dashboard & Evidence Modal | Potential match with exact statutory excerpts |
| **Scenario 2** | TG, B.Tech Female, ₹3.5L | Bridge the Gap Modal | Immediate alternative schemes with higher ceilings |
| **Scenario 3** | TG, B.Tech, Missing Income | Dashboard Missing Field Alert | Transparent "Needs Information" handling without guessing |
