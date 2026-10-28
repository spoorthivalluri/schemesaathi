/**
 * SchemeSaathi API Client
 * Connects frontend to the FastAPI backend.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API health check warning:', err);
    return {
      status: 'offline',
      service: 'SchemeSaathi Core API',
      ai_model: {
        is_live_ai: false,
        status: 'disconnected',
        provider: 'Local Static Fallback',
        message: 'Could not connect to FastAPI server. Please start the backend on port 8000.'
      }
    };
  }
}

export async function fetchSchemes() {
  const res = await fetch(`${API_BASE_URL}/api/schemes`);
  if (!res.ok) throw new Error('Failed to fetch schemes');
  return await res.json();
}

export async function matchProfile(profile) {
  const res = await fetch(`${API_BASE_URL}/api/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to evaluate eligibility');
  return await res.json();
}

export async function parseNaturalLanguageProfile(text) {
  const res = await fetch(`${API_BASE_URL}/api/parse-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to parse natural language profile');
  return await res.json();
}

export async function fetchSchemeExplanation(schemeId, profile) {
  const res = await fetch(`${API_BASE_URL}/api/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheme_id: schemeId, profile })
  });
  if (!res.ok) throw new Error('Failed to generate scheme explanation');
  return await res.json();
}

export async function fetchBridgeAlternatives(schemeId, profile) {
  const res = await fetch(`${API_BASE_URL}/api/alternatives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheme_id: schemeId, profile })
  });
  if (!res.ok) throw new Error('Failed to fetch alternatives');
  return await res.json();
}

export async function fetchActionChecklist(schemeId, profile) {
  const res = await fetch(`${API_BASE_URL}/api/checklist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheme_id: schemeId, profile })
  });
  if (!res.ok) throw new Error('Failed to generate checklist');
  return await res.json();
}

export async function askSchemeQuestion(schemeId, question, profile) {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheme_id: schemeId, question, profile })
  });
  if (!res.ok) throw new Error('Failed to answer question');
  return await res.json();
}
