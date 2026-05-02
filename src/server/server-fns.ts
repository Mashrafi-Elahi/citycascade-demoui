/**
 * Server functions for CityCascade.
 *
 * In TanStack Start, `createServerFn` compiles to an RPC endpoint and is
 * callable from the client like any async function. It maps 1:1 to Next.js
 * App Router route handlers — see CITYCASCADE_COPY_GUIDE.md for the
 * `app/api/*/route.ts` equivalents you can drop into your real Next.js repo.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ObjectId } from "mongodb";

import { getDb, COLL } from "./mongo";
import { generatePlan, type AIConfig } from "./ai-provider";
import type { DisasterId } from "@/components/citycascade/icons";
import type { DisasterPlan } from "@/components/citycascade/aiPlans";

/* ------------------------------------------------------------------ */
/*                              Validators                             */
/* ------------------------------------------------------------------ */

const zDisaster = z.enum([
  "flood",
  "fire",
  "rain",
  "earthquake",
  "crash",
  "dengue",
  "smog",
  "outage",
  "waste",
  "water",
]);

const zZone = z
  .object({
    id: z.string(),
    name: z.string(),
    population: z.number(),
    baseRisk: z.number(),
  })
  .nullable();

const zAIConfig = z.object({
  provider: z.enum(["template", "gemini", "openai-compat"]).default("template"),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  model: z.string().optional(),
  lang: z.enum(["en", "bn"]).optional(),
});

const zPlanInput = z.object({
  disaster: zDisaster,
  intensity: z.number().min(1).max(10),
  zone: zZone,
  city: z.string().default("Dhaka"),
  config: zAIConfig,
});

const zSimInput = z.object({
  disaster: zDisaster,
  intensity: z.number().min(1).max(10),
  zone: zZone,
  city: z.string(),
  plan: z.any(),
});

/* ------------------------------------------------------------------ */
/*                     POST /api/ai/plan  equivalent                   */
/* ------------------------------------------------------------------ */

export const generatePlanFn = createServerFn({ method: "POST" })
  .inputValidator(zPlanInput)
  .handler(async ({ data }): Promise<{ ok: true; plan: DisasterPlan; provider: string }> => {
    const plan = await generatePlan({
      disaster: data.disaster as DisasterId,
      intensity: data.intensity,
      zone: data.zone,
      city: data.city,
      config: data.config as AIConfig,
    });
    return { ok: true, plan, provider: data.config.provider };
  });

/* ------------------------------------------------------------------ */
/*                    POST /api/simulations  equivalent                */
/* ------------------------------------------------------------------ */

export const saveSimulationFn = createServerFn({ method: "POST" })
  .inputValidator(zSimInput)
  .handler(async ({ data }): Promise<{ ok: true; id: string }> => {
    const db = await getDb();
    const doc = {
      ...data,
      createdAt: new Date(),
      // NOTE: replace with real user id once Firebase auth is wired.
      userId: null as string | null,
    };
    const res = await db.collection(COLL.SIMULATIONS).insertOne(doc);
    return { ok: true, id: res.insertedId.toHexString() };
  });

/* ------------------------------------------------------------------ */
/*                     GET /api/simulations  equivalent                */
/* ------------------------------------------------------------------ */

export const listSimulationsFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ limit: z.number().optional() }))
  .handler(async ({ data }) => {
    const db = await getDb();
    // Always exclude _id to keep responses JSON-safe; pin plan via id.
    const rows = await db
      .collection(COLL.SIMULATIONS)
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(data.limit ?? 20)
      .toArray();
    return { ok: true as const, rows };
  });

/* ------------------------------------------------------------------ */
/*                    GET/POST /api/settings  equivalent               */
/* ------------------------------------------------------------------ */

export const getSettingsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const db = await getDb();
    const doc = await db
      .collection(COLL.SETTINGS)
      .findOne({ key: "ai" }, { projection: { _id: 0, key: 0 } });
    // Never leak API keys back; mask before returning.
    const safe = doc
      ? {
          provider: (doc as { provider?: string }).provider ?? "template",
          baseUrl: (doc as { baseUrl?: string }).baseUrl ?? "",
          model: (doc as { model?: string }).model ?? "",
          hasKey: !!(doc as { apiKey?: string }).apiKey,
        }
      : { provider: "template", baseUrl: "", model: "", hasKey: false };
    return { ok: true as const, settings: safe };
  });

export const saveSettingsFn = createServerFn({ method: "POST" })
  .inputValidator(zAIConfig)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const db = await getDb();
    await db.collection(COLL.SETTINGS).updateOne(
      { key: "ai" },
      {
        $set: {
          key: "ai",
          provider: data.provider,
          baseUrl: data.baseUrl ?? "",
          model: data.model ?? "",
          // Only overwrite apiKey when a new non-empty key is provided.
          ...(data.apiKey ? { apiKey: data.apiKey } : {}),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
    return { ok: true };
  });

/* ------------------------------------------------------------------ */
/*             GET /api/simulations/:id  equivalent (deep link)        */
/* ------------------------------------------------------------------ */

export const getSimulationFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const db = await getDb();
    const _id = (() => {
      try {
        return new ObjectId(data.id);
      } catch {
        return null;
      }
    })();
    if (!_id) return { ok: false as const, error: "bad id" };
    const row = await db
      .collection(COLL.SIMULATIONS)
      .findOne({ _id }, { projection: { _id: 0 } });
    if (!row) return { ok: false as const, error: "not found" };
    return { ok: true as const, row };
  });
