import { useState } from "react";
import {
  RouteIcon,
  HospitalIcon,
  HeartPulseIcon,
  InfraIcon,
  EvacIcon,
  MegaphoneIcon,
  ChevronDownIcon,
  SparkIcon,
  AlertIcon,
  ClockIcon,
  TargetIcon,
} from "./icons";
import type { Disaster } from "./data";
import type { SelectedZone } from "./MapPanel";
import { buildPlan, type PlanSection } from "./aiPlans";

const SECTION_META: Record<
  PlanSection["id"],
  { icon: (p: { className?: string; style?: React.CSSProperties }) => React.ReactElement; tone: "cyan" | "red" | "amber" }
> = {
  route: { icon: RouteIcon, tone: "cyan" },
  hosp: { icon: HospitalIcon, tone: "red" },
  health: { icon: HeartPulseIcon, tone: "amber" },
  infra: { icon: InfraIcon, tone: "cyan" },
  evac: { icon: EvacIcon, tone: "amber" },
  alert: { icon: MegaphoneIcon, tone: "red" },
};

const TONE: Record<"cyan" | "red" | "amber" | "green", string> = {
  cyan: "var(--neon-cyan)",
  red: "var(--neon-red)",
  amber: "var(--neon-amber)",
  green: "var(--neon-green)",
};

interface Props {
  status: "idle" | "simulating" | "active" | "error";
  disaster: Disaster | null;
  intensity: number;
  zone: SelectedZone | null;
  onGenerate: () => void;
  onReset: () => void;
}

export function AIResponsePanel({
  status,
  disaster,
  intensity,
  zone,
  onGenerate,
  onReset,
}: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({ route: true, hosp: true });
  const active = status === "active";

  const plan =
    active && disaster
      ? buildPlan(disaster.id, intensity, zone)
      : null;

  return (
    <section className="panel panel-cyan relative overflow-hidden" data-testid="ai-response-panel">
      <header className="flex flex-wrap items-center gap-3 border-b border-border/60 px-4 py-2.5">
        <SparkIcon className="h-4 w-4 neon-text-cyan" />
        <div className="flex-1 min-w-[220px]">
          <h2 className="font-display text-[12px] tracking-[0.3em] neon-text-cyan">
            AI Response Plan
          </h2>
          <p className="text-[10px] text-muted-foreground tracking-widest">
            {status === "active" &&
              plan &&
              `PLAN GENERATED · CONFIDENCE ${(plan.confidence * 100).toFixed(0)}%`}
            {status === "simulating" && "COMPILING DIRECTIVES..."}
            {status === "idle" && "PLAN UNAVAILABLE · RUN A SIMULATION"}
            {status === "error" && "GENERATION FAILED · RETRY"}
          </p>
        </div>

        {active && plan && (
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <TargetIcon className="h-3.5 w-3.5 neon-text-red" />
              {zone ? zone.name.toUpperCase() : "AREA-WIDE"}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5 neon-text-cyan" />
              ETA {plan.etaMinutes} MIN
            </span>
          </div>
        )}

        <button
          data-testid="reset-field-btn"
          onClick={onReset}
          className="hidden sm:inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/50 px-3 py-1.5 text-[11px] tracking-widest text-muted-foreground transition hover:border-[color:var(--neon-red)]/60 hover:text-[color:var(--neon-red)]"
        >
          RESET FIELD
        </button>
        <button
          data-testid="generate-ai-plan-btn"
          onClick={onGenerate}
          disabled={status === "simulating" || !disaster}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[11px] tracking-widest text-background transition disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.92 0.16 200), oklch(0.78 0.18 200))",
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
      ) : !active || !plan ? (
        <EmptyOrLoading status={status} />
      ) : (
        <>
          <div className="px-4 py-2 border-b border-border/40 bg-background/30 font-mono text-[11px] tracking-wider text-foreground/90">
            {plan.headline}
          </div>
          <div
            className="grid grid-cols-1 gap-2 p-3 lg:grid-cols-2 xl:grid-cols-3 max-h-[46vh] overflow-y-auto scroll-cyan"
            data-testid="ai-plan-grid"
          >
            {plan.sections.map((s) => {
              const meta = SECTION_META[s.id];
              const c = TONE[meta.tone];
              const Icon = meta.icon;
              const isOpen = open[s.id] ?? true;
              return (
                <div
                  key={s.id}
                  data-testid={`ai-plan-section-${s.id}`}
                  className="rounded-md border bg-background/40"
                  style={{ borderColor: `${c}40` }}
                >
                  <button
                    onClick={() =>
                      setOpen((o) => ({ ...o, [s.id]: !(o[s.id] ?? true) }))
                    }
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                  >
                    <span
                      className="grid h-7 w-7 place-items-center rounded-md border"
                      style={{ borderColor: c, color: c }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span
                      className="flex-1 font-display text-[11px] tracking-[0.2em] leading-tight"
                      style={{ color: c }}
                    >
                      {s.title}
                    </span>
                    <span
                      className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 rounded-sm border"
                      style={{
                        color: s.priority === "P0" ? "var(--neon-red)" : s.priority === "P1" ? "var(--neon-amber)" : "var(--neon-cyan)",
                        borderColor:
                          s.priority === "P0"
                            ? "oklch(0.68 0.27 22 / 0.5)"
                            : s.priority === "P1"
                              ? "oklch(0.82 0.17 75 / 0.5)"
                              : "oklch(0.78 0.18 200 / 0.5)",
                      }}
                    >
                      {s.priority}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {s.items.length}
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <ul className="space-y-1.5 border-t border-border/40 px-3 py-2.5">
                      {s.items.map((it, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-[12px] text-foreground/90 leading-relaxed"
                        >
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
        </>
      )}
    </section>
  );
}

function EmptyOrLoading({ status }: { status: Props["status"] }) {
  const items: { id: PlanSection["id"]; title: string }[] = [
    { id: "route", title: "Emergency Routing" },
    { id: "hosp", title: "Hospital Allocation" },
    { id: "health", title: "Public Health" },
    { id: "infra", title: "Infrastructure" },
    { id: "evac", title: "Evacuation" },
    { id: "alert", title: "Citizen Alerts" },
  ];
  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((s) => {
          const meta = SECTION_META[s.id];
          const c = TONE[meta.tone];
          const Icon = meta.icon;
          return (
            <div
              key={s.id}
              className="rounded-md border border-border/50 bg-background/40 p-3 opacity-70"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: c }} />
                <span className="font-display text-[10px] tracking-widest text-muted-foreground">
                  {s.title.toUpperCase()}
                </span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-background/70 overflow-hidden">
                <div
                  className={status === "simulating" ? "h-full" : "h-full w-[8%]"}
                  style={{
                    background: status === "simulating" ? c : "var(--muted)",
                    width: status === "simulating" ? `${20 + Math.random() * 60}%` : undefined,
                    boxShadow: status === "simulating" ? `0 0 8px ${c}` : undefined,
                    transition: "width 400ms",
                  }}
                />
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
  );
}
