"""
SchemeSaathi FastAPI Main Application
Evidence-Based, Voice-Enabled Government Scheme Discovery Assistant
"""
import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from engine.eligibility import EligibilityEngine
from engine.alternatives import BridgeTheGapEngine
from engine.checklist import build_action_checklist
from ai.model_client import OpenWeightAIClient
from ai.profile_extractor import ProfileExtractor
from ai.explainer import SchemeExplainer

app = FastAPI(
    title="SchemeSaathi API",
    description="Evidence-Based, Voice-Enabled Government Scheme Discovery Assistant",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
eligibility_engine = EligibilityEngine()
bridge_engine = BridgeTheGapEngine(eligibility_engine)
ai_client = OpenWeightAIClient()
profile_extractor = ProfileExtractor(ai_client)
scheme_explainer = SchemeExplainer(ai_client)


# --- Pydantic Request / Response Models ---

class UserProfile(BaseModel):
    state: Optional[str] = Field(None, description="State of domicile (e.g. Telangana)")
    age: Optional[int] = Field(None, description="Age in years")
    education_level: Optional[str] = Field(None, description="Education level (e.g. Graduation)")
    course: Optional[str] = Field(None, description="Specific course name (e.g. B.Tech)")
    annual_income: Optional[int] = Field(None, description="Gross family annual income in INR")
    category: Optional[str] = Field(None, description="Social category (General, OBC, BC, SC, ST, EWS, Minority)")
    gender: Optional[str] = Field(None, description="Gender (Female, Male, Other)")
    locality: Optional[str] = Field("urban", description="Rural or Urban")

class NaturalLanguageProfileRequest(BaseModel):
    text: str = Field(..., description="Natural language description of user circumstances")

class SchemeExplainRequest(BaseModel):
    scheme_id: str
    profile: UserProfile

class FollowupQuestionRequest(BaseModel):
    scheme_id: str
    question: str
    profile: UserProfile

class BridgeTheGapRequest(BaseModel):
    scheme_id: str
    profile: UserProfile


# --- API Routes ---

@app.get("/api/health")
def get_health():
    """Returns application health status and live AI model connection status."""
    ai_status = ai_client.get_status()
    return {
        "status": "healthy",
        "service": "SchemeSaathi Core API",
        "version": "1.0.0",
        "schemes_loaded": len(eligibility_engine.schemes),
        "ai_model": ai_status
    }

@app.get("/api/schemes")
def get_schemes():
    """Returns all curated scheme records with verification metadata."""
    return {
        "count": len(eligibility_engine.schemes),
        "schemes": eligibility_engine.schemes
    }

@app.post("/api/match")
def match_profile(profile: UserProfile):
    """
    Deterministically evaluates user profile against all verified schemes.
    Returns potential matches, unmet requirements, and needed information.
    """
    profile_dict = profile.model_dump()
    results = eligibility_engine.match_all(profile_dict)
    return results

@app.post("/api/parse-profile")
def parse_profile(req: NaturalLanguageProfileRequest):
    """
    Converts a natural language description into structured fields
    using the open-weight language model (or deterministic fallback),
    ready for user review and confirmation.
    """
    parsed = profile_extractor.parse(req.text)
    return parsed

@app.post("/api/explain")
def explain_scheme(req: SchemeExplainRequest):
    """
    Generates a source-grounded explanation for a selected scheme evaluation.
    """
    scheme_record = next((s for s in eligibility_engine.schemes if s["id"] == req.scheme_id), None)
    if not scheme_record:
        raise HTTPException(status_code=404, detail="Scheme not found")

    profile_dict = req.profile.model_dump()
    evaluation = eligibility_engine.evaluate_scheme(scheme_record, profile_dict)
    explanation = scheme_explainer.generate_scheme_explanation(evaluation, profile_dict)
    return explanation

@app.post("/api/alternatives")
def get_alternatives(req: BridgeTheGapRequest):
    """
    Feature C: 'Bridge the Gap'
    Finds verified alternatives when a scheme has a failed mandatory criterion.
    """
    profile_dict = req.profile.model_dump()
    alternatives = bridge_engine.find_alternatives_for_failed_scheme(req.scheme_id, profile_dict)
    return alternatives

@app.post("/api/checklist")
def get_checklist(req: SchemeExplainRequest):
    """
    Feature D: One-Click Action Checklist
    Returns source-grounded documents, verification checks, and application steps.
    """
    scheme_record = next((s for s in eligibility_engine.schemes if s["id"] == req.scheme_id), None)
    if not scheme_record:
        raise HTTPException(status_code=404, detail="Scheme not found")

    profile_dict = req.profile.model_dump()
    evaluation = eligibility_engine.evaluate_scheme(scheme_record, profile_dict)
    checklist = build_action_checklist(evaluation)
    return checklist

@app.post("/api/chat")
def answer_followup_question(req: FollowupQuestionRequest):
    """
    Grounds user follow-up questions strictly in official scheme documentation.
    """
    scheme_record = next((s for s in eligibility_engine.schemes if s["id"] == req.scheme_id), None)
    if not scheme_record:
        raise HTTPException(status_code=404, detail="Scheme not found")

    profile_dict = req.profile.model_dump()
    evaluation = eligibility_engine.evaluate_scheme(scheme_record, profile_dict)
    response = scheme_explainer.answer_followup(req.question, evaluation, profile_dict)
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
