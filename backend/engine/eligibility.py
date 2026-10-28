"""
SchemeSaathi Deterministic Eligibility Engine
Strictly evaluates a user profile against official verified scheme criteria.
Statuses: 'Satisfied', 'Not satisfied', 'Needs information', 'Not applicable'
Overall Scheme Assessment: 'potential_match', 'unmet', 'needs_information'
"""
from typing import Dict, Any, List, Optional
import json
import os

STATUS_SATISFIED = "Satisfied"
STATUS_NOT_SATISFIED = "Not satisfied"
STATUS_NEEDS_INFO = "Needs information"
STATUS_NOT_APPLICABLE = "Not applicable"

ASSESSMENT_POTENTIAL_MATCH = "potential_match"
ASSESSMENT_UNMET = "unmet"
ASSESSMENT_NEEDS_INFO = "needs_information"


class EligibilityEngine:
    def __init__(self, schemes_file_path: Optional[str] = None):
        if not schemes_file_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            schemes_file_path = os.path.join(base_dir, "data", "schemes.json")
        self.schemes_file_path = schemes_file_path
        self.schemes = self.load_schemes()

    def load_schemes(self) -> List[Dict[str, Any]]:
        with open(self.schemes_file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def evaluate_criterion(
        self,
        name: str,
        label: str,
        status: str,
        requirement: str,
        user_value: str,
        explanation: str,
        source_title: str,
        source_excerpt: str,
        is_mandatory: bool = True
    ) -> Dict[str, Any]:
        return {
            "name": name,
            "label": label,
            "status": status,
            "requirement": requirement,
            "user_value": user_value,
            "explanation": explanation,
            "source_title": source_title,
            "source_excerpt": source_excerpt,
            "is_mandatory": is_mandatory
        }

    def evaluate_scheme(self, scheme: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
        criteria: List[Dict[str, Any]] = []
        source_title = scheme.get("source_title", "Official Scheme Document")
        source_excerpt = scheme.get("source_excerpt", "")

        # 1. State / Domicile Check
        user_state = profile.get("state")
        eligible_states = scheme.get("eligible_states", ["All India"])
        is_national = "All India" in eligible_states

        if is_national:
            criteria.append(self.evaluate_criterion(
                name="state_domicile",
                label="Geographic Domicile",
                status=STATUS_SATISFIED,
                requirement="Open to eligible citizens across All India",
                user_value=str(user_state) if user_state else "Not specified (National scheme applies)",
                explanation="This scheme is centrally administered and open nationwide.",
                source_title=source_title,
                source_excerpt=f"Scope: {scheme.get('geographic_scope', 'National')}"
            ))
        elif not user_state:
            criteria.append(self.evaluate_criterion(
                name="state_domicile",
                label="State Domicile",
                status=STATUS_NEEDS_INFO,
                requirement=f"Must be a bonafide resident/domicile of {', '.join(eligible_states)}",
                user_value="Missing in profile",
                explanation=f"Please provide your state of residence to confirm eligibility for {scheme.get('name')}.",
                source_title=source_title,
                source_excerpt=source_excerpt
            ))
        elif user_state in eligible_states:
            criteria.append(self.evaluate_criterion(
                name="state_domicile",
                label="State Domicile",
                status=STATUS_SATISFIED,
                requirement=f"Must be a resident/domicile of {', '.join(eligible_states)}",
                user_value=user_state,
                explanation=f"Your stated state ({user_state}) matches the required state domicile.",
                source_title=source_title,
                source_excerpt=source_excerpt
            ))
        else:
            criteria.append(self.evaluate_criterion(
                name="state_domicile",
                label="State Domicile",
                status=STATUS_NOT_SATISFIED,
                requirement=f"Must be a resident/domicile of {', '.join(eligible_states)}",
                user_value=user_state,
                explanation=f"Your stated state ({user_state}) does not match the required state ({', '.join(eligible_states)}).",
                source_title=source_title,
                source_excerpt=source_excerpt
            ))

        # 2. Gender Check
        gender_req = scheme.get("gender_requirement", "Any")
        user_gender = profile.get("gender")

        if gender_req != "Any":
            if not user_gender:
                criteria.append(self.evaluate_criterion(
                    name="gender",
                    label="Gender Eligibility",
                    status=STATUS_NEEDS_INFO,
                    requirement=f"Scheme is designated exclusively for {gender_req} students",
                    user_value="Missing in profile",
                    explanation=f"Please confirm your gender to verify if you qualify for this {gender_req}-specific scheme.",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))
            elif user_gender.lower() == gender_req.lower():
                criteria.append(self.evaluate_criterion(
                    name="gender",
                    label="Gender Eligibility",
                    status=STATUS_SATISFIED,
                    requirement=f"Scheme is designated for {gender_req} students",
                    user_value=user_gender,
                    explanation=f"Applicant identified as {user_gender}, satisfying the scheme requirement.",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))
            else:
                criteria.append(self.evaluate_criterion(
                    name="gender",
                    label="Gender Eligibility",
                    status=STATUS_NOT_SATISFIED,
                    requirement=f"Scheme is designated exclusively for {gender_req} students",
                    user_value=user_gender,
                    explanation=f"Applicant identified as {user_gender}. This scholarship is legally reserved for {gender_req} applicants.",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))
        else:
            criteria.append(self.evaluate_criterion(
                name="gender",
                label="Gender Eligibility",
                status=STATUS_SATISFIED,
                requirement="Open to all genders",
                user_value=user_gender or "Any gender",
                explanation="No gender restrictions specified for this scheme.",
                source_title=source_title,
                source_excerpt="Open to all students meeting academic and income conditions.",
                is_mandatory=False
            ))

        # 3. Social / Caste Category Check
        scheme_categories = scheme.get("eligible_categories", [])
        user_category = profile.get("category")

        if not user_category:
            criteria.append(self.evaluate_criterion(
                name="category",
                label="Social Category / Caste",
                status=STATUS_NEEDS_INFO,
                requirement=f"Eligible categories: {', '.join(scheme_categories)}",
                user_value="Missing in profile",
                explanation=f"Government scholarships often have specific category allocations. Please specify your category ({', '.join(scheme_categories)}).",
                source_title=source_title,
                source_excerpt=source_excerpt
            ))
        else:
            cat_match = any(user_category.upper() == c.upper() or (user_category.upper() == "OBC" and c.upper() == "BC") for c in scheme_categories)
            if cat_match:
                criteria.append(self.evaluate_criterion(
                    name="category",
                    label="Social Category / Caste",
                    status=STATUS_SATISFIED,
                    requirement=f"Eligible categories: {', '.join(scheme_categories)}",
                    user_value=user_category,
                    explanation=f"Your category ({user_category}) is among the verified eligible beneficiary categories.",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))
            else:
                criteria.append(self.evaluate_criterion(
                    name="category",
                    label="Social Category / Caste",
                    status=STATUS_NOT_SATISFIED,
                    requirement=f"Eligible categories: {', '.join(scheme_categories)}",
                    user_value=user_category,
                    explanation=f"Your stated category ({user_category}) is not included in this scheme's target beneficiary categories ({', '.join(scheme_categories)}).",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))

        # 4. Income Check (Deterministic threshold comparison)
        user_income = profile.get("annual_income")
        scheme_id = scheme.get("id")

        if user_income is None:
            criteria.append(self.evaluate_criterion(
                name="income",
                label="Annual Family Income",
                status=STATUS_NEEDS_INFO,
                requirement=scheme.get("income_rule_description", f"Income ceiling: ₹{scheme.get('income_limit', 0):,} p.a."),
                user_value="Missing in profile",
                explanation="Annual parental/family income is a mandatory criterion. Please provide your annual family income.",
                source_title=source_title,
                source_excerpt=source_excerpt
            ))
        else:
            # Determine specific limit based on category or locality
            applicable_limit = scheme.get("income_limit", 0)
            locality = profile.get("locality", "urban").lower()  # default to urban if unknown or check

            if scheme_id == "telangana-epass-postmatric" and user_category:
                cat_upper = user_category.upper()
                if cat_upper in ["SC", "ST"]:
                    applicable_limit = 200000
                elif cat_upper in ["BC", "EBC", "MINORITY", "OBC"]:
                    if locality == "rural":
                        applicable_limit = 150000
                    else:
                        applicable_limit = 200000
                elif cat_upper in ["DISABLED", "DIFFERENTLY ABLED"]:
                    applicable_limit = 100000

            if user_income <= applicable_limit:
                criteria.append(self.evaluate_criterion(
                    name="income",
                    label="Annual Family Income",
                    status=STATUS_SATISFIED,
                    requirement=f"Maximum allowed income is ₹{applicable_limit:,} p.a. ({scheme.get('income_rule_description')})",
                    user_value=f"₹{user_income:,}",
                    explanation=f"Stated income of ₹{user_income:,} is within the threshold limit of ₹{applicable_limit:,}.",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))
            else:
                criteria.append(self.evaluate_criterion(
                    name="income",
                    label="Annual Family Income",
                    status=STATUS_NOT_SATISFIED,
                    requirement=f"Maximum allowed income is ₹{applicable_limit:,} p.a. ({scheme.get('income_rule_description')})",
                    user_value=f"₹{user_income:,}",
                    explanation=f"Stated income of ₹{user_income:,} exceeds the statutory ceiling of ₹{applicable_limit:,} by ₹{user_income - applicable_limit:,}.",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))

        # 5. Course and Education Level Check
        user_course = profile.get("course")
        user_level = profile.get("education_level")
        eligible_courses = scheme.get("eligible_courses", [])
        eligible_levels = scheme.get("eligible_education_levels", [])

        if not user_course and not user_level:
            criteria.append(self.evaluate_criterion(
                name="course_level",
                label="Course & Education Level",
                status=STATUS_NEEDS_INFO,
                requirement=f"Eligible levels: {', '.join(eligible_levels)}. Examples: {', '.join(eligible_courses[:4])}",
                user_value="Missing in profile",
                explanation="Please provide your current course (e.g. B.Tech, Degree, MS) to evaluate academic eligibility.",
                source_title=source_title,
                source_excerpt=source_excerpt
            ))
        else:
            # Check course compatibility
            course_matched = False
            if user_course:
                course_norm = user_course.lower().replace(".", "").replace(" ", "")
                for ec in eligible_courses:
                    ec_norm = ec.lower().replace(".", "").replace(" ", "")
                    if ec_norm in course_norm or course_norm in ec_norm:
                        course_matched = True
                        break
            
            level_matched = False
            if user_level:
                for el in eligible_levels:
                    if el.lower() in user_level.lower() or user_level.lower() in el.lower():
                        level_matched = True
                        break

            # If user course or level matches
            if course_matched or level_matched:
                criteria.append(self.evaluate_criterion(
                    name="course_level",
                    label="Course & Education Level",
                    status=STATUS_SATISFIED,
                    requirement=f"Eligible courses include: {', '.join(eligible_courses[:5])}...",
                    user_value=f"{user_course or ''} ({user_level or 'Specified'})".strip(),
                    explanation=f"Your course/level ({user_course or user_level}) is eligible under this scheme's guidelines.",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))
            else:
                criteria.append(self.evaluate_criterion(
                    name="course_level",
                    label="Course & Education Level",
                    status=STATUS_NOT_SATISFIED,
                    requirement=f"Eligible courses: {', '.join(eligible_courses[:5])}",
                    user_value=f"{user_course or ''} ({user_level or ''})".strip(),
                    explanation=f"Your course ({user_course or user_level}) is not listed in this scheme's approved courses.",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))

        # 6. Age Check (if scheme has age limit)
        max_age = scheme.get("maximum_age")
        min_age = scheme.get("minimum_age")
        user_age = profile.get("age")

        if max_age is not None or min_age is not None:
            if user_age is None:
                criteria.append(self.evaluate_criterion(
                    name="age",
                    label="Age Requirement",
                    status=STATUS_NEEDS_INFO,
                    requirement=f"Age limit: {'up to ' + str(max_age) if max_age else ''} {'min ' + str(min_age) if min_age else ''}",
                    user_value="Missing in profile",
                    explanation=f"Please state your age to verify compliance with the {'max ' + str(max_age) + ' years' if max_age else ''} rule.",
                    source_title=source_title,
                    source_excerpt=source_excerpt
                ))
            else:
                age_ok = True
                if max_age is not None and user_age > max_age:
                    age_ok = False
                if min_age is not None and user_age < min_age:
                    age_ok = False
                
                if age_ok:
                    criteria.append(self.evaluate_criterion(
                        name="age",
                        label="Age Requirement",
                        status=STATUS_SATISFIED,
                        requirement=f"Age limit: {'up to ' + str(max_age) + ' years' if max_age else ''}",
                        user_value=f"{user_age} years",
                        explanation=f"Your age ({user_age} years) is within the eligible age bracket.",
                        source_title=source_title,
                        source_excerpt=source_excerpt
                    ))
                else:
                    criteria.append(self.evaluate_criterion(
                        name="age",
                        label="Age Requirement",
                        status=STATUS_NOT_SATISFIED,
                        requirement=f"Age limit: {'up to ' + str(max_age) + ' years' if max_age else ''}",
                        user_value=f"{user_age} years",
                        explanation=f"Your age ({user_age} years) exceeds the maximum age limit of {max_age} years.",
                        source_title=source_title,
                        source_excerpt=source_excerpt
                    ))

        # 7. Additional Scheme-Specific Conditions Flag
        other_criteria = scheme.get("other_mandatory_criteria", [])
        if other_criteria:
            criteria.append(self.evaluate_criterion(
                name="institutional_academic",
                label="Institutional & Operational Terms",
                status=STATUS_NEEDS_INFO,
                requirement=f"Requires: {'; '.join(other_criteria[:2])}",
                user_value="Verification required with institution",
                explanation=f"Final sanction depends on administrative verification: {'; '.join(other_criteria)}",
                source_title=source_title,
                source_excerpt=scheme.get("academic_requirements", ""),
                is_mandatory=False
            ))

        # Overall Status Calculation
        # Rule 1: A failed mandatory criterion must not be hidden. Any mandatory NOT_SATISFIED => UNMET
        # Rule 2: Missing mandatory information => NEEDS_INFO
        # Rule 3: All mandatory criteria SATISFIED => POTENTIAL_MATCH
        has_failed_mandatory = any(
            c["status"] == STATUS_NOT_SATISFIED and c["is_mandatory"] for c in criteria
        )
        has_missing_mandatory = any(
            c["status"] == STATUS_NEEDS_INFO and c["is_mandatory"] for c in criteria
        )

        if has_failed_mandatory:
            overall_assessment = ASSESSMENT_UNMET
            overall_label = "A requirement appears unmet"
            reason_summary = "One or more verified mandatory requirements are not satisfied based on your profile."
        elif has_missing_mandatory:
            overall_assessment = ASSESSMENT_NEEDS_INFO
            overall_label = "More information required"
            reason_summary = "Key profile details (such as income, state, or course) are required to complete verification."
        else:
            overall_assessment = ASSESSMENT_POTENTIAL_MATCH
            overall_label = "Potential match"
            reason_summary = "All evaluated mandatory criteria appear satisfied based on your provided information."

        return {
            "scheme": scheme,
            "overall_assessment": overall_assessment,
            "overall_label": overall_label,
            "reason_summary": reason_summary,
            "criteria": criteria,
            "verified_documents": scheme.get("required_documents", []),
            "application_steps": scheme.get("application_steps", []),
            "source_url": scheme.get("source_url", ""),
            "source_title": scheme.get("source_title", ""),
            "source_excerpt": source_excerpt,
            "application_url": scheme.get("application_url", ""),
            "last_verified": scheme.get("last_verified", "")
        }

    def match_all(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        results = []
        for scheme in self.schemes:
            res = self.evaluate_scheme(scheme, profile)
            results.append(res)

        potential_matches = [r for r in results if r["overall_assessment"] == ASSESSMENT_POTENTIAL_MATCH]
        needs_info = [r for r in results if r["overall_assessment"] == ASSESSMENT_NEEDS_INFO]
        unmet = [r for r in results if r["overall_assessment"] == ASSESSMENT_UNMET]

        # Extract missing fields across all schemes
        missing_fields = set()
        if not profile.get("state"):
            missing_fields.add("state")
        if profile.get("annual_income") is None:
            missing_fields.add("annual_income")
        if not profile.get("category"):
            missing_fields.add("category")
        if not profile.get("course"):
            missing_fields.add("course")
        if not profile.get("gender"):
            missing_fields.add("gender")

        return {
            "summary": {
                "total_schemes": len(self.schemes),
                "potential_matches_count": len(potential_matches),
                "needs_info_count": len(needs_info),
                "unmet_count": len(unmet),
                "missing_fields": list(missing_fields)
            },
            "potential_matches": potential_matches,
            "needs_info": needs_info,
            "unmet": unmet,
            "all_results": results
        }
