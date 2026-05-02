import { SAMPLE_ROADS, SEVERITY_COLOR, SEVERITY_LABEL } from "./data";
import { RoadIcon } from "./icons";
import { Panel, EmptyMini } from "./ZoneRiskList";

export function RoadBlockPanel({ active }: { active: boolean }) {
  const roads = active ? SAMPLE_ROADS : [];
  return (
    <Panel title="Road Disruption" subtitle={active ? `${roads.length} segments compromised` : "no incidents"}>
      {!active ? (
        <EmptyMini text="Road network clear" />
      ) : (
        <ul className="space-y-1.5">
          {roads.map((r) => {
            const c = SEVERITY_COLOR[r.severity];
            return (
              <li
                key={r.id}
                className="flex items-center gap-2 rounded-md border border-border/60 bg-background/40 px-2.5 py-2"
              >
                <RoadIcon className="h-4 w-4" style={{ color: c }} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] text-foreground">{r.name}</div>
                  <div className="text-[10px] tracking-widest text-muted-foreground uppercase">
                    {r.type} · {SEVERITY_LABEL[r.severity]}
                  </div>
                </div>
                <span className="font-display text-[11px] tabular-nums" style={{ color: c }}>
                  {r.delay}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
