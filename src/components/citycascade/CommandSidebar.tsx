import { CitySelector } from "./CitySelector";
import { DisasterSelector } from "./DisasterSelector";
import { IntensitySlider } from "./IntensitySlider";
import { PlayIcon, ResetIcon, BrushIcon, TargetIcon } from "./icons";
import type { Disaster } from "./data";
import type { SelectedZone } from "./MapPanel";

interface Props {
  city: string;
  onCity: (id: string) => void;
  disaster: Disaster["id"] | null;
  onDisaster: (id: Disaster["id"]) => void;
  intensity: number;
  onIntensity: (v: number) => void;
  onSimulate: () => void;
  onReset: () => void;
  status: "idle" | "simulating" | "active" | "error";
  brush: boolean;
  onBrush: (v: boolean) => void;
  zone: SelectedZone | null;
}

export function CommandSidebar(p: Props) {
  const ready = !!p.disaster;
  return (
    <aside
      className="panel flex h-full flex-col gap-4 p-4 overflow-y-auto scroll-cyan"
      data-testid="command-sidebar"
    >
      <div>
        <div className="font-display text-[11px] tracking-[0.3em] neon-text-cyan">
          Command Console
        </div>
        <div className="text-[10px] text-muted-foreground tracking-widest mt-0.5">
          OPERATOR · CITY OPS DESK
        </div>
      </div>

      <CitySelector selected={p.city} onSelect={p.onCity} />
      <DisasterSelector selected={p.disaster} onSelect={p.onDisaster} />
      <IntensitySlider value={p.intensity} onChange={p.onIntensity} />

      {/* Target readout */}
      <div className="rounded-md border border-border/60 bg-background/40 p-2.5">
        <div className="flex items-center gap-2">
          <TargetIcon
            className="h-3.5 w-3.5"
            style={{ color: p.zone ? "var(--neon-red)" : "var(--neon-cyan)" }}
          />
          <span className="font-display text-[10px] tracking-[0.25em] text-muted-foreground">
            TARGET
          </span>
        </div>
        <div
          className="mt-1 font-display text-[12px] tracking-[0.15em] leading-tight"
          style={{ color: p.zone ? "var(--neon-red)" : "var(--foreground)" }}
          data-testid="target-readout"
        >
          {p.zone ? p.zone.name : "CITY-WIDE (NO ZONE PICKED)"}
        </div>
        {p.zone && (
          <div className="mt-0.5 text-[10px] font-mono text-muted-foreground tracking-widest">
            POP {(p.zone.population / 1000).toFixed(0)}K · BASE RISK {p.zone.baseRisk}
          </div>
        )}
      </div>

      {/* Brush / draw toggle */}
      <button
        data-testid="brush-toggle"
        onClick={() => p.onBrush(!p.brush)}
        className={[
          "flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left transition",
          p.brush
            ? "border-[color:var(--neon-cyan)]/70 bg-background/60"
            : "border-border/60 bg-background/40 hover:border-[color:var(--neon-cyan)]/50",
        ].join(" ")}
        style={
          p.brush
            ? { boxShadow: "0 0 0 1px var(--neon-cyan), 0 0 18px -6px var(--neon-cyan)" }
            : undefined
        }
      >
        <span className="flex items-center gap-2">
          <BrushIcon
            className="h-4 w-4"
            style={{ color: p.brush ? "var(--neon-cyan)" : undefined }}
          />
          <span className="font-display text-[11px] tracking-[0.25em]">BRUSH MODE</span>
        </span>
        <span
          className="font-mono text-[10px] tracking-widest"
          style={{ color: p.brush ? "var(--neon-cyan)" : "var(--muted-foreground)" }}
        >
          {p.brush ? "ON" : "OFF"}
        </span>
      </button>

      <div className="mt-auto space-y-2 pt-2">
        <button
          data-testid="run-cascade-btn"
          onClick={p.onSimulate}
          disabled={!ready || p.status === "simulating"}
          className="group flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 font-display text-[12px] tracking-[0.25em] text-background transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: "linear-gradient(180deg, oklch(0.92 0.16 200), oklch(0.74 0.18 200))",
            boxShadow: ready
              ? "0 0 0 1px var(--neon-cyan), 0 0 22px -4px var(--neon-cyan)"
              : undefined,
          }}
        >
          <PlayIcon className="h-4 w-4" />
          {p.status === "simulating" ? "SIMULATING..." : "RUN CASCADE"}
        </button>

        <button
          data-testid="reset-simulation-btn"
          onClick={p.onReset}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border/60 bg-background/40 px-4 py-2 font-display text-[11px] tracking-[0.25em] text-muted-foreground transition hover:border-[color:var(--neon-red)]/60 hover:text-[color:var(--neon-red)]"
        >
          <ResetIcon className="h-3.5 w-3.5" />
          RESET SIMULATION
        </button>
      </div>
    </aside>
  );
}
