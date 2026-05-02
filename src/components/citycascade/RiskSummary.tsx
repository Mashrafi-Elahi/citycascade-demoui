import { PeopleIcon, HospitalIcon, RoadIcon, DropContamIcon, VirusIcon } from "./icons";
import type { JSX } from "react";

interface Metric {
  label: string;
  value: string;
  delta: string;
  tone: "red" | "amber" | "cyan" | "green";
  icon: (p: { className?: string }) => JSX.Element;
}

interface Props {
  active: boolean;
}

const TONE: Record<Metric["tone"], string> = {
  red: "var(--neon-red)",
  amber: "var(--neon-amber)",
  cyan: "var(--neon-cyan)",
  green: "var(--neon-green)",
};

export function RiskSummary({ active }: Props) {
  const metrics: Metric[] = [
    { label: "Affected Population", value: active ? "438,210" : "—", delta: active ? "+12.4%" : "idle", tone: "red", icon: PeopleIcon },
    { label: "Hospital Strain", value: active ? "82%" : "—", delta: active ? "+9 pts" : "idle", tone: "amber", icon: HospitalIcon },
    { label: "Roads Blocked", value: active ? "27" : "—", delta: active ? "+11" : "idle", tone: "amber", icon: RoadIcon },
    { label: "Water Contamination", value: active ? "HIGH" : "—", delta: active ? "Δ rising" : "idle", tone: "red", icon: DropContamIcon },
    { label: "Disease Risk", value: active ? "ELEVATED" : "—", delta: active ? "72/100" : "idle", tone: "amber", icon: VirusIcon },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map((m) => {
        const c = TONE[m.tone];
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className="panel relative overflow-hidden p-3"
            style={active ? { boxShadow: `0 0 0 1px ${c}40, 0 0 18px -8px ${c}` } : undefined}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest text-muted-foreground">{m.label.toUpperCase()}</span>
              <Icon className="h-4 w-4" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span
                className="font-display text-xl tabular-nums"
                style={active ? { color: c, textShadow: `0 0 10px ${c}` } : { color: "var(--muted-foreground)" }}
              >
                {m.value}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{m.delta}</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-background/70 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: active ? "72%" : "8%",
                  background: active ? c : "var(--muted)",
                  boxShadow: active ? `0 0 8px ${c}` : undefined,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
