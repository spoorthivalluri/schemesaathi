/**
 * SchemeSaathi Demonstration Scenarios for Judges
 * Strictly adheres to verified government scheme rules in the knowledge base.
 */
export const DEMO_SCENARIOS = [
  {
    id: "scenario-1",
    title: "Scenario 1: Potential Match",
    tagline: "First-Year B.Tech Student in Telangana (Income: ₹1.8 Lakh)",
    badge: "Potential Match",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description:
      "A student in Telangana studying B.Tech with parental income ₹1.8 Lakh and BC category meets all known mandatory criteria for the Telangana ePASS Post-Matric Scholarship.",
    profile: {
      state: "Telangana",
      course: "B.Tech",
      education_level: "Graduation",
      annual_income: 180000,
      category: "BC",
      gender: "Male",
      locality: "urban",
      age: 19
    },
    sampleSpeech: "I am a first-year B.Tech student in Telangana. My family's annual income is around 1.8 lakh and I belong to BC category.",
    expectedOutcome: "Telangana ePASS matches as Potential Match. Criteria breakdown displays verified income ceiling and document prerequisites."
  },
  {
    id: "scenario-2",
    title: "Scenario 2: Known Failed Requirement & Bridge the Gap",
    tagline: "Female B.Tech Student (Income: ₹3.5 Lakh, exceeds ePASS ceiling)",
    badge: "Unmet Requirement + Bridge Alternatives",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    description:
      "A female B.Tech student in Telangana with family income ₹3.5 Lakh fails the ePASS ₹2.0 Lakh threshold. SchemeSaathi immediately triggers 'Bridge the Gap' and highlights AICTE Pragati (₹8L ceiling) and Central Sector CSSS (₹4.5L ceiling) using the exact same deterministic engine.",
    profile: {
      state: "Telangana",
      course: "B.Tech",
      education_level: "Graduation",
      annual_income: 350000,
      category: "BC",
      gender: "Female",
      locality: "urban",
      age: 18
    },
    sampleSpeech: "I am a female student studying B.Tech in Hyderabad. Our family income is 3.5 lakhs. Which scholarships can I apply for?",
    expectedOutcome: "ePASS correctly marked as 'A requirement appears unmet' due to verified income threshold. Bridge the Gap finds AICTE Pragati & CSSS."
  },
  {
    id: "scenario-3",
    title: "Scenario 3: Missing Information",
    tagline: "Student Omits Income & Social Category",
    badge: "Needs Information",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description:
      "A student provides their course and state but omits annual income and social category. The engine strictly avoids guessing or inventing percentages, marking criteria as 'Needs information' and requesting the missing fields.",
    profile: {
      state: "Telangana",
      course: "B.Tech",
      education_level: "Graduation",
      annual_income: null,
      category: null,
      gender: "Male",
      locality: "urban",
      age: 20
    },
    sampleSpeech: "I study B.Tech in Telangana. Can you find schemes for me?",
    expectedOutcome: "Criteria marked as 'Needs information'. Promptly asks user for annual income and category to enable deterministic evaluation."
  }
];
