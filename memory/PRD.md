# CityCascade AI — Prototype Branch PRD

## Original problem statement
Judge-facing polish for the CityCascade AI disaster ops demo. Build
reusable frontend pieces that can be copy-pasted into the real Next.js
App Router project — no backend rewrite, no DB rewrite, no fake keys.

Deliver a serious, presentation-ready dark/neon emergency command center
with: a REAL Leaflet map of Dhaka, 10-disaster selector (no truncation,
full SVG icons, no emoji), searchable city grid (Dhaka active, other 8
cities disabled with red-neon SOON badges), right command panel
(intensity + target + brush + run + reset), and an AI response drawer
that fills with real per-disaster plan data after a simulation.

## Architecture
- Sandbox: TanStack Start (SSR) + Vite + React 19 + Tailwind + TypeScript.
- Map: vanilla Leaflet loaded from CDN on the client inside `useEffect`
  (SSR-safe). GeoJSON polygons for 11 Dhaka wards.
- State: local React state in `routes/index.tsx` (Dashboard). No backend
  coupling; clean copy target for Next.js App Router.

## Core requirements — all met
- [x] Real Leaflet map (dark Carto tiles, click handlers, tooltips, zones)
- [x] No sidebar truncation; full disaster names in 2-col grid
- [x] Custom thin cyan scrollbar (`.scroll-cyan`)
- [x] Click zone AND Run Cascade both work
- [x] AI cards fill with rich, disaster-specific plan content from
      `aiPlans.ts` (routing, hospital, public health, infra, evac, alerts)
      with P0/P1/P2 priorities, ETA, and confidence
- [x] 10 disasters with bespoke inline SVG icons (no emoji, no URLs)
- [x] City search index + 8 disabled cities with red-neon SOON badge
- [x] Error + loading + empty overlays for map
- [x] Brush mode toggle for multi-pin drawing
- [x] Reset simulation / Reset field
- [x] Copy guide for Next.js integration (`CITYCASCADE_COPY_GUIDE.md`)

## User personas
- **Hackathon judge** — must instantly grasp the concept within 30 seconds.
- **Operator (future)** — uses the same panel in production for actual
  city ops; deployed via your real Next.js project.

## What's implemented (2026-05-02)
- `src/components/citycascade/MapPanel.tsx` — SSR-safe Leaflet wrapper,
  zone styling by risk + intensity, click-to-target, brush mode, tooltips.
- `src/components/citycascade/AIResponsePanel.tsx` — filled plan grid,
  collapsible sections, ETA, confidence, priority chips, reset + generate.
- `src/components/citycascade/CitySelector.tsx` — search-indexed picker,
  red-neon disabled pattern, keyboard + click friendly.
- `src/components/citycascade/DisasterSelector.tsx` — wrapping 2-col grid,
  neon tone per disaster, no truncation.
- `src/components/citycascade/CommandSidebar.tsx` — target readout, brush
  toggle, run cascade + reset.
- `src/components/citycascade/data.ts` — 10 disasters + 9 cities (updated
  to spec: Dhaka + Chittagong, Sylhet, Khulna, Rajshahi, Tokyo, New York,
  Jakarta, Manila).
- `src/components/citycascade/dhakaZones.ts` — **47 real Dhaka thana
  polygons** (admin_level 7 / precinct level) from geoBoundaries ADM3
  (OSM-derived, CC BY 4.0), simplified to ~65m tolerance. Real irregular
  boundaries (Adabor, Badda, Gulshan, Motijheel, Lalbagh, Mirpur, Uttara,
  Dhanmondi, Mohammadpur, Tejgaon, Khilgaon, Jatrabari, Demra, Rampura,
  Cantonment, Pallabi, Savar, Keraniganj, Sonargaon, etc).
- `src/components/citycascade/aiPlans.ts` — per-disaster, zone-aware plan
  builder matching the shape a real `/api/ai` route should return.
- `src/components/citycascade/icons.tsx` — 10 disaster + UI icons as
  inline SVG, no emoji, no external URLs.
- `src/styles.css` — `.scroll-cyan` custom scrollbar, Leaflet dark
  overrides for tooltips / zoom / popups.
- `CITYCASCADE_COPY_GUIDE.md` — exact files to copy to your Next.js repo
  and how to wire them (dynamic import, Leaflet CSS, AI fetch).

## Backlog (P1 / P2)
- P1 — Replace sample `DHAKA_ZONES` with real OSM / Dhaka City Corporation
  ward GeoJSON (drop-in, same shape).
- P1 — Replace `buildPlan(...)` in `AIResponsePanel.tsx` with a `fetch`
  to your real `/api/ai/plan` endpoint; response shape already matches.
- P2 — leaflet-draw integration (polygon brush) — current brush is a
  multi-pin click already usable for demo.
- P2 — Multi-city activation once your BFS cascade supports them.
- P2 — Shareable permalink (`/sim?d=flood&z=z-motijheel&i=8`) for judges.

## Next tasks
- Copy the 15 files listed in `CITYCASCADE_COPY_GUIDE.md` into your
  Next.js repo under `src/components/citycascade/`.
- Add the Leaflet CSS link to `app/layout.tsx`.
- Wrap `MapPanel` with `next/dynamic({ ssr: false })`.
- Swap `buildPlan()` for your `/api/ai/plan` fetch.
