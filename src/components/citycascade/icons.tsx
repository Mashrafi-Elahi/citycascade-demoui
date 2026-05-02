import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const FloodIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 17c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2" />
    <path d="M3 21c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2" />
    <path d="M7 13V6a3 3 0 0 1 6 0v1" />
    <path d="M14 11l3-3 4 4" />
  </svg>
);

export const FireIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3c1 3 4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-5 1 1 2 1 3-3z" />
    <path d="M10 16a2 2 0 1 0 4 0c0-1.2-1-1.6-1.5-2.5-.4 1-1 .8-1.4 1.6-.3.4-1.1.5-1.1.9z" />
  </svg>
);

export const RainIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M7 15a4 4 0 0 1-1-7.9 5 5 0 0 1 9.7-1A4 4 0 0 1 18 15" />
    <path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2" />
  </svg>
);

export const EarthquakeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M2 12h3l2-5 3 10 3-8 2 6 2-3h5" />
  </svg>
);

export const CrashIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 17v-3l2-4h6l2 4v3" />
    <circle cx="6" cy="17" r="1.6" />
    <circle cx="11" cy="17" r="1.6" />
    <path d="M14 8l3-3M19 9l3-1M17 12l3 1" />
    <path d="M15 13l2 2-2 1" />
  </svg>
);

export const VirusIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4" />
    <circle cx="12" cy="4" r=".8" />
    <circle cx="12" cy="20" r=".8" />
    <circle cx="4" cy="12" r=".8" />
    <circle cx="20" cy="12" r=".8" />
  </svg>
);

export const SmogIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 10h10a3 3 0 1 0-2.8-4.1" />
    <path d="M3 14h14M5 18h12M7 21h9" />
  </svg>
);

export const PowerIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

export const DropContamIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3c3 5 6 7 6 11a6 6 0 1 1-12 0c0-4 3-6 6-11z" />
    <path d="M9.5 13l5 5M14.5 13l-5 5" />
  </svg>
);

/* UI icons */
export const AlertIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3l10 18H2L12 3z" />
    <path d="M12 10v5M12 18v.5" />
  </svg>
);
export const HospitalIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 21V8l8-5 8 5v13" />
    <path d="M9 21v-5h6v5" />
    <path d="M12 9v4M10 11h4" />
  </svg>
);
export const RoadIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 21L9 3M19 21l-4-18M12 6v2M12 12v2M12 18v2" />
  </svg>
);
export const PeopleIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M15 21c0-2.5 1.8-4.5 4-4.5" />
  </svg>
);
export const PlayIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 4l14 8-14 8V4z" />
  </svg>
);
export const ResetIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);
export const PlusIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M5 12h14" /></svg>
);
export const LayersIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5M3 17l9 5 9-5" />
  </svg>
);
export const CrosshairIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M12 12h.01" />
  </svg>
);
export const PinIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
export const CityIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 21V10l5-3v14M9 21V5l6 3v13M15 21V11l5 2v8" />
    <path d="M3 21h18" />
  </svg>
);
export const DatabaseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
    <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
  </svg>
);
export const SparkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
);
export const ShieldIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
  </svg>
);
export const RouteIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="5" r="2" />
    <path d="M8 19h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6" />
  </svg>
);
export const MegaphoneIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 11v2a2 2 0 0 0 2 2h2l8 5V4L7 9H5a2 2 0 0 0-2 2z" />
    <path d="M18 8a4 4 0 0 1 0 8" />
  </svg>
);
export const HeartPulseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 11h4l2-3 3 6 2-4 2 1h5" />
    <path d="M20.8 13.5A6 6 0 0 0 12 6a6 6 0 0 0-8.8 7.5" />
  </svg>
);
export const EvacIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 4h4v16h-4" />
    <path d="M3 12h11M9 7l5 5-5 5" />
  </svg>
);
export const InfraIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 21V9l9-6 9 6v12" />
    <path d="M9 21v-6h6v6M3 13h18" />
  </svg>
);
export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base} {...p}><path d="M6 9l6 6 6-6" /></svg>
);
export const ClockIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);
export const BrushIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 3l7 7-9 9-5 1 1-5 6-12z" />
    <path d="M9 19l-4 2 2-4" />
  </svg>
);
export const TargetIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" />
  </svg>
);

export type DisasterId =
  | "flood" | "fire" | "rain" | "earthquake" | "crash"
  | "dengue" | "smog" | "outage" | "waste" | "water";

export const DisasterIconMap: Record<DisasterId, (p: IconProps) => React.ReactElement> = {
  flood: FloodIcon,
  fire: FireIcon,
  rain: RainIcon,
  earthquake: EarthquakeIcon,
  crash: CrashIcon,
  dengue: VirusIcon,
  smog: SmogIcon,
  outage: PowerIcon,
  waste: TrashIcon,
  water: DropContamIcon,
};
