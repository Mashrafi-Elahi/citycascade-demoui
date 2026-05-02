import { SAMPLE_HOSPITALS, SEVERITY_COLOR } from "./data";
import { HospitalIcon } from "./icons";
import { Panel, EmptyMini } from "./ZoneRiskList";

export function HospitalStatusPanel({ active }: { active: boolean }) {
  const hospitals = active ? SAMPLE_HOSPITALS : [];

  return (
    <Panel title="Hospital Capacity" subtitle={active ? `${hospitals.length} facilities online` : "standby"}>
      {!active ? (
        <EmptyMini text="No live capacity data" />
      ) : (
        <ul className="space-y-2.5">
          {hospitals.map((h) => {
            const c = SEVERITY_COLOR[h.status];
            return (
              <li key={h.id}>
                <div className="flex items-center gap-2 text-[12px]">
                  <HospitalIcon className="h-3.5 w-3.5" style={{ color: c }} />
                  <span className="flex-1 truncate text-foreground">{h.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{h.beds} beds</span>
                  <span className="font-display tabular-nums text-[11px]" style={{ color: c }}>
                    {h.capacity}%
                  </span>
                </div>
                <div className="mt-1 relative h-2 rounded-full bg-background/70 border border-border/60 overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${h.capacity}%`,
                      background: `linear-gradient(90deg, ${c}55, ${c})`,
                      boxShadow: `0 0 10px ${c}`,
                    }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-px"
                    style={{ left: "85%", background: "var(--neon-red)", opacity: 0.5 }}
                    title="Surge threshold"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
