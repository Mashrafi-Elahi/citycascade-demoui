import { CityIcon, DatabaseIcon, ShieldIcon, ClockIcon } from "./icons";
import { useEffect, useState } from "react";

interface Props {
  city: string;
  status: "idle" | "simulating" | "active" | "error";
  dbMode: string;
}

const STATUS_MAP = {
  idle:       { label: "STANDBY",        color: "neon-text-cyan",  dot: "var(--neon-cyan)" },
  simulating: { label: "SIMULATING",     color: "neon-text-amber", dot: "var(--neon-amber)" },
  active:     { label: "RESPONSE ACTIVE",color: "neon-text-red",   dot: "var(--neon-red)" },
  error:      { label: "SYSTEM ALERT",   color: "neon-text-red",   dot: "var(--neon-red)" },
};

export function StatusBar({ city, status, dbMode }: Props) {
  const s = STATUS_MAP[status];
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toISOString().slice(11, 19) + " UTC");
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <header className="panel relative flex h-14 items-center gap-4 px-4 mx-3 mt-3 overflow-hidden">
      <div className="flex items-center gap-3 pr-4 border-r border-border/60">
        <div className="relative grid h-8 w-8 place-items-center rounded-md bg-background/60 panel-cyan">
          <ShieldIcon className="h-4 w-4 neon-text-cyan" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm tracking-[0.25em] neon-text-cyan">CityCascade</div>
          <div className="text-[10px] text-muted-foreground tracking-widest">AI · DISASTER OPS v0.9</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <CityIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">CITY</span>
        <span className="font-display tracking-widest text-foreground">{city}</span>
      </div>

      <div className="flex items-center gap-2 text-xs pl-4 border-l border-border/60">
        <ClockIcon className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-muted-foreground">{time}</span>
      </div>

      <div className="ml-auto flex items-center gap-5">
        <div className="flex items-center gap-2 text-xs">
          <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">DB</span>
          <span className="font-display tracking-widest text-foreground">{dbMode}</span>
          <span
            className="ml-1 inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--neon-green)", boxShadow: "0 0 8px var(--neon-green)" }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className="pulse-dot inline-block h-2 w-2 rounded-full"
            style={{ color: s.dot, background: s.dot, boxShadow: `0 0 10px ${s.dot}` }}
          />
          <span className={`font-display tracking-[0.25em] ${s.color}`}>{s.label}</span>
        </div>
      </div>
    </header>
  );
}
