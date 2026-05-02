import { SectionLabel } from "./CitySelector";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function IntensitySlider({ value, onChange }: Props) {
  const pct = ((value - 1) / 9) * 100;
  const color =
    value <= 3 ? "var(--neon-green)" :
    value <= 6 ? "var(--neon-amber)" : "var(--neon-red)";

  return (
    <div className="space-y-3">
      <SectionLabel>Intensity</SectionLabel>
      <div className="px-1">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-[10px] tracking-widest text-muted-foreground">LEVEL</span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl tabular-nums" style={{ color, textShadow: `0 0 12px ${color}` }}>
              {value.toString().padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground">/10</span>
          </div>
        </div>

        <div className="relative h-2 rounded-full bg-background/70 border border-border/60">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, var(--neon-green), var(--neon-amber), var(--neon-red))`,
              boxShadow: `0 0 12px ${color}`,
            }}
          />
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full cursor-pointer opacity-0"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 pointer-events-none"
            style={{
              left: `${pct}%`,
              background: "var(--background)",
              borderColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[9px] tracking-widest text-muted-foreground font-mono">
          <span>MIN</span><span>MOD</span><span>SEVERE</span><span>MAX</span>
        </div>
      </div>
    </div>
  );
}
