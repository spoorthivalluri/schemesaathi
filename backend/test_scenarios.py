"""
Verification Test for SchemeSaathi's 3 Judge Demonstration Scenarios
"""
from engine.eligibility import EligibilityEngine
from engine.alternatives import BridgeTheGapEngine

engine = EligibilityEngine()
bridge = BridgeTheGapEngine(engine)

print("=== SCENARIO 1: Potential Match ===")
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
print(f"Potential matches: {s1_results['summary']['potential_matches_count']}")
for m in s1_results["potential_matches"]:
    print(f"  -> Match: {m['scheme']['name']}")
assert s1_results['summary']['potential_matches_count'] >= 1, "Scenario 1 must have at least 1 potential match"

print("\n=== SCENARIO 2: Known Failed Requirement & Bridge the Gap ===")
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
print(f"Unmet schemes count: {s2_results['summary']['unmet_count']}")
epass_unmet = any(u['scheme']['id'] == 'telangana-epass-postmatric' for u in s2_results['unmet'])
print(f"ePASS marked as Unmet: {epass_unmet}")
assert epass_unmet, "ePASS must fail for income ₹3.5L"

# Check Bridge the Gap alternatives for ePASS
alternatives_res = bridge.find_alternatives_for_failed_scheme("telangana-epass-postmatric", s2_profile)
print(f"Bridge the Gap alternatives count: {len(alternatives_res['alternatives'])}")
for alt in alternatives_res['alternatives']:
    print(f"  -> Viable Alternative: {alt['scheme_name']} ({alt['relevance_explanation']})")
assert len(alternatives_res['alternatives']) >= 1, "Must find viable alternatives for Scenario 2"

print("\n=== SCENARIO 3: Missing Information ===")
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
print(f"Needs Info count: {s3_results['summary']['needs_info_count']}")
print(f"Missing fields detected: {s3_results['summary']['missing_fields']}")
assert "annual_income" in s3_results['summary']['missing_fields'], "Income must be in missing fields"
assert "category" in s3_results['summary']['missing_fields'], "Category must be in missing fields"

print("\n ALL 3 DEMONSTRATION SCENARIOS VERIFIED SUCCESSFULLY!")
