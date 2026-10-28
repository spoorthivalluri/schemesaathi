"""
Profile Extractor
Extracts structured eligibility attributes from natural-language descriptions
using the configured open-weight model, with deterministic fallback regex parsing.
Always flags extracted values for explicit user confirmation.
"""
import re
import json
from typing import Dict, Any, Optional
from .model_client import OpenWeightAIClient

EXTRACTION_SYSTEM_PROMPT = """You are SchemeSaathi's Profile Extraction Assistant.
Extract the user's circumstances into valid JSON without any markdown formatting or surrounding text.
Extract ONLY these keys:
- "state": string (e.g. "Telangana", "Andhra Pradesh", null if unknown)
- "education_level": string (e.g. "Graduation", "Post-Graduation", "Intermediate", "Diploma", null if unknown)
- "course": string (e.g. "B.Tech", "MBBS", "Degree", "MS", "MBA", null if unknown)
- "annual_income": integer in Indian Rupees (e.g. 180000 for 1.8 lakh; null if unknown)
- "category": string (e.g. "General", "OBC", "BC", "SC", "ST", "EBC", "Minority", null if unknown)
- "gender": string ("Female", "Male", "Other", null if unknown)
- "age": integer or null
- "locality": string ("rural", "urban", null if unknown)

If an attribute is not mentioned, use null. NEVER invent values."""

class ProfileExtractor:
    def __init__(self, ai_client: Optional[OpenWeightAIClient] = None):
        self.ai_client = ai_client or OpenWeightAIClient()

    def parse(self, text: str) -> Dict[str, Any]:
        """
        Parses freeform text into structured fields.
        Returns extracted profile, confidence/source info, and fields needing user confirmation.
        """
        clean_text = text.strip()
        if not clean_text:
            return {
                "profile": {},
                "extracted_by": "empty_input",
                "is_live_ai": False,
                "notes": "No text provided."
            }

        # 1. Try Live Open-Weight Model
        model_res = self.ai_client.generate_chat(
            system_prompt=EXTRACTION_SYSTEM_PROMPT,
            user_prompt=f"Extract user profile from: '{clean_text}'",
            temperature=0.1,
            max_tokens=300
        )

        extracted_profile = None
        is_live = model_res.get("is_live_ai", False)

        if is_live and model_res.get("text"):
            try:
                # Strip any accidental markdown blocks
                raw_text = model_res["text"].strip()
                raw_text = re.sub(r"^```json\s*", "", raw_text)
                raw_text = re.sub(r"^```\s*", "", raw_text)
                raw_text = re.sub(r"```$", "", raw_text).strip()
                extracted_profile = json.loads(raw_text)
            except Exception as e:
                extracted_profile = None

        # 2. Heuristic Regex Fallback (deterministic parser)
        fallback_used = False
        if not extracted_profile:
            extracted_profile = self._heuristic_extract(clean_text)
            fallback_used = True

        # Clean and validate types
        validated_profile = self._validate_and_sanitize(extracted_profile)

        return {
            "profile": validated_profile,
            "raw_text": clean_text,
            "is_live_ai": is_live and not fallback_used,
            "extraction_method": f"Open-Weight Model ({model_res.get('model')})" if (is_live and not fallback_used) else "Deterministic Rule-Grounded Parser (Offline Fallback)",
            "verification_notice": "Please verify all extracted fields below before proceeding with scheme search."
        }

    def _heuristic_extract(self, text: str) -> Dict[str, Any]:
        lower = text.lower()
        profile: Dict[str, Any] = {
            "state": None,
            "education_level": None,
            "course": None,
            "annual_income": None,
            "category": None,
            "gender": None,
            "age": None,
            "locality": None
        }

        # State extraction
        if "telangana" in lower:
            profile["state"] = "Telangana"
        elif "andhra" in lower:
            profile["state"] = "Andhra Pradesh"
        elif "karnataka" in lower:
            profile["state"] = "Karnataka"
        elif "maharashtra" in lower:
            profile["state"] = "Maharashtra"
        elif "delhi" in lower:
            profile["state"] = "Delhi"

        # Course extraction
        if "b.tech" in lower or "btech" in lower or "b.e" in lower or "engineering" in lower:
            profile["course"] = "B.Tech"
            profile["education_level"] = "Graduation"
        elif "mbbs" in lower or "medical" in lower:
            profile["course"] = "MBBS"
            profile["education_level"] = "Graduation"
        elif "mba" in lower:
            profile["course"] = "MBA"
            profile["education_level"] = "Post-Graduation"
        elif "m.tech" in lower or "mtech" in lower or "ms" in lower or "master" in lower:
            profile["course"] = "Master's Degree"
            profile["education_level"] = "Post-Graduation"
        elif "diploma" in lower or "polytechnic" in lower:
            profile["course"] = "Diploma"
            profile["education_level"] = "Diploma"
        elif "degree" in lower or "b.sc" in lower or "b.com" in lower or "b.a" in lower:
            profile["course"] = "Degree"
            profile["education_level"] = "Graduation"

        # Income extraction
        # e.g., 1.8 lakh, 1.8L, 2 lakh, 150000, 1,80,000, ₹1.8 lakh
        lakh_match = re.search(r'(?:rs\.?|₹|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lacs|lakhs|l)', lower)
        num_match = re.search(r'(?:rs\.?|₹|inr)?\s*(\d{1,2}(?:,\d{2})*,\d{3}|\d{5,7})', lower)

        if lakh_match:
            try:
                val = float(lakh_match.group(1))
                profile["annual_income"] = int(val * 100000)
            except ValueError:
                pass
        elif num_match:
            try:
                val_str = num_match.group(1).replace(",", "")
                profile["annual_income"] = int(val_str)
            except ValueError:
                pass

        # Category extraction
        if " sc " in f" {lower} " or "scheduled caste" in lower:
            profile["category"] = "SC"
        elif " st " in f" {lower} " or "scheduled tribe" in lower:
            profile["category"] = "ST"
        elif " bc " in f" {lower} " or "backward class" in lower:
            profile["category"] = "BC"
        elif " obc " in f" {lower} ":
            profile["category"] = "OBC"
        elif " ebc " in f" {lower} ":
            profile["category"] = "EBC"
        elif " minority " in f" {lower} " or "muslim" in lower or "christian" in lower:
            profile["category"] = "Minority"
        elif " general " in f" {lower} " or " oc " in f" {lower} ":
            profile["category"] = "General"

        # Gender extraction
        if "female" in lower or "girl" in lower or "woman" in lower or "daughter" in lower:
            profile["gender"] = "Female"
        elif "male" in lower or "boy" in lower or "son" in lower:
            profile["gender"] = "Male"

        # Age extraction
        age_match = re.search(r'(\d{1,2})\s*(?:years|yrs|year old|yr old)', lower)
        if age_match:
            try:
                profile["age"] = int(age_match.group(1))
            except ValueError:
                pass

        # Locality extraction
        if "rural" in lower or "village" in lower:
            profile["locality"] = "rural"
        elif "urban" in lower or "city" in lower or "town" in lower:
            profile["locality"] = "urban"

        return profile

    def _validate_and_sanitize(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        sanitized = {}
        # Annual Income
        income = profile.get("annual_income")
        if income is not None:
            try:
                sanitized["annual_income"] = int(income)
            except (ValueError, TypeError):
                sanitized["annual_income"] = None
        else:
            sanitized["annual_income"] = None

        # Age
        age = profile.get("age")
        if age is not None:
            try:
                sanitized["age"] = int(age)
            except (ValueError, TypeError):
                sanitized["age"] = None
        else:
            sanitized["age"] = None

        sanitized["state"] = profile.get("state") or None
        sanitized["education_level"] = profile.get("education_level") or None
        sanitized["course"] = profile.get("course") or None
        sanitized["category"] = profile.get("category") or None
        sanitized["gender"] = profile.get("gender") or None
        sanitized["locality"] = profile.get("locality") or "urban"

        return sanitized
