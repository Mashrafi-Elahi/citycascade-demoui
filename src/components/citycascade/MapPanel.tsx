import { useState } from "react";
import {
  PlusIcon, MinusIcon, LayersIcon, CrosshairIcon, PinIcon, AlertIcon,
} from "./icons";
import type { Disaster } from "./data";
import { DisasterIconMap } from "./icons";

interface Props {
  disaster: Disaster | null;
  intensity: number;
  status: "idle" | "simulating" | "active" | "error";
  onSimulate: () => void;
}

export function MapPanel({ disaster, intensity, status, onSimulate }: Props) {
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!disaster || status === "simulating") return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    onSimulate();
  }

  const showEmpty = !disaster && status === "idle";
  const showLoading = status === "simulating";
  const showError = status === "error";

  return (
    <div className="panel panel-cyan relative h-full overflow-hidden">
      {/* Title strip */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-background/90 to-transparent">
        <div className="flex items-center gap-3">
          <span className="font-display text-[11px] tracking-[0.3em] neon-text-cyan">Tactical Map</span>
          <span className="text-[10px] text-muted-foreground tracking-widest font-mono">
            DHAKA · 23.8103°N 90.4125°E
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
          <Legend dot="var(--neon-green)" label="STABLE" />
          <Legend dot="var(--neon-amber)" label="WARN" />
          <Legend dot="var(--neon-red)" label="CRITICAL" />
        </div>
      </div>

      {/* Map canvas */}
      <div
        onClick={handleClick}
        className={`relative h-full w-full grid-bg scanline cursor-${disaster ? "crosshair" : "default"}`}
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, oklch(0.22 0.05 220 / 0.6), oklch(0.13 0.04 250) 70%)",
        }}
      >
        {/* Decorative river / city silhouette */}
        <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 800 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="river" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.6 0.15 220)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="oklch(0.4 0.1 220)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M-20 380 C 120 320, 260 420, 400 360 S 700 300, 820 360 L 820 520 L -20 520 Z"
            fill="url(#river)"
          />
          <g stroke="oklch(0.78 0.18 200 / 0.35)" strokeWidth="0.7" fill="none">
            <path d="M50 100 L 760 110" />
            <path d="M120 60 L 130 460" />
            <path d="M380 40 L 390 440" />
            <path d="M620 50 L 600 470" />
            <path d="M30 250 L 770 270" />
            <path d="M40 350 L 780 360" />
          </g>
          {/* District blobs */}
          <g fill="oklch(0.78 0.18 200 / 0.06)" stroke="oklch(0.78 0.18 200 / 0.35)" strokeDasharray="3 3">
            <path d="M180 100 L 320 110 L 340 200 L 220 230 Z" />
            <path d="M380 150 L 520 140 L 540 250 L 400 260 Z" />
            <path d="M560 180 L 700 200 L 690 320 L 540 310 Z" />
            <path d="M180 260 L 340 270 L 360 380 L 200 390 Z" />
            <path d="M380 290 L 520 290 L 540 400 L 380 410 Z" />
          </g>
          <g fill="oklch(0.78 0.18 200 / 0.7)" fontSize="9" fontFamily="monospace" letterSpacing="2">
            <text x="220" y="170">UTTARA</text>
            <text x="430" y="200">GULSHAN</text>
            <text x="600" y="250">BADDA</text>
            <text x="220" y="330">MIRPUR</text>
            <text x="420" y="350">DHANMONDI</text>
            <text x="120" y="420">OLD DHAKA</text>
          </g>
        </svg>

        {/* Risk hotspots */}
        {status === "active" && (
          <>
            <Hotspot x={28} y={62} color="var(--neon-red)" size={140} />
            <Hotspot x={52} y={48} color="var(--neon-amber)" size={110} />
            <Hotspot x={72} y={56} color="var(--neon-red)" size={90} />
            <Hotspot x={42} y={70} color="var(--neon-amber)" size={120} />
          </>
        )}

        {/* Sweep line */}
        {showLoading && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="scan-line absolute inset-x-0 h-24"
              style={{
                background:
                  "linear-gradient(180deg, transparent, oklch(0.85 0.18 200 / 0.25), transparent)",
              }}
            />
          </div>
        )}

        {/* Pin */}
        {pin && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <div
              className="relative grid h-9 w-9 place-items-center rounded-full"
              style={{
                color: "var(--neon-red)",
                boxShadow: "0 0 0 1px var(--neon-red), 0 0 24px var(--neon-red)",
                background: "oklch(0.18 0.04 250 / 0.7)",
              }}
            >
              {disaster && (() => {
                const Icon = DisasterIconMap[disaster.id];
                return <Icon className="h-4 w-4 neon-text-red" />;
              })()}
              <span
                className="pulse-dot absolute inset-0 rounded-full"
                style={{ color: "var(--neon-red)" }}
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {showEmpty && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center max-w-sm px-6">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full panel panel-cyan">
                <CrosshairIcon className="h-5 w-5 neon-text-cyan" />
              </div>
              <div className="font-display text-sm tracking-[0.25em] neon-text-cyan">AWAITING INPUT</div>
              <p className="mt-2 text-xs text-muted-foreground tracking-widest">
                Select a disaster and click or draw on the map.
              </p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {showLoading && (
          <div className="absolute inset-0 grid place-items-center bg-background/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-[color:var(--neon-cyan)] border-t-transparent animate-spin" />
              <div className="font-display text-sm tracking-[0.3em] neon-text-cyan">SIMULATING CASCADE...</div>
              <p className="mt-1 text-[10px] text-muted-foreground tracking-widest">
                MODELING ZONE PROPAGATION · INTENSITY {intensity}
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {showError && (
          <div className="absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-sm">
            <div className="panel panel-red max-w-sm p-5 text-center">
              <AlertIcon className="mx-auto h-8 w-8 neon-text-red" />
              <div className="mt-2 font-display text-sm tracking-[0.25em] neon-text-red">
                SIMULATION FAULT
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground tracking-widest">
                Telemetry stream lost. Retry the cascade or reset the field.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating controls */}
      <div className="absolute right-3 top-14 z-20 flex flex-col gap-1.5">
        <MapBtn><PlusIcon className="h-4 w-4" /></MapBtn>
        <MapBtn><MinusIcon className="h-4 w-4" /></MapBtn>
        <MapBtn><LayersIcon className="h-4 w-4" /></MapBtn>
        <MapBtn><CrosshairIcon className="h-4 w-4" /></MapBtn>
        <MapBtn><PinIcon className="h-4 w-4" /></MapBtn>
      </div>

      {/* Coords readout */}
      <div className="absolute bottom-3 left-3 z-20 panel px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground tracking-widest">
        {pin
          ? `EPICENTER · X${pin.x.toFixed(1)} / Y${pin.y.toFixed(1)}`
          : "EPICENTER · NULL"}
      </div>
    </div>
  );
}

function MapBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="grid h-9 w-9 place-items-center rounded-md border border-border/60 bg-background/70 backdrop-blur transition hover:border-[color:var(--neon-cyan)]/70 hover:text-[color:var(--neon-cyan)]"
      type="button"
    >
      {children}
    </button>
  );
}

function Hotspot({ x, y, color, size }: { x: number; y: number; color: string; size: number }) {
  return (
    <div
      className="pointer-events-none absolute rounded-full"
      style={{
        left: `${x}%`, top: `${y}%`,
        width: size, height: size,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`,
      }}
    />
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: dot, boxShadow: `0 0 6px ${dot}` }}
      />
      {label}
    </span>
  );
}
