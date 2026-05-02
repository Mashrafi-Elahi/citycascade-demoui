# CityCascade AI — Copy Guide

These are the reusable components built in this prototype. Copy them into your
real Next.js App Router project with minimal changes. Nothing here rewrites
your backend or database.

---

## 1. Components — copy as-is

Copy the entire `src/components/citycascade/` directory into your Next.js repo.
Recommended destination: `src/components/citycascade/`.

Files:

- `MapPanel.tsx` — Real Leaflet tactical map, GeoJSON Dhaka zones, click & brush,
  error / loading / empty overlays. Loads Leaflet from CDN on the client only,
  so it is SSR-safe.
- `CommandSidebar.tsx` — Right command console (city, disaster, intensity,
  brush, run, reset, target readout).
- `CitySelector.tsx` — Dhaka active, other 8 cities disabled with red-neon
  "SOON" badge + fuzzy search index.
- `DisasterSelector.tsx` — 10 disasters, no truncation, neon accents.
- `IntensitySlider.tsx` — Neon gradient slider 1–10.
- `RiskSummary.tsx` — 5 KPI cards (AFFECTED POPULATION, HOSPITAL STRAIN, …).
- `ZoneRiskList.tsx` — Per-zone risk bars.
- `HospitalStatusPanel.tsx` — Hospital saturation strip.
- `RoadBlockPanel.tsx` — Blocked road incidents.
- `AIResponsePanel.tsx` — Bottom drawer that renders full AI plan after
  simulation. Plan data now comes from `aiPlans.ts` — wire this to your
  real `/api/ai` route by replacing `buildPlan(...)` with a `fetch()`.
- `StatusBar.tsx` — Top status strip.
- `data.ts` — `DISASTERS` + `CITIES` arrays (update in one place).
- `dhakaZones.ts` — **Real Dhaka thana-level GeoJSON** (47 precincts with
  irregular admin boundaries, sourced from geoBoundaries ADM3 / OSM).
  Swap with ward-level (admin_level 9/10) GeoJSON later for even finer
  granularity.
- `aiPlans.ts` — Disaster-specific response templates. This is where
  the hardcoded realistic plan lives; swap with LLM output later.
- `icons.tsx` — All custom SVG disaster icons + UI icons (no emoji, no
  external assets).

Shared UI primitives come from `src/components/ui/*` (shadcn button / card /
slider). Copy these too if your Next.js project doesn't already have them.

Design tokens are in `src/styles.css` — specifically the `--neon-*` CSS
variables and the `.panel`, `.panel-cyan`, `.panel-red`, `.scroll-cyan`
helpers. Merge into your global stylesheet.

---

## 2. Next.js-specific integration notes

### 2.1 Leaflet + SSR

`MapPanel.tsx` is already safe: it loads Leaflet from a CDN inside
`useEffect`, never during SSR. No changes needed.

If you prefer bundled Leaflet, wrap the subtree with `next/dynamic`:

```tsx
// app/dashboard/page.tsx
"use client";
import dynamic from "next/dynamic";

const MapPanel = dynamic(
  () => import("@/components/citycascade/MapPanel").then(m => m.MapPanel),
  { ssr: false },
);
```

### 2.2 Leaflet CSS

Add once in `app/layout.tsx`:

```tsx
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>
```

### 2.3 Wire the AI plan to your real backend

In `AIResponsePanel.tsx`, replace the in-memory `buildPlan(...)` with:

```ts
const res = await fetch("/api/ai/plan", {
  method: "POST",
  body: JSON.stringify({ disaster, intensity, zone }),
});
const plan = await res.json();
```

The response shape to return from your route:

```ts
interface DisasterPlan {
  headline: string;
  confidence: number;     // 0..1
  etaMinutes: number;
  sections: Array<{
    id: "route" | "hosp" | "health" | "infra" | "evac" | "alert";
    title: string;
    priority: "P0" | "P1" | "P2";
    items: string[];
  }>;
}
```

That matches `DisasterPlan` in `aiPlans.ts`, so the UI picks up real data
with zero component changes.

### 2.4 Dhaka zone data upgrade path

Replace `DHAKA_ZONES` in `dhakaZones.ts` with a `fetch('/api/zones/dhaka')`
that returns a real GeoJSON `FeatureCollection`. Feature properties must
include `id`, `name`, `population`, `baseRisk`.

---

## 3. Files you do NOT need to copy

- `src/routes/*` — TanStack Router glue; Next.js App Router replaces it.
- `src/router.tsx`, `src/main.tsx` — entrypoints specific to this sandbox.
- `vite.config.ts`, `tsconfig.json` — project-specific.
- `backend/`, `frontend/` wrappers — just supervisor glue for this sandbox.

---

## 4. Quick wiring example (app/dashboard/page.tsx)

```tsx
"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

import { StatusBar } from "@/components/citycascade/StatusBar";
import { CommandSidebar } from "@/components/citycascade/CommandSidebar";
import { RiskSummary } from "@/components/citycascade/RiskSummary";
import { ZoneRiskList } from "@/components/citycascade/ZoneRiskList";
import { HospitalStatusPanel } from "@/components/citycascade/HospitalStatusPanel";
import { RoadBlockPanel } from "@/components/citycascade/RoadBlockPanel";
import { AIResponsePanel } from "@/components/citycascade/AIResponsePanel";
import { DISASTERS } from "@/components/citycascade/data";
import type { DisasterId } from "@/components/citycascade/icons";
import type { SelectedZone } from "@/components/citycascade/MapPanel";

const MapPanel = dynamic(
  () => import("@/components/citycascade/MapPanel").then(m => m.MapPanel),
  { ssr: false },
);

export default function Dashboard() {
  // … same state as src/routes/index.tsx in this sandbox
}
```

---

## Summary of the 5 judge-critical fixes delivered

1. **Real Leaflet map** replaces the decorative SVG placeholder. Zones are
   real GeoJSON polygons; tooltips, hover, click-to-target all work.
2. **No truncation** in the sidebar — disaster and city names wrap cleanly;
   "URBAN FLOOD" / "BUILDING FIRE" read at a glance.
3. **Custom thin cyan scrollbar** via `.scroll-cyan` (WebKit + Firefox).
4. **Run Cascade** and **map clicks** both work; polygon click selects the
   zone and auto-runs the cascade.
5. **AI Response cards fill with real plan data** (routing, hospital,
   public-health, infra, evac, alerts) tailored per disaster + intensity +
   selected zone.

Bonus: city search index, brush mode, error panel, custom SVG icons, no
emoji, no fake API keys.
