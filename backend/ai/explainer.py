"""
Scheme Explainer & Question-Answering Engine
Uses open-weight model with retrieved scheme facts and criterion-level evaluation
to generate plain-language explanations, summarize missing information, and answer user questions.
"""
from typing import Dict, Any, Optional
from .model_client import OpenWeightAIClient

EXPLAIN_SYSTEM_PROMPT = """You are SchemeSaathi's Official Scheme Explainer.
Your job is to explain government scheme eligibility in simple, respectful, and crystal-clear language.
CRITICAL RULES:
1. Ground every statement strictly in the provided Scheme Facts and Criteria Evaluations.
2. NEVER invent rules, income limits, deadlines, quotas, or probabilities.
3. If information is missing or unverified, state: "Not verified in the current knowledge base".
4. Clarify that your explanation is informational guidance and that the official administering department makes the final decision.
5. Emphasize why specific criteria passed, failed, or need further details."""

class SchemeExplainer:
    def __init__(self, ai_client: Optional[OpenWeightAIClient] = None):
        self.ai_client = ai_client or OpenWeightAIClient()

    def generate_scheme_explanation(
        self,
        evaluation_result: Dict[str, Any],
        profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generates an evidence-grounded explanation of the scheme's assessment.
        """
        scheme = evaluation_result.get("scheme", {})
        assessment = evaluation_result.get("overall_assessment")
        criteria = evaluation_result.get("criteria", [])
        source_title = scheme.get("source_title", "Official Guidelines")
        source_excerpt = scheme.get("source_excerpt", "")

        # Format criteria context for the prompt
        criteria_lines = []
        for c in criteria:
            criteria_lines.append(
                f"- {c['label']}: Status={c['status']} | Requirement='{c['requirement']}' | User Value='{c['user_value']}' | Note={c['explanation']}"
            )
        criteria_context = "\n".join(criteria_lines)

        user_prompt = f"""Scheme Name: {scheme.get('name')}
Administering Authority: {scheme.get('administering_authority')}
Overall Assessment: {evaluation_result.get('overall_label')}
Official Source: {source_title}
Official Excerpt: "{source_excerpt}"

Criteria Evaluations:
{criteria_context}

Please provide:
1. A clear 2-3 sentence summary explaining the overall assessment in simple terms.
2. An explanation of why specific requirements met or did not meet the guidelines.
3. Key next steps or missing information the student needs to prepare."""

        model_res = self.ai_client.generate_chat(
            system_prompt=EXPLAIN_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            temperature=0.2,
            max_tokens=450
        )

        is_live = model_res.get("is_live_ai", False)
        explanation_text = model_res.get("text")

        # Verifiable deterministic fallback text if model unconfigured
        if not explanation_text:
            explanation_text = self._deterministic_explanation(evaluation_result, profile)

        return {
            "explanation": explanation_text,
            "is_live_ai": is_live,
            "model_used": model_res.get("model") if is_live else "Verifiable Deterministic Rule Engine (Offline Mode)",
            "source_title": source_title,
            "source_excerpt": source_excerpt,
            "source_url": scheme.get("source_url")
        }

    def answer_followup(
        self,
        question: str,
        evaluation_result: Dict[str, Any],
        profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Answers a specific follow-up question grounded strictly in the scheme record.
        """
        scheme = evaluation_result.get("scheme", {})
        source_excerpt = scheme.get("source_excerpt", "")
        required_docs = ", ".join(scheme.get("required_documents", []))
        app_steps = "\n".join(f"{i+1}. {s}" for i, s in enumerate(scheme.get("application_steps", [])))

        user_prompt = f"""Scheme: {scheme.get('name')}
Authority: {scheme.get('administering_authority')}
Official Excerpt: {source_excerpt}
Required Documents: {required_docs}
Application Steps:
{app_steps}

User Question: "{question}"

Answer the user's question directly using ONLY the facts above. If not answered by the facts, state: 'This detail is not verified in the current knowledge base. Please check the official portal at {scheme.get('source_url')} for official guidance.'"""

        model_res = self.ai_client.generate_chat(
            system_prompt=EXPLAIN_SYSTEM_PROMPT,
            user_prompt=user_prompt,
            temperature=0.2,
            max_tokens=350
        )

        is_live = model_res.get("is_live_ai", False)
        answer_text = model_res.get("text")

        if not answer_text:
            # Deterministic keyword-matching response
            q_lower = question.lower()
            if "document" in q_lower or "certificate" in q_lower or "proof" in q_lower:
                answer_text = f"According to official guidelines for {scheme.get('name')}, the verified required documents are: {required_docs}."
            elif "apply" in q_lower or "how to" in q_lower or "portal" in q_lower or "website" in q_lower:
                answer_text = f"You can apply on the official portal at {scheme.get('application_url')}. Summary of steps:\n{app_steps}"
            elif "income" in q_lower or "limit" in q_lower or "money" in q_lower:
                answer_text = f"Income Rule: {scheme.get('income_rule_description')}. Excerpt: '{source_excerpt}'"
            else:
                answer_text = f"Based on verified records for {scheme.get('name')}: {scheme.get('short_description')} Official Source: {scheme.get('source_title')}. For unverified specific queries, please refer directly to {scheme.get('source_url')}."

        return {
            "answer": answer_text,
            "is_live_ai": is_live,
            "model_used": model_res.get("model") if is_live else "Deterministic Rule-Grounded Q&A (Offline Mode)",
            "source_url": scheme.get("source_url")
        }

    def _deterministic_explanation(self, evaluation_result: Dict[str, Any], profile: Dict[str, Any]) -> str:
        scheme = evaluation_result.get("scheme", {})
        assessment = evaluation_result.get("overall_assessment")
        criteria = evaluation_result.get("criteria", [])

        satisfied = [c for c in criteria if c["status"] == "Satisfied"]
        not_satisfied = [c for c in criteria if c["status"] == "Not satisfied"]
        needs_info = [c for c in criteria if c["status"] == "Needs information"]

        parts = []
        if assessment == "potential_match":
            parts.append(
                f"Based on your provided profile, {scheme.get('name')} appears to be a **Potential Match**. Your reported qualifications meet all primary mandatory requirements verified in our knowledge base."
            )
            if satisfied:
                parts.append("Specifically:")
                for s in satisfied[:3]:
                    parts.append(f"• **{s['label']}**: {s['explanation']}")
            if needs_info:
                parts.append("\n**Items Still to Confirm:**")
                for n in needs_info:
                    parts.append(f"• **{n['label']}**: {n['explanation']}")

        elif assessment == "unmet":
            parts.append(
                f"Based on the official criteria for {scheme.get('name')}, **a requirement appears unmet**."
            )
            for ns in not_satisfied:
                parts.append(f"• **{ns['label']} unmet**: {ns['explanation']} (Official rule: *{ns['requirement']}*)")
            parts.append(
                "\n*Tip*: Check our **'Bridge the Gap'** section to view alternative schemes with matching criteria or higher ceilings."
            )

        else:
            parts.append(
                f"For {scheme.get('name')}, **more information is required** before eligibility can be assessed."
            )
            for ni in needs_info:
                parts.append(f"• **{ni['label']}**: {ni['explanation']}")

        parts.append(
            f"\n*Source Reference*: [{scheme.get('source_title')}]({scheme.get('source_url')}). All applications must be submitted directly through official government portals."
        )
        return "\n".join(parts)
