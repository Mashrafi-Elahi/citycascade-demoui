/**
 * AI provider adapter for CityCascade.
 *
 * Supports:
 *  - "template"       — deterministic, template-based plan from ./plans (no LLM call)
 *  - "gemini"         — Google Gemini REST API (user supplies their own API key)
 *  - "openai-compat"  — any OpenAI-compatible server (ollama, LM Studio, local router,
 *                      OpenRouter, DeepInfra, etc.). User supplies base_url + key + model.
 *
 * Add your own Firebase / Emergent Universal Key logic later by extending this file.
 */
import type { DisasterId } from "@/components/citycascade/icons";
import { buildPlan as templatePlan, type DisasterPlan } from "@/components/citycascade/aiPlans";

export interface AIConfig {
  provider: "template" | "gemini" | "openai-compat";
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  lang?: "en" | "bn";
}

export interface AIRequest {
  disaster: DisasterId;
  intensity: number;
  zone: {
    id: string;
    name: string;
    population: number;
    baseRisk: number;
  } | null;
  city: string;
  config: AIConfig;
}

export async function generatePlan(req: AIRequest): Promise<DisasterPlan> {
  const { disaster, intensity, zone, config } = req;

  // Fallback template for any provider failure or when no key is provided.
  const fallback = () => templatePlan(disaster, intensity, zone);

  // 1. Template (no network) ------------------------------------------------
  if (config.provider === "template" || !config.apiKey) {
    return fallback();
  }

  // 2. Gemini ---------------------------------------------------------------
  if (config.provider === "gemini") {
    try {
      return await callGemini(req);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[ai] gemini failed, falling back to template", err);
      return fallback();
    }
  }

  // 3. OpenAI-compatible (local router, ollama, openai, etc.) ---------------
  if (config.provider === "openai-compat") {
    try {
      return await callOpenAICompat(req);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[ai] openai-compat failed, falling back to template", err);
      return fallback();
    }
  }

  return fallback();
}

/* ---------------------------------------------------------------------- */

const SYSTEM_PROMPT = `You are CITYCASCADE-OPS, the planning AI for a city-scale disaster operations centre.
Return ONLY valid JSON matching this TypeScript type — no prose, no markdown:

{
  "headline": string,
  "confidence": number, // 0..1
  "etaMinutes": number,
  "sections": Array<{
    "id": "route" | "hosp" | "health" | "infra" | "evac" | "alert",
    "title": string,
    "priority": "P0" | "P1" | "P2",
    "items": string[] // 3 concise directives each
  }>
}

Include all 6 sections in that order. Be specific to the city, disaster type,
intensity (1-10) and affected zone (if any). Use real place names where possible.`;

function userPrompt(req: AIRequest) {
  const lang = req.config.lang === "bn" ? "Bangla (Bengali, natural script)" : "English";
  const zone = req.zone
    ? `${req.zone.name} (pop ${req.zone.population.toLocaleString()}, base risk ${req.zone.baseRisk})`
    : "city-wide impact, no single zone";
  return `City: ${req.city}
Disaster: ${req.disaster}
Intensity: ${req.intensity}/10
Affected zone: ${zone}
Language for ALL output text (headline + titles + items): ${lang}.
Respond with the JSON only.`;
}

async function callGemini(req: AIRequest): Promise<DisasterPlan> {
  const model = req.config.model || "gemini-2.0-flash-exp";
  const key = req.config.apiKey!;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: userPrompt(req) }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
  };
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`gemini ${r.status}: ${await r.text()}`);
  const j = (await r.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return parsePlan(text);
}

async function callOpenAICompat(req: AIRequest): Promise<DisasterPlan> {
  const baseUrl = (req.config.baseUrl || "http://localhost:11434/v1").replace(/\/+$/, "");
  const key = req.config.apiKey!;
  const model = req.config.model || "llama3.1:latest";
  const r = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(req) },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`openai-compat ${r.status}: ${await r.text()}`);
  const j = (await r.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = j.choices?.[0]?.message?.content ?? "";
  return parsePlan(text);
}

function parsePlan(text: string): DisasterPlan {
  // Strip code fences if present.
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const obj = JSON.parse(cleaned) as DisasterPlan;
  if (!obj.sections || !Array.isArray(obj.sections)) {
    throw new Error("LLM response missing sections");
  }
  return obj;
}
