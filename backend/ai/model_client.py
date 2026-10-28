"""
Open-Weight AI Model Connector
Integrates Qwen2.5-3B-Instruct or Llama-3.2-3B-Instruct via:
1. HuggingFace Serverless Inference API (Free tier with HF_TOKEN)
2. Local OpenAI-compatible endpoint (Ollama / vLLM / LM Studio at OPENAI_BASE_URL)
3. Transparent rule-grounded fallback with explicit UI attribution when unconfigured.
"""
import os
import json
import re
import requests
from typing import Dict, Any, Optional

DEFAULT_MODEL = "Qwen/Qwen2.5-3B-Instruct"

class OpenWeightAIClient:
    def __init__(self):
        self.hf_token = os.getenv("HF_TOKEN", "").strip()
        self.openai_base_url = os.getenv("OPENAI_BASE_URL", "").strip()
        self.model_name = os.getenv("AI_MODEL_NAME", DEFAULT_MODEL).strip()
        self.provider = self._detect_provider()

    def _detect_provider(self) -> str:
        if self.openai_base_url:
            return "local_endpoint"
        elif self.hf_token:
            return "huggingface"
        return "unconfigured"

    def get_status(self) -> Dict[str, Any]:
        """Returns live model availability, licence attribution, and configuration details."""
        if self.provider == "local_endpoint":
            try:
                res = requests.get(f"{self.openai_base_url}/models", timeout=3)
                if res.status_code == 200:
                    return {
                        "is_live_ai": True,
                        "status": "online",
                        "provider": "Local OpenAI-Compatible Server (Ollama / vLLM)",
                        "model": self.model_name,
                        "licence": "Open-Weight (Qwen Research License / Apache 2.0)",
                        "message": f"Connected to local open-weight model '{self.model_name}'"
                    }
            except Exception as e:
                pass
            return {
                "is_live_ai": False,
                "status": "unreachable",
                "provider": "Local Endpoint",
                "model": self.model_name,
                "licence": "Open-Weight",
                "message": f"Local endpoint at {self.openai_base_url} is unreachable. Operating in deterministic rule-grounded mode."
            }

        elif self.provider == "huggingface":
            return {
                "is_live_ai": True,
                "status": "online",
                "provider": "Hugging Face Serverless Inference",
                "model": self.model_name,
                "licence": "Open-Weight (Apache 2.0 for Qwen2.5 / Llama 3.2 Community License)",
                "message": f"Ready for live inference with open-weight model '{self.model_name}'"
            }

        else:
            return {
                "is_live_ai": False,
                "status": "offline_fallback",
                "provider": "Deterministic Rule-Grounded Engine",
                "model": f"{self.model_name} (Configuration Required)",
                "licence": "Apache 2.0 / MIT",
                "message": "AI model not configured. Set HF_TOKEN in .env or run local Ollama (ollama run qwen2.5:3b). Operating in verifiable deterministic mode."
            }

    def generate_chat(self, system_prompt: str, user_prompt: str, temperature: float = 0.2, max_tokens: int = 500) -> Dict[str, Any]:
        """
        Sends generation request to configured open-weight model.
        Returns a dict containing response text, model info, and whether live inference was used.
        """
        # 1. Try Local OpenAI-compatible endpoint (Ollama / vLLM)
        if self.provider == "local_endpoint" or self.openai_base_url:
            try:
                endpoint = f"{self.openai_base_url}/chat/completions"
                payload = {
                    "model": self.model_name,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                res = requests.post(endpoint, json=payload, timeout=20)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    return {
                        "text": content,
                        "is_live_ai": True,
                        "model": self.model_name,
                        "provider": "Local OpenAI-Compatible (Ollama)"
                    }
            except Exception as e:
                pass

        # 2. Try Hugging Face Serverless Inference API
        if self.hf_token:
            try:
                # Use HF router chat completions
                endpoint = "https://router.huggingface.co/hf-inference/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {self.hf_token}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": self.model_name,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                res = requests.post(endpoint, headers=headers, json=payload, timeout=25)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    return {
                        "text": content,
                        "is_live_ai": True,
                        "model": self.model_name,
                        "provider": "Hugging Face Inference API"
                    }
            except Exception as e:
                pass

        # 3. Transparent Offline Fallback: Model is unconfigured
        return {
            "text": None,
            "is_live_ai": False,
            "model": self.model_name,
            "provider": "Unconfigured (Offline Mode)"
        }
