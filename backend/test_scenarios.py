"""
Verification Test for SchemeSaathi's Evaluator Scenarios:
Scenario A — Likely match
Scenario B — Missing information
Scenario C — Does not match
Scenario D — Inconsistent / boundary conditions
"""
import sys
from engine.eligibility import (
    EligibilityEngine,
    ASSESSMENT_LIKELY_MATCH,
    ASSESSMENT_DOESNT_MATCH,
    ASSESSMENT_MORE_INFO_NEEDED
)
from engine.alternatives import BridgeTheGapEngine

engine = EligibilityEngine()
bridge = BridgeTheGapEngine(engine)

print("=== SCENARIO A: Likely match ===")
# Fictional first-year B.Tech student in Telangana whose reported circumstances meet all known mandatory criteria for ePASS
s1_profile = {
    "state": "Telangana",
    "course": "B.Tech",
    "education_level": "Graduation",
    "annual_income": 180000,
    "category": "BC",
    "gender": "Male",
    "locality": "urban"
}
s1_results = engine.match_all(s1_profile)
print(f"Total schemes: {s1_results['summary']['total_schemes']}")
print(f"Likely matches count: {s1_results['summary']['likely_match_count']}")
for m in s1_results["likely_matches"]:
    print(f"  -> Likely Match: {m['scheme']['name']}")
assert s1_results['summary']['likely_match_count'] >= 1, "Scenario A must have at least 1 likely match"
assert any(m['scheme']['id'] == 'telangana-epass-postmatric' for m in s1_results["likely_matches"]), "ePASS must be likely match"

print("\n=== SCENARIO B: Missing information ===")
# Fictional user who omits annual income and category
s3_profile = {
    "state": "Telangana",
    "course": "B.Tech",
    "education_level": "Graduation",
    "annual_income": None,
    "category": None,
    "gender": "Male"
}
s3_results = engine.match_all(s3_profile)
print(f"More info needed count: {s3_results['summary']['more_info_needed_count']}")
print(f"Missing fields detected: {s3_results['summary']['missing_fields']}")
assert "annual_income" in s3_results['summary']['missing_fields'], "Income must be in missing fields"
assert "category" in s3_results['summary']['missing_fields'], "Category must be in missing fields"
assert s3_results['summary']['more_info_needed_count'] >= 1, "Must have schemes needing information"

print("\n=== SCENARIO C: Does not match & Bridge the Gap ===")
# Fictional female student in Telangana whose income (₹3.5L) exceeds ePASS BC urban limit (₹2.0L),
# but qualifies for AICTE Pragati (limit ₹8.0L) or Central Sector CSSS (limit ₹4.5L).
s2_profile = {
    "state": "Telangana",
    "course": "B.Tech",
    "education_level": "Graduation",
    "annual_income": 350000,
    "category": "BC",
    "gender": "Female",
    "locality": "urban"
}
s2_results = engine.match_all(s2_profile)
print(f"Doesn't match count: {s2_results['summary']['doesnt_match_count']}")
epass_doesnt_match = any(u['scheme']['id'] == 'telangana-epass-postmatric' for u in s2_results['doesnt_match'])
print(f"ePASS marked as Doesn't match: {epass_doesnt_match}")
assert epass_doesnt_match, "ePASS must fail for income ₹3.5L"

# Check Bridge the Gap alternatives for ePASS
alternatives_res = bridge.find_alternatives_for_failed_scheme("telangana-epass-postmatric", s2_profile)
print(f"Bridge the Gap alternatives count: {len(alternatives_res['alternatives'])}")
for alt in alternatives_res['alternatives']:
    print(f"  -> Viable Alternative: {alt['scheme_name']}")
assert len(alternatives_res['alternatives']) >= 1, "Must find viable alternatives for Scenario C"

print("\n=== SCENARIO D: Inconsistent / Boundary Handling ===")
# Male student applying to female-only scheme (AICTE Pragati)
s4_profile = {
    "state": "Telangana",
    "course": "B.Tech",
    "education_level": "Graduation",
    "annual_income": 150000,
    "category": "General",
    "gender": "Male"
}
s4_results = engine.match_all(s4_profile)
pragati_eval = next((r for r in s4_results["all_results"] if r["scheme"]["id"] == "aicte-pragati-girls"), None)
assert pragati_eval is not None
assert pragati_eval["overall_assessment"] == ASSESSMENT_DOESNT_MATCH
gender_crit = next((c for c in pragati_eval["criteria"] if c["name"] == "gender"), None)
assert gender_crit is not None and gender_crit["status"] == "Not satisfied"
print(f"Pragati correctly marked Doesn't match for Male applicant: {gender_crit['explanation']}")

print("\nALL SCENARIOS A, B, C, D VERIFIED AND PASSED!")
