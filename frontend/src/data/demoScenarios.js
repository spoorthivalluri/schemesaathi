/**
 * SchemeSaathi Demonstration Scenarios for Evaluators
 * Strictly reflects verified government scheme criteria.
 */
export const DEMO_SCENARIOS = [
  {
    id: "scenario-1",
    title: "Scenario A: Likely Match",
    tagline: "First-Year B.Tech Student in Telangana (Income: ₹1.8 Lakh)",
    badge: "Likely match",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description:
      "A student in Telangana studying B.Tech with parental income ₹1.8 Lakh and BC category satisfies all known mandatory conditions for the Telangana ePASS Post-Matric Scholarship.",
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
    expectedOutcome: "Telangana ePASS is identified as a Likely match. Verified income ceiling and required certificates are displayed with official citations."
  },
  {
    id: "scenario-2",
    title: "Scenario B: Doesn't Match & Bridge the Gap",
    tagline: "Female B.Tech Student (Income: ₹3.5 Lakh, exceeds ePASS ceiling)",
    badge: "Doesn't match",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    description:
      "A female B.Tech student with family income ₹3.5 Lakh exceeds the ePASS ₹2.0 Lakh limit. The engine marks it as 'Doesn't match' and immediately offers Bridge the Gap alternatives like AICTE Pragati (₹8L limit) and CSSS (₹4.5L limit).",
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
    expectedOutcome: "ePASS correctly evaluated as Doesn't match. Bridge the Gap finds AICTE Pragati and CSSS based on verified conditions."
  },
  {
    id: "scenario-3",
    title: "Scenario C: More Information Needed",
    tagline: "Student Omits Income & Social Category",
    badge: "More info needed",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description:
      "A student provides course and state but omits annual family income and social category. The engine avoids guessing or fabricating probabilities, explicitly requesting the missing fields.",
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
    expectedOutcome: "Criteria evaluated as More information needed. Missing fields are highlighted to complete evaluation."
  }
];
