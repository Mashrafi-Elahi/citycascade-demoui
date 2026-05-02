import { useState } from "react";
import {
  RouteIcon, HospitalIcon, HeartPulseIcon, InfraIcon, EvacIcon, MegaphoneIcon,
  ChevronDownIcon, SparkIcon, AlertIcon,
} from "./icons";
import type { JSX } from "react";

interface Section {
  id: string;
  title: string;
  icon: (p: { className?: string }) => JSX.Element;
  items: string[];
  tone: "cyan" | "red" | "amber" | "green";
}

const SECTIONS: Section[] = [
  { id: "route", title: "Emergency Routing", icon: RouteIcon, tone: "cyan", items: [
    "Reroute Route 8 traffic via Hatirjheel link road; expected delay −18 min.",
    "Open contraflow on Mirpur Road segment 4 → 7 for emergency vehicles.",
    "Activate dynamic signal priority for fire & ambulance fleet (37 units).",
  ]},
  { id: "hosp", title: "Hospital Allocation", icon: HospitalIcon, tone: "red", items: [
    "Divert non-critical intake from Dhaka Medical (94%) to Apollo (52%).",
    "Pre-stage 220 surge beds via United + Square partnership protocol.",
    "Dispatch 12 mobile triage units to Old Dhaka risk corridor.",
  ]},
  { id: "health", title: "Public Health", icon: HeartPulseIcon, tone: "amber", items: [
    "Issue waterborne illness advisory to Sutrapur, Wari, Lalbagh wards.",
    "Deploy 40k ORS kits + chlorine tablets within 6 hours.",
    "Activate dengue vector control units in standing-water zones.",
  ]},
  { id: "infra", title: "Infrastructure", icon: InfraIcon, tone: "cyan", items: [
    "Isolate sub-stations 14 & 22 to prevent cascading outage.",
    "Pre-position 28 dewatering pumps at flagged underpasses.",
    "Cellular load-balancing across 3 telco carriers in affected cells.",
  ]},
  { id: "evac", title: "Evacuation", icon: EvacIcon, tone: "amber", items: [
    "Phase-1 evacuation for 18,400 residents in red zones.",
    "Open 22 shelters (school + community center network).",
    "Stand up 6 boat rescue teams along Buriganga waterfront.",
  ]},
  { id: "alert", title: "Citizen Alerts", icon: MegaphoneIcon, tone: "red", items: [
    "SMS broadcast in BN/EN to 1.4M handsets in impact polygons.",
    "Push to CityCascade citizen app with live shelter map.",
    "FM radio + community PA loop every 10 minutes.",
  ]},
];

const TONE: Record<Section["tone"], string> = {
  cyan: "var(--neon-cyan)",
  red: "var(--neon-red)",
  amber: "var(--neon-amber)",
  green: "var(--neon-green)",
};

interface Props {
  status: "idle" | "simulating" | "active" | "error";
  onGenerate: () => void;
  onReset: () => void;
}

export function AIResponsePanel({ status, onGenerate, onReset }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({ route: true, hosp: true });
  const active = status === "active";

  return (
    <section className="panel panel-cyan relative overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5">
        <SparkIcon className="h-4 w-4 neon-text-cyan" />
        <div className="flex-1">
          <h2 className="font-display text-[12px] tracking-[0.3em] neon-text-cyan">
            AI Response Plan
          </h2>
          <p className="text-[10px] text-muted-foreground tracking-widest">
            {status === "active" && "PLAN GENERATED · CONFIDENCE 0.91"}
            {status === "simulating" && "COMPILING DIRECTIVES..."}
            {status === "idle" && "PLAN UNAVAILABLE · RUN A SIMULATION"}
            {status === "error" && "GENERATION FAILED · RETRY"}
          </p>
        </div>

        <button
          onClick={onReset}
          className="hidden sm:inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/50 px-3 py-1.5 text-[11px] tracking-widest text-muted-foreground transition hover:border-[color:var(--neon-red)]/60 hover:text-[color:var(--neon-red)]"
        >
          RESET FIELD
        </button>
        <button
          onClick={onGenerate}
          disabled={status === "simulating"}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] tracking-widest text-background transition disabled:opacity-50"
          style={{
            background: "linear-gradient(180deg, oklch(0.92 0.16 200), oklch(0.78 0.18 200))",
            boxShadow: "0 0 0 1px var(--neon-cyan), 0 0 18px -4px var(--neon-cyan)",
          }}
        >
          <SparkIcon className="h-3.5 w-3.5" />
          GENERATE AI PLAN
        </button>
      </header>

      {status === "error" ? (
        <div className="p-4">
          <div className="panel panel-red flex items-start gap-3 p-4">
            <AlertIcon className="h-5 w-5 neon-text-red" />
            <div>
              <div className="font-display text-[11px] tracking-widest neon-text-red">
                AI PIPELINE UNREACHABLE
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground tracking-widest">
                Failed to compile response. Verify telemetry, then retry generation.
              </p>
            </div>
          </div>
        </div>
      ) : !active ? (
        <div className="p-6">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SECTIONS.map((s) => {
              const c = TONE[s.tone];
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="rounded-md border border-border/50 bg-background/40 p-3 opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: c }} />
                    <span className="font-display text-[10px] tracking-widest text-muted-foreground">
                      {s.title.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-background/70 overflow-hidden">
                    <div className="h-full w-[8%]" style={{ background: "var(--muted)" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-[11px] tracking-widest text-muted-foreground">
            {status === "simulating"
              ? "STREAMING DIRECTIVES FROM CASCADE MODEL..."
              : "AWAITING SIMULATION TO BUILD A RESPONSE PLAN."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 p-3 lg:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map((s) => {
            const c = TONE[s.tone];
            const Icon = s.icon;
            const isOpen = open[s.id] ?? false;
            return (
              <div
                key={s.id}
                className="rounded-md border bg-background/40"
                style={{ borderColor: `${c}40` }}
              >
                <button
                  onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded-md border"
                    style={{ borderColor: c, color: c }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 font-display text-[11px] tracking-[0.25em]" style={{ color: c }}>
                    {s.title}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{s.items.length}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <ul className="space-y-1.5 border-t border-border/40 px-3 py-2.5">
                    {s.items.map((it, i) => (
                      <li key={i} className="flex gap-2 text-[12px] text-foreground/90 leading-relaxed">
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                          style={{ background: c, boxShadow: `0 0 6px ${c}` }}
                        />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
