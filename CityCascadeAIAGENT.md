# CityCascade AI Agent Notes

## Safety checkpoint
- Current branch: `safe/lovable-ui-integration`
- Checkpoint commit: `3d0a1c5`
- Checkpoint command used: `git commit -m "chore: checkpoint before lovable ui integration" || true`
- Files changed at checkpoint: none (clean tree)

## Audit summary (before edits)
### What currently works
- Cyberpunk dashboard shell with status bar, tactical map panel, right command sidebar, risk cards, AI plan panel.
- Real Leaflet map loads Dhaka geojson zones (`src/components/citycascade/dhakaZones.ts`) and supports zone click selection.
- Multi-pin brush mode exists in map panel and is toggleable from sidebar.
- Disaster catalog already includes 10 disruptions.
- AI response panel already includes required core sections and can render generated plan blocks.

### What is being replaced visually
- Minor UI labels and card/status semantics are aligned to Lovable requirements (UPCOMING badges, coming-soon message, risk cards tied to simulation output).
- Sidebar/action/error behavior is hardened for non-breaking idle/failure states.

### What must remain functional
- Dhaka static map and Leaflet interaction must always render.
- Zone click must trigger cascade-like simulation state update.
- MongoDB/AI failures must not blank the UI.
- Existing command-center layout and tactical panel structure must remain.

## Run
- Install deps: `npm install`
- Dev server: `npm run dev`
- Production build check: `npm run build`

## Rollback
1. `git status`
2. `git log --oneline -5`
3. Hard reset to checkpoint if needed: `git reset --hard 3d0a1c5`
4. Or switch back: `git checkout main`
