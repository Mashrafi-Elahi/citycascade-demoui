import { DISASTERS, type Disaster } from "./data";
import { DisasterIconMap } from "./icons";
import { SectionLabel } from "./CitySelector";

interface Props {
  selected: Disaster["id"] | null;
  onSelect: (id: Disaster["id"]) => void;
}

const TONE: Record<Disaster["tone"], string> = {
  red: "var(--neon-red)",
  amber: "var(--neon-amber)",
  cyan: "var(--neon-cyan)",
  violet: "var(--neon-violet)",
};

export function DisasterSelector({ selected, onSelect }: Props) {
  return (
    <div className="space-y-2" data-testid="disaster-selector">
      <SectionLabel>Disaster Vector</SectionLabel>
      <div className="grid grid-cols-2 gap-1.5">
        {DISASTERS.map((d) => {
          const Icon = DisasterIconMap[d.id];
          const isSel = selected === d.id;
          const c = TONE[d.tone];
          return (
            <button
              data-testid={`disaster-item-${d.id}`}
              key={d.id}
              onClick={() => onSelect(d.id)}
              className={[
                "group relative overflow-hidden rounded-md border bg-background/40 px-2 py-2 text-left transition min-h-[60px]",
                "hover:bg-background/70",
                isSel ? "border-transparent" : "border-border/50",
              ].join(" ")}
              style={
                isSel
                  ? {
                      boxShadow: `0 0 0 1px ${c}, 0 0 18px -4px ${c}`,
                      background:
                        "linear-gradient(180deg, oklch(0.24 0.04 250 / 0.8), oklch(0.18 0.035 250 / 0.7))",
                    }
                  : undefined
              }
            >
              <div className="flex items-start gap-2">
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md border bg-background/60"
                  style={{ borderColor: c, color: c }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-display tracking-[0.1em] text-foreground leading-tight break-words">
                    {d.name}
                  </div>
                  <div className="mt-0.5 text-[9px] text-muted-foreground tracking-widest">
                    {d.short}
                  </div>
                </div>
              </div>
              {isSel && (
                <span
                  className="absolute inset-x-0 bottom-0 h-px"
                  style={{ background: c, boxShadow: `0 0 10px ${c}` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
