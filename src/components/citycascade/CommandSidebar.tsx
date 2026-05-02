import { CitySelector } from "./CitySelector";
import { DisasterSelector } from "./DisasterSelector";
import { IntensitySlider } from "./IntensitySlider";
import { PlayIcon, ResetIcon } from "./icons";
import type { Disaster } from "./data";

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
}

export function CommandSidebar(p: Props) {
  const ready = !!p.disaster;
  return (
    <aside className="panel flex h-full flex-col gap-4 p-4 overflow-y-auto">
      <div>
        <div className="font-display text-[11px] tracking-[0.3em] neon-text-cyan">Command Console</div>
        <div className="text-[10px] text-muted-foreground tracking-widest mt-0.5">
          OPERATOR · CITY OPS DESK
        </div>
      </div>

      <CitySelector selected={p.city} onSelect={p.onCity} />
      <DisasterSelector selected={p.disaster} onSelect={p.onDisaster} />
      <IntensitySlider value={p.intensity} onChange={p.onIntensity} />

      <div className="mt-auto space-y-2 pt-2">
        <button
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
