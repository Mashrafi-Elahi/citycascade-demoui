import { SAMPLE_ZONES, SEVERITY_COLOR, SEVERITY_LABEL } from "./data";
import { CrosshairIcon } from "./icons";

export function ZoneRiskList({ active }: { active: boolean }) {
  const zones = active ? SAMPLE_ZONES : [];

  return (
    <Panel title="Zone Risk Index" subtitle={active ? `${zones.length} zones tracked` : "awaiting data"}>
      {!active ? (
        <EmptyMini text="No active simulation" />
      ) : (
        <ul className="space-y-2">
          {zones.map((z) => {
            const c = SEVERITY_COLOR[z.severity];
            return (
              <li key={z.id} className="rounded-md border border-border/60 bg-background/40 p-2.5">
                <div className="flex items-center gap-2">
                  <CrosshairIcon className="h-3.5 w-3.5" style={{ color: c }} />
                  <span className="text-[12px] text-foreground flex-1 truncate">{z.name}</span>
                  <span
                    className="font-display text-[9px] tracking-widest"
                    style={{ color: c }}
                  >
                    {SEVERITY_LABEL[z.severity]}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="relative h-1.5 flex-1 rounded-full bg-background/80 border border-border/60 overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${z.score}%`,
                        background: c,
                        boxShadow: `0 0 8px ${c}`,
                      }}
                    />
                  </div>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground w-8 text-right">{z.score}</span>
                  <span className="font-mono text-[10px] text-muted-foreground w-14 text-right">
                    {(z.population / 1000).toFixed(0)}k pop
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

export function Panel({
  title,
  subtitle,
  children,
  tone = "cyan",
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: "cyan" | "red";
  action?: React.ReactNode;
}) {
  return (
    <section className={`panel ${tone === "red" ? "panel-red" : ""} p-3`}>
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3
            className={`font-display text-[11px] tracking-[0.3em] ${
              tone === "red" ? "neon-text-red" : "neon-text-cyan"
            }`}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] tracking-widest text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function EmptyMini({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center rounded-md border border-dashed border-border/50 bg-background/30 px-3 py-6 text-[11px] tracking-widest text-muted-foreground">
      {text.toUpperCase()}
    </div>
  );
}
