import type { DisasterId } from "./icons";

export type Severity = "safe" | "warn" | "danger" | "critical";

export interface Disaster {
  id: DisasterId;
  name: string;
  short: string;
  tone: "red" | "amber" | "cyan" | "violet";
}

export const DISASTERS: Disaster[] = [
  { id: "flood", name: "Urban Flood", short: "FLD", tone: "cyan" },
  { id: "fire", name: "Building Fire", short: "FIR", tone: "red" },
  { id: "rain", name: "Heavy Rain", short: "RAN", tone: "cyan" },
  { id: "earthquake", name: "Earthquake", short: "EQK", tone: "amber" },
  { id: "crash", name: "Major Road Accident", short: "ACC", tone: "amber" },
  { id: "dengue", name: "Dengue Outbreak", short: "DNG", tone: "violet" },
  { id: "smog", name: "Air Pollution Spike", short: "AIR", tone: "amber" },
  { id: "outage", name: "Power Outage", short: "PWR", tone: "amber" },
  { id: "waste", name: "Waste Overflow", short: "WST", tone: "violet" },
  { id: "water", name: "Water Contamination", short: "H2O", tone: "red" },
];

export interface CityOption {
  id: string;
  name: string;
  country: string;
  active: boolean;
}

export const CITIES: CityOption[] = [
  { id: "dhaka", name: "Dhaka", country: "Bangladesh", active: true },
  { id: "chittagong", name: "Chittagong", country: "Bangladesh", active: false },
  { id: "sylhet", name: "Sylhet", country: "Bangladesh", active: false },
  { id: "khulna", name: "Khulna", country: "Bangladesh", active: false },
  { id: "rajshahi", name: "Rajshahi", country: "Bangladesh", active: false },
  { id: "tokyo", name: "Tokyo", country: "Japan", active: false },
  { id: "newyork", name: "New York", country: "United States", active: false },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", active: false },
  { id: "manila", name: "Manila", country: "Philippines", active: false },
];

export interface ZoneRisk {
  id: string;
  name: string;
  severity: Severity;
  score: number; // 0-100
  population: number;
}

export const SAMPLE_ZONES: ZoneRisk[] = [
  { id: "z1", name: "Old Dhaka — Sutrapur", severity: "critical", score: 92, population: 84000 },
  { id: "z2", name: "Motijheel CBD", severity: "danger", score: 78, population: 56000 },
  { id: "z3", name: "Dhanmondi", severity: "warn", score: 54, population: 73000 },
  { id: "z4", name: "Mirpur 10", severity: "danger", score: 71, population: 112000 },
  { id: "z5", name: "Gulshan 2", severity: "warn", score: 41, population: 48000 },
  { id: "z6", name: "Uttara Sector 7", severity: "safe", score: 22, population: 65000 },
];

export interface Hospital {
  id: string;
  name: string;
  capacity: number; // % filled
  beds: number;
  status: Severity;
}

export const SAMPLE_HOSPITALS: Hospital[] = [
  { id: "h1", name: "Dhaka Medical College", capacity: 94, beds: 2200, status: "critical" },
  { id: "h2", name: "Square Hospital", capacity: 81, beds: 650, status: "danger" },
  { id: "h3", name: "United Hospital", capacity: 67, beds: 500, status: "warn" },
  { id: "h4", name: "Holy Family Red Crescent", capacity: 88, beds: 580, status: "danger" },
  { id: "h5", name: "Apollo Hospitals", capacity: 52, beds: 425, status: "warn" },
];

export interface RoadBlock {
  id: string;
  name: string;
  severity: Severity;
  delay: string;
  type: "flooded" | "debris" | "closed" | "fire";
}

export const SAMPLE_ROADS: RoadBlock[] = [
  { id: "r1", name: "Mayor Hanif Flyover", severity: "critical", delay: "+45 min", type: "flooded" },
  { id: "r2", name: "Mirpur Road @ Dhanmondi 27", severity: "danger", delay: "+22 min", type: "debris" },
  { id: "r3", name: "Pragati Sarani — Badda", severity: "warn", delay: "+12 min", type: "closed" },
  { id: "r4", name: "Airport Road — Banani", severity: "danger", delay: "+28 min", type: "flooded" },
];

export const SEVERITY_COLOR: Record<Severity, string> = {
  safe: "var(--neon-green)",
  warn: "var(--neon-amber)",
  danger: "var(--neon-red)",
  critical: "var(--neon-red)",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  safe: "STABLE",
  warn: "ELEVATED",
  danger: "HIGH",
  critical: "CRITICAL",
};
