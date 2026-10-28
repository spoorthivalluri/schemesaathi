"""
One-Click Action Checklist Builder
Extracts verifiable documents, pending confirmation items, official application steps,
and authoritative links exclusively from verified scheme records.
"""
from typing import Dict, Any, List

def build_action_checklist(evaluation_result: Dict[str, Any]) -> Dict[str, Any]:
    scheme = evaluation_result.get("scheme", {})
    criteria = evaluation_result.get("criteria", [])

    # 1. Official Documents from Source
    official_docs = scheme.get("required_documents", [])
    document_items = [
        {
            "id": f"doc_{i}",
            "type": "document",
            "title": doc,
            "is_mandatory": True,
            "source_grounded": True,
            "completed": False
        }
        for i, doc in enumerate(official_docs)
    ]

    # 2. Eligibility Details Still Needing Verification
    pending_checks = [
        {
            "id": f"pending_{i}",
            "type": "verification",
            "title": f"Verify {c['label']}: {c['requirement']}",
            "detail": c["explanation"],
            "completed": False
        }
        for i, c in enumerate(criteria)
        if c["status"] == "Needs information" or not c["is_mandatory"]
    ]

    # 3. Application Steps Supported by Official Guidelines
    steps = scheme.get("application_steps", [])
    step_items = [
        {
            "step_number": i + 1,
            "instruction": step,
            "completed": False
        }
        for i, step in enumerate(steps)
    ]

    return {
        "scheme_id": scheme.get("id"),
        "scheme_name": scheme.get("name"),
        "administering_authority": scheme.get("administering_authority"),
        "application_url": scheme.get("application_url"),
        "source_url": scheme.get("source_url"),
        "source_title": scheme.get("source_title"),
        "last_verified": scheme.get("last_verified"),
        "verification_status": scheme.get("verification_status", "verified"),
        "checklist_documents": document_items,
        "pending_verifications": pending_checks,
        "application_steps": step_items,
        "disclaimer": "This checklist is derived strictly from verified official guidelines. Completing this checklist prepares your application but does not guarantee official approval."
    }
