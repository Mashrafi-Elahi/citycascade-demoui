import { CITIES } from "./data";
import { CityIcon, PinIcon } from "./icons";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export function CitySelector({ selected, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <SectionLabel>City Grid</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        {CITIES.map((c) => {
          const active = c.active;
          const isSel = selected === c.id;
          return (
            <button
              key={c.id}
              disabled={!active}
              onClick={() => active && onSelect(c.id)}
              className={[
                "group relative overflow-hidden rounded-md border px-3 py-2 text-left transition",
                "disabled:cursor-not-allowed",
                active
                  ? "border-[color:var(--neon-cyan)]/30 hover:border-[color:var(--neon-cyan)]/70 bg-background/40"
                  : "border-border/40 bg-background/20 opacity-70",
                isSel && "panel-cyan bg-background/60",
              ].filter(Boolean).join(" ")}
            >
              <div className="flex items-center gap-2">
                {active ? (
                  <PinIcon className="h-4 w-4 neon-text-cyan" />
                ) : (
                  <CityIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-display tracking-widest">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground">{c.country}</div>
                </div>
                {!active && (
                  <span className="rounded-sm border border-[color:var(--neon-red)]/50 px-1.5 py-0.5 text-[9px] font-display tracking-widest neon-text-red">
                    UPCOMING
                  </span>
                )}
                {isSel && (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--neon-cyan)", boxShadow: "0 0 8px var(--neon-cyan)" }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <span
        className="h-px flex-1"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.78 0.18 200 / 0.4), transparent)" }}
      />
      <span className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">{children}</span>
      <span
        className="h-px flex-1"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.78 0.18 200 / 0.4), transparent)" }}
      />
    </div>
  );
}
