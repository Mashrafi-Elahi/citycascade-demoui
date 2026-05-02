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
    <div className="space-y-2">
      <SectionLabel>Disaster Vector</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {DISASTERS.map((d) => {
          const Icon = DisasterIconMap[d.id];
          const isSel = selected === d.id;
          const c = TONE[d.tone];
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              className={[
                "group relative overflow-hidden rounded-md border bg-background/40 px-3 py-2.5 text-left transition",
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
              <div className="flex items-center gap-2.5">
                <span
                  className="grid h-8 w-8 place-items-center rounded-md border bg-background/60"
                  style={{ borderColor: `${c}`, color: c }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-display tracking-widest text-foreground">
                    {d.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground tracking-widest">{d.short}</div>
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
