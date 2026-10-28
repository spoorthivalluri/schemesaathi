"""
Bridge the Gap Alternative Recommendations Engine
Uses the deterministic EligibilityEngine to discover viable alternative schemes
when a candidate scheme fails a verified mandatory criterion.
"""
from typing import Dict, Any, List, Optional
from .eligibility import (
    EligibilityEngine,
    STATUS_NOT_SATISFIED,
    STATUS_SATISFIED,
    STATUS_NEEDS_INFO,
    ASSESSMENT_POTENTIAL_MATCH,
    ASSESSMENT_NEEDS_INFO,
    ASSESSMENT_UNMET
)

class BridgeTheGapEngine:
    def __init__(self, eligibility_engine: Optional[EligibilityEngine] = None):
        self.engine = eligibility_engine or EligibilityEngine()

    def find_alternatives_for_failed_scheme(
        self,
        failed_scheme_id: str,
        profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Analyzes why a specific scheme failed and evaluates remaining schemes in the dataset
        for compatible known criteria.
        """
        # Find failed scheme
        failed_scheme_record = next((s for s in self.engine.schemes if s["id"] == failed_scheme_id), None)
        if not failed_scheme_record:
            return {"error": f"Scheme '{failed_scheme_id}' not found."}

        # Evaluate the failed scheme
        failed_evaluation = self.engine.evaluate_scheme(failed_scheme_record, profile)
        failed_criteria = [
            c for c in failed_evaluation["criteria"]
            if c["status"] == STATUS_NOT_SATISFIED and c["is_mandatory"]
        ]

        # Evaluate all other schemes using the exact same eligibility engine
        alternatives = []
        for scheme in self.engine.schemes:
            if scheme["id"] == failed_scheme_id:
                continue

            evaluation = self.engine.evaluate_scheme(scheme, profile)
            # If the scheme is a potential match or needs info (but has NO failed mandatory criteria)
            # Or if it specifically resolves the exact failed criterion (e.g. higher income ceiling)
            has_failed_criteria = any(
                c["status"] == STATUS_NOT_SATISFIED and c["is_mandatory"]
                for c in evaluation["criteria"]
            )

            # Analyze why it's a potential alternative
            satisfied_reasons = [
                f"{c['label']}: {c['explanation']}"
                for c in evaluation["criteria"]
                if c["status"] == STATUS_SATISFIED
            ]
            unknown_conditions = [
                f"{c['label']}: {c['requirement']}"
                for c in evaluation["criteria"]
                if c["status"] == STATUS_NEEDS_INFO
            ]

            relevance_note = ""
            is_viable_alternative = False

            # Check if this scheme offers relief for the failed criteria
            for fc in failed_criteria:
                if fc["name"] == "income":
                    other_limit = scheme.get("income_limit", 0)
                    user_inc = profile.get("annual_income")
                    if user_inc is not None and user_inc <= other_limit:
                        relevance_note = f"Offers higher verified family income ceiling of ₹{other_limit:,} p.a. (your income is ₹{user_inc:,})."
                        is_viable_alternative = True
                elif fc["name"] == "gender":
                    if scheme.get("gender_requirement", "Any") == "Any":
                        relevance_note = "Scheme is open to all genders without gender restrictions."
                        is_viable_alternative = True
                elif fc["name"] == "state_domicile":
                    if "All India" in scheme.get("eligible_states", []):
                        relevance_note = "Centrally sponsored national scheme open across all Indian states."
                        is_viable_alternative = True

            # If it's a clean potential match overall
            if evaluation["overall_assessment"] == ASSESSMENT_POTENTIAL_MATCH:
                is_viable_alternative = True
                if not relevance_note:
                    relevance_note = "Your reported profile satisfies all mandatory requirements for this scheme."
            elif evaluation["overall_assessment"] == ASSESSMENT_NEEDS_INFO and not has_failed_criteria:
                is_viable_alternative = True
                if not relevance_note:
                    relevance_note = "No disqualifying criteria found; additional documentation/information required."

            if is_viable_alternative:
                alternatives.append({
                    "scheme_id": scheme["id"],
                    "scheme_name": scheme["name"],
                    "administering_authority": scheme.get("administering_authority"),
                    "assessment": evaluation["overall_assessment"],
                    "assessment_label": evaluation["overall_label"],
                    "relevance_explanation": relevance_note,
                    "satisfied_criteria": satisfied_reasons,
                    "unknown_conditions": unknown_conditions,
                    "source_title": scheme.get("source_title"),
                    "source_url": scheme.get("source_url"),
                    "source_excerpt": scheme.get("source_excerpt"),
                    "application_url": scheme.get("application_url"),
                    "required_documents": scheme.get("required_documents", [])
                })

        # Master prompt fallback requirement:
        # If no alternative is found in the limited dataset, state exactly:
        fallback_message = "No suitable alternative was identified in the schemes currently available in SchemeSaathi. This does not mean you are ineligible for every government scheme."

        return {
            "failed_scheme": {
                "id": failed_scheme_record["id"],
                "name": failed_scheme_record["name"],
                "failed_criteria": failed_criteria,
                "source_title": failed_scheme_record.get("source_title"),
                "source_url": failed_scheme_record.get("source_url"),
                "source_excerpt": failed_scheme_record.get("source_excerpt")
            },
            "alternatives": alternatives,
            "has_alternatives": len(alternatives) > 0,
            "fallback_message": fallback_message if len(alternatives) == 0 else None
        }
