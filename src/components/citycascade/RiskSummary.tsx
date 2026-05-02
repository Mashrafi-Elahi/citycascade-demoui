import { PeopleIcon, HospitalIcon, RoadIcon, DropContamIcon, VirusIcon } from "./icons";
import type * as React from "react";

interface Metric {
  label: string;
  value: string;
  delta: string;
  tone: "red" | "amber" | "cyan" | "green";
  icon: (p: { className?: string; style?: React.CSSProperties }) => React.ReactElement;
  progress: number;
}

interface RiskData {
  affectedPopulation: number;
  hospitalStrain: number;
  roadsBlocked: number;
  waterContamination: number;
  diseaseRisk: number;
}

interface Props {
  active: boolean;
  data?: RiskData | null;
}

const TONE: Record<Metric["tone"], string> = {
  red: "var(--neon-red)",
  amber: "var(--neon-amber)",
  cyan: "var(--neon-cyan)",
  green: "var(--neon-green)",
};

export function RiskSummary({ active, data }: Props) {
  const metrics: Metric[] = [
    { label: "Affected Population", value: active && data ? data.affectedPopulation.toLocaleString() : "—", delta: active ? "+ live" : "idle", tone: "red", icon: PeopleIcon, progress: data?.affectedPopulation ? Math.min(100, data.affectedPopulation / 6000) : 8 },
    { label: "Hospital Strain", value: active && data ? `${data.hospitalStrain}%` : "—", delta: active ? "capacity" : "idle", tone: "amber", icon: HospitalIcon, progress: data?.hospitalStrain ?? 8 },
    { label: "Roads Blocked", value: active && data ? `${data.roadsBlocked}` : "—", delta: active ? "links" : "idle", tone: "amber", icon: RoadIcon, progress: data?.roadsBlocked ? Math.min(100, data.roadsBlocked * 5) : 8 },
    { label: "Water Contamination", value: active && data ? `${data.waterContamination}%` : "—", delta: active ? "quality" : "idle", tone: "red", icon: DropContamIcon, progress: data?.waterContamination ?? 8 },
    { label: "Disease Risk", value: active && data ? `${data.diseaseRisk}/100` : "—", delta: active ? "spread" : "idle", tone: "amber", icon: VirusIcon, progress: data?.diseaseRisk ?? 8 },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map((m) => {
        const c = TONE[m.tone];
        const Icon = m.icon;
        return (
          <div key={m.label} className="panel relative overflow-hidden p-3" style={active ? { boxShadow: `0 0 0 1px ${c}40, 0 0 18px -8px ${c}` } : undefined}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-widest text-muted-foreground">{m.label.toUpperCase()}</span>
              <Icon className="h-4 w-4" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-xl tabular-nums" style={active ? { color: c, textShadow: `0 0 10px ${c}` } : { color: "var(--muted-foreground)" }}>{m.value}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{m.delta}</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-background/70 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${active ? m.progress : 8}%`, background: active ? c : "var(--muted)", boxShadow: active ? `0 0 8px ${c}` : undefined }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
