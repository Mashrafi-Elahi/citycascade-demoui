import { useMemo, useState } from "react";
import { CITIES } from "./data";
import { CityIcon, PinIcon, SearchIcon } from "./icons";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
  onUpcomingSelect?: (name: string) => void;
}

export function CitySelector({ selected, onSelect, onUpcomingSelect }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return CITIES;
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.country.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <div className="space-y-2" data-testid="city-selector">
      <SectionLabel>City Grid</SectionLabel>

      {/* Search index */}
      <label className="relative block">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
          <SearchIcon className="h-3.5 w-3.5" />
        </span>
        <input
          data-testid="city-search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search cities (Dhaka, Tokyo, Manila...)"
          className="w-full rounded-md border border-border/60 bg-background/50 pl-7 pr-2 py-1.5 font-mono text-[11px] tracking-wider text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--neon-cyan)]/70"
        />
      </label>

      <div
        className="grid grid-cols-2 gap-2 max-h-[236px] overflow-y-auto pr-1 scroll-cyan"
        data-testid="city-list"
      >
        {filtered.map((c) => {
          const active = c.active;
          const isSel = selected === c.id;
          return (
            <button
              data-testid={`city-item-${c.id}`}
              key={c.id}
              
              onClick={() => {
                if (active) onSelect(c.id);
                else onUpcomingSelect?.(c.name);
              }}
              className={[
                "group relative overflow-hidden rounded-md border px-2.5 py-2 text-left transition",
                "disabled:cursor-not-allowed",
                active
                  ? "border-[color:var(--neon-cyan)]/30 hover:border-[color:var(--neon-cyan)]/70 bg-background/40"
                  : "border-[color:var(--neon-red)]/25 bg-background/20",
                isSel && "panel-cyan bg-background/60",
              ]
                .filter(Boolean)
                .join(" ")}
              style={
                !active
                  ? {
                      boxShadow:
                        "inset 0 0 0 1px oklch(0.68 0.27 22 / 0.15), 0 0 16px -8px oklch(0.68 0.27 22 / 0.55)",
                    }
                  : undefined
              }
            >
              <div className="flex items-center gap-2">
                {active ? (
                  <PinIcon className="h-4 w-4 shrink-0 neon-text-cyan" />
                ) : (
                  <CityIcon className="h-4 w-4 shrink-0 neon-text-red opacity-80" />
                )}
                <div className="min-w-0 flex-1">
                  <div
                    className={[
                      "text-[12px] font-display tracking-[0.15em] leading-tight",
                      active ? "text-foreground" : "text-foreground/70",
                    ].join(" ")}
                  >
                    {c.name}
                  </div>
                  <div className="text-[9px] text-muted-foreground tracking-widest">
                    {c.country}
                  </div>
                </div>
                {!active && (
                  <span
                    className="rounded-sm border px-1.5 py-0.5 text-[8px] font-display tracking-[0.15em] neon-text-red shrink-0"
                    style={{
                      borderColor: "oklch(0.68 0.27 22 / 0.6)",
                      boxShadow: "0 0 8px -2px oklch(0.68 0.27 22 / 0.7)",
                    }}
                  >
                    UPCOMING
                  </span>
                )}
                {isSel && (
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      background: "var(--neon-cyan)",
                      boxShadow: "0 0 8px var(--neon-cyan)",
                    }}
                  />
                )}
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-4 text-[11px] tracking-widest text-muted-foreground">
            NO CITIES MATCH — TRY ANOTHER NAME
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <span
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.18 200 / 0.4), transparent)",
        }}
      />
      <span className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">
        {children}
      </span>
      <span
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.18 200 / 0.4), transparent)",
        }}
      />
    </div>
  );
}
