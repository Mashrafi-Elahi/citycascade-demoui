import type { DisasterId } from "./icons";

/**
 * Realistic per-disaster response plan content.
 * Populated into the AI Response cards after simulation.
 * Replace with your /api/ai route output later — the shape
 * is identical to what a real LLM should return.
 */
export interface PlanSection {
  id: "route" | "hosp" | "health" | "infra" | "evac" | "alert";
  title: string;
  items: string[];
  priority: "P0" | "P1" | "P2";
}

export interface DisasterPlan {
  headline: string;
  confidence: number; // 0..1
  etaMinutes: number; // time-to-execute
  sections: PlanSection[];
}

type ZoneCtx = { name?: string; population?: number };

export function buildPlan(
  disaster: DisasterId,
  intensity: number,
  zone: ZoneCtx | null,
): DisasterPlan {
  const z = zone?.name ?? "primary impact polygon";
  const pop = zone?.population
    ? `${(zone.population / 1000).toFixed(0)}k residents`
    : "residents in impact polygon";
  const sev = intensity >= 8 ? "P0" : intensity >= 5 ? "P1" : "P2";

  const common = {
    headline: HEADLINES[disaster](z, intensity),
    confidence: 0.78 + Math.min(0.18, intensity / 60),
    etaMinutes: 20 + intensity * 3,
  };

  return { ...common, sections: PLAYBOOKS[disaster](z, pop, sev) };
}

const HEADLINES: Record<DisasterId, (z: string, i: number) => string> = {
  flood: (z, i) => `Urban flood response for ${z} — intensity ${i}/10`,
  fire: (z, i) => `Structural fire containment at ${z} — intensity ${i}/10`,
  rain: (z, i) => `Heavy rainfall + drainage surge near ${z} — intensity ${i}/10`,
  earthquake: (z, i) => `Seismic response around ${z} — intensity ${i}/10`,
  crash: (z, i) => `Mass-casualty road incident near ${z} — intensity ${i}/10`,
  dengue: (z, i) => `Dengue outbreak vector control for ${z} — intensity ${i}/10`,
  smog: (z, i) => `Air quality crisis centred on ${z} — intensity ${i}/10`,
  outage: (z, i) => `Grid cascade failure near ${z} — intensity ${i}/10`,
  waste: (z, i) => `Waste overflow + sanitation event in ${z} — intensity ${i}/10`,
  water: (z, i) => `Water contamination event affecting ${z} — intensity ${i}/10`,
};

type Builder = (z: string, pop: string, sev: "P0" | "P1" | "P2") => PlanSection[];

const PLAYBOOKS: Record<DisasterId, Builder> = {
  flood: (z, pop, sev) => [
    s("route", "Emergency Routing", sev, [
      `Close Mayor Hanif Flyover approach; divert traffic via Hatirjheel link.`,
      `Activate contraflow on Mirpur Road segment 4 → 7 for rescue fleet.`,
      `Signal priority for 37 ambulances + 18 boat-transport trucks.`,
    ]),
    s("hosp", "Hospital Allocation", "P0", [
      `Divert non-critical intake from Dhaka Medical (94%) to Apollo (52%).`,
      `Pre-stage 220 surge beds via United + Square partnership.`,
      `Dispatch 12 mobile triage units to ${z} risk corridor.`,
    ]),
    s("health", "Public Health", "P1", [
      `Issue waterborne illness advisory for ${z} and adjacent wards.`,
      `Deploy 40k ORS kits + 200k chlorine tablets within 6 hours.`,
      `Activate dengue vector control in standing-water hotspots.`,
    ]),
    s("infra", "Infrastructure", sev, [
      `Isolate sub-stations 14 & 22 to prevent cascading outage.`,
      `Pre-position 28 dewatering pumps at flagged underpasses.`,
      `Cellular load-balance across 3 telco carriers in affected cells.`,
    ]),
    s("evac", "Evacuation", sev, [
      `Phase-1 evacuation for ${pop} in red zones.`,
      `Open 22 shelters (school + community center network).`,
      `Stand up 6 boat rescue teams along Buriganga waterfront.`,
    ]),
    s("alert", "Citizen Alerts", "P0", [
      `SMS broadcast BN/EN to 1.4M handsets in impact polygons.`,
      `Push to CityCascade citizen app with live shelter map.`,
      `FM radio + community PA loop every 10 minutes.`,
    ]),
  ],
  fire: (z, pop, sev) => [
    s("route", "Emergency Routing", "P0", [
      `Cordon 300m radius around ${z}; close side-lanes to civilian traffic.`,
      `Priority corridor for 14 fire tenders + 6 ladder trucks.`,
      `Traffic signal hold on Bijoy Sarani for rapid deployment.`,
    ]),
    s("hosp", "Hospital Allocation", "P0", [
      `Burn-unit activation at Dhaka Medical + Sheikh Hasina National Burn.`,
      `Reserve 80 burn-ward beds; recall off-duty burn surgeons.`,
      `Stage 6 advanced-life-support ambulances at cordon perimeter.`,
    ]),
    s("health", "Public Health", sev, [
      `Distribute 8k N95 masks to downwind wards.`,
      `Air quality monitors deployed at 500m, 1km, 2km rings.`,
      `Smoke-inhalation screening clinics at 3 nearest schools.`,
    ]),
    s("infra", "Infrastructure", sev, [
      `Cut gas main feeding the structure; DPDC isolates feeder line.`,
      `Deploy 4 structural-integrity drones for collapse assessment.`,
      `Temporary water main boost to fire hydrants within 400m.`,
    ]),
    s("evac", "Evacuation", sev, [
      `Immediate evacuation for ${pop} within 300m cordon.`,
      `Open 4 nearest community halls as rally points.`,
      `Dispatch 20 buses for downwind precautionary evacuation.`,
    ]),
    s("alert", "Citizen Alerts", "P0", [
      `Emergency push: stay indoors, windows closed in 2km downwind.`,
      `SMS to 340k handsets with cordon map + shelter list.`,
      `Mosque PA + FM radio alerts every 15 minutes.`,
    ]),
  ],
  rain: (z, pop, sev) => [
    s("route", "Emergency Routing", sev, [
      `Preemptive closure of 9 known waterlogged underpasses.`,
      `Reroute intercity buses away from ${z} drainage basin.`,
      `Pre-stage tow trucks at 12 historically stranded intersections.`,
    ]),
    s("hosp", "Hospital Allocation", "P2", [
      `Maintain standard surge posture; expect +15% trauma intake.`,
      `Stock lightning-strike + hypothermia kits at 5 facilities.`,
      `Recall 30 on-call clinicians for peak window.`,
    ]),
    s("health", "Public Health", "P2", [
      `Pre-position 20k ORS + tarps for displaced residents.`,
      `Vector control sweep post-rainfall in ${z}.`,
      `Advisory: boil drinking water in low-lying areas for 48h.`,
    ]),
    s("infra", "Infrastructure", sev, [
      `Open all stormwater gates; pump station 5 to 100% capacity.`,
      `Crew dispatch to 18 storm-drain hotspots pre-identified.`,
      `Tree-fall response teams pre-staged near Dhanmondi parks.`,
    ]),
    s("evac", "Evacuation", "P2", [
      `Stand-by evacuation for ${pop} in chronic waterlog zones.`,
      `Open 10 shelters as precaution; shuttle buses available.`,
      `Coordinate with Army for low-bed transports on 4 routes.`,
    ]),
    s("alert", "Citizen Alerts", "P1", [
      `Push 800k citizens with live drainage-capacity heatmap.`,
      `FM + TV ticker: avoid travel in next 4 hours.`,
      `School closure advisory for affected thanas.`,
    ]),
  ],
  earthquake: (z, pop, sev) => [
    s("route", "Emergency Routing", "P0", [
      `Halt all metro + elevated expressway traffic for inspection.`,
      `Open 3 dedicated USAR (search & rescue) corridors to ${z}.`,
      `Helicopter LZ established at Army Stadium + Tejgaon airstrip.`,
    ]),
    s("hosp", "Hospital Allocation", "P0", [
      `Mass-casualty protocol at 8 tertiary hospitals.`,
      `Activate 420 trauma beds + recall surgical teams.`,
      `Mobile operating theatres deploy to ${z} triage zone.`,
    ]),
    s("health", "Public Health", "P0", [
      `Crush-syndrome protocol briefed to all first responders.`,
      `Tetanus + wound-care supplies airlifted from CMH.`,
      `Mental-health first-aid teams at all rally points.`,
    ]),
    s("infra", "Infrastructure", "P0", [
      `Immediate gas shut-off grid-wide in ${z} + 2km buffer.`,
      `Structural engineers assess 140 priority buildings within 6h.`,
      `Power restored only after feeder-line integrity confirmed.`,
    ]),
    s("evac", "Evacuation", "P0", [
      `Evacuate ${pop} from ${z} to open ground rally points.`,
      `Activate all 48 designated open-space shelters citywide.`,
      `USAR teams deployed to 22 collapse-probable structures.`,
    ]),
    s("alert", "Citizen Alerts", "P0", [
      `Cell-broadcast EAS: drop-cover-hold → evacuate to open ground.`,
      `SMS aftershock advisory every 30 min for 24h.`,
      `Radio + community PA in BN/EN continuous loop.`,
    ]),
  ],
  crash: (z, pop, sev) => [
    s("route", "Emergency Routing", sev, [
      `Full lane closure at ${z}; divert via Hatirjheel alternate.`,
      `Priority corridor for 6 ambulances + 2 heavy-rescue units.`,
      `Traffic police at 8 upstream junctions to prevent pile-up.`,
    ]),
    s("hosp", "Hospital Allocation", "P1", [
      `Trauma intake at Dhaka Medical + Square + United.`,
      `Reserve 40 trauma beds + 8 operating theatres.`,
      `Recall 12 trauma surgeons + 20 critical-care nurses.`,
    ]),
    s("health", "Public Health", "P2", [
      `Blood bank alert: request O-neg + platelet donors.`,
      `Mental-health counsellors at hospital family areas.`,
      `Fuel/chemical spill kit on standby at scene.`,
    ]),
    s("infra", "Infrastructure", "P2", [
      `Structural check on overpass if impact severity > 6.`,
      `Street lighting boosted for extended rescue window.`,
      `Drone overhead mapping for scene documentation.`,
    ]),
    s("evac", "Evacuation", "P2", [
      `Evacuate secondary-risk vehicles within 200m radius.`,
      `Shuttle bus for stranded commuters to nearest metro.`,
      `Family reunification point at nearest school.`,
    ]),
    s("alert", "Citizen Alerts", "P1", [
      `Live traffic advisory to Google + local ride-share apps.`,
      `FM + VMS boards showing detour for 60 min upstream.`,
      `SMS to kin via vehicle registry match.`,
    ]),
  ],
  dengue: (z, pop, sev) => [
    s("route", "Emergency Routing", "P2", [
      `Fogging convoy routing optimised across ${z} + 4 adjacent wards.`,
      `Rickshaw-mounted larvicide teams to inner lanes inaccessible by truck.`,
      `Priority lane for blood-bank couriers to testing centres.`,
    ]),
    s("hosp", "Hospital Allocation", sev, [
      `Dedicated dengue wards at 6 hospitals (+180 beds).`,
      `Platelet + plasma stockpile boosted 3× baseline.`,
      `NS1 + IgM rapid-test kits deployed to 40 primary clinics.`,
    ]),
    s("health", "Public Health", "P0", [
      `House-to-house larval source reduction in ${z}.`,
      `Community health workers target ${pop} with awareness kits.`,
      `School-based screening for febrile students, 5 days.`,
    ]),
    s("infra", "Infrastructure", "P2", [
      `Drain de-silting across ${z} to remove breeding sites.`,
      `Inspect 340 construction sites for stagnant water.`,
      `Waste-collection frequency doubled for 14 days.`,
    ]),
    s("evac", "Evacuation", "P2", [
      `No mass evacuation; targeted hospital transfer for severe cases.`,
      `Safe-transport protocol for pregnant + paediatric patients.`,
      `Tele-consultation rooms stood up at 12 community clinics.`,
    ]),
    s("alert", "Citizen Alerts", "P1", [
      `SMS + push: fever > 3 days → NS1 test immediately.`,
      `TV ads on mosquito source reduction, 4× daily.`,
      `Local councillor PA rounds in high-incidence lanes.`,
    ]),
  ],
  smog: (z, pop, sev) => [
    s("route", "Emergency Routing", "P1", [
      `Odd-even vehicle restriction in ${z} + CBD.`,
      `Brick-kiln trucks rerouted outside city limits for 72h.`,
      `Public transport frequency +40% to reduce private travel.`,
    ]),
    s("hosp", "Hospital Allocation", sev, [
      `Respiratory surge beds at 7 hospitals (+160 beds).`,
      `Nebuliser + oxygen concentrator stockpile doubled.`,
      `Recall pulmonology + paediatric respiratory teams.`,
    ]),
    s("health", "Public Health", "P0", [
      `Distribute 500k N95 masks prioritising ${pop} + elderly.`,
      `Outdoor school + sports suspension in ${z}.`,
      `Free pulmonary check-ups at 30 community clinics.`,
    ]),
    s("infra", "Infrastructure", sev, [
      `Halt all open-burning + construction dust in ${z}.`,
      `Water-sprinkler trucks on 40 arterial roads, 4× daily.`,
      `Green-belt irrigation boost to capture particulates.`,
    ]),
    s("evac", "Evacuation", "P2", [
      `Temporary relocation offer for 1,800 severe-COPD patients.`,
      `Air-filtered rally rooms at 12 community centres.`,
      `Inter-city shuttle support for vulnerable residents.`,
    ]),
    s("alert", "Citizen Alerts", "P0", [
      `AQI live feed push every 30 min to all citizens.`,
      `Work-from-home advisory issued to private sector.`,
      `School closure order for KG + primary grades.`,
    ]),
  ],
  outage: (z, pop, sev) => [
    s("route", "Emergency Routing", sev, [
      `Traffic police manual control at 48 signal-dark junctions.`,
      `Ambulance priority routing via non-signalled arterials.`,
      `Fuel convoy to priority substations under escort.`,
    ]),
    s("hosp", "Hospital Allocation", "P0", [
      `Activate backup generators at all 14 tertiary hospitals.`,
      `Mobile fuel tanker rotation every 4h for generators.`,
      `ICU transfer plan for 6 at-risk facilities pre-approved.`,
    ]),
    s("health", "Public Health", sev, [
      `Cold-chain vaccine transfer from 23 clinics to central store.`,
      `Dialysis patients re-scheduled to power-secure facilities.`,
      `Home-care O2 patients contacted for backup plan.`,
    ]),
    s("infra", "Infrastructure", "P0", [
      `Restore feeder lines to ${z} on priority within 90 min.`,
      `Isolate faulted substation; balance load across 4 alt feeders.`,
      `Deploy 8 mobile 500kVA gensets to critical nodes.`,
    ]),
    s("evac", "Evacuation", "P2", [
      `No mass evacuation; targeted transfer for life-support patients.`,
      `Open 12 cooling/charging stations for heat-vulnerable ${pop}.`,
      `Safe-home escort for 400 elderly living alone.`,
    ]),
    s("alert", "Citizen Alerts", "P1", [
      `SMS ETA for power restoration per feeder, updated 30 min.`,
      `Citizen app: nearest charging + water point map.`,
      `Loudspeaker rounds in apartment-heavy blocks.`,
    ]),
  ],
  waste: (z, pop, sev) => [
    s("route", "Emergency Routing", "P2", [
      `Dedicated waste-truck corridor through ${z} for 48h.`,
      `Temporary transfer station at nearest unused lot.`,
      `Night-shift pickup schedule to avoid traffic load.`,
    ]),
    s("hosp", "Hospital Allocation", "P2", [
      `Expect +20% diarrhoeal + skin-infection intake, 72h window.`,
      `Pre-position ORS + antibiotics at 18 community clinics.`,
      `Vector-control brief to hospital sanitation teams.`,
    ]),
    s("health", "Public Health", sev, [
      `House-to-house awareness on safe waste handling for ${pop}.`,
      `Chemical spray disinfection pass across affected lanes.`,
      `Free tetanus + Hep-A vaccination drive, 5 days.`,
    ]),
    s("infra", "Infrastructure", sev, [
      `Deploy 40 extra waste trucks + 6 compactors to ${z}.`,
      `Drain de-silting to prevent blockage cascading.`,
      `Temporary incinerator activation at transfer station.`,
    ]),
    s("evac", "Evacuation", "P2", [
      `No evacuation; shelter-in-place with air filtration advisory.`,
      `Relocation option for 120 respiratory-vulnerable residents.`,
      `Community centre opens as clean indoor space.`,
    ]),
    s("alert", "Citizen Alerts", "P1", [
      `SMS in BN: safe waste handling + symptoms to watch.`,
      `Councillor lane-by-lane PA rounds for 3 evenings.`,
      `Social media live tracking of cleanup crews.`,
    ]),
  ],
  water: (z, pop, sev) => [
    s("route", "Emergency Routing", sev, [
      `Water-tanker convoys to ${z}: 40 trucks / rotating 24h.`,
      `Road priority for WASA repair crews to suspected breach.`,
      `Bottled-water distribution trucks to 22 community points.`,
    ]),
    s("hosp", "Hospital Allocation", "P0", [
      `GI-illness surge beds at 9 hospitals (+140 beds).`,
      `Stockpile ORS, cholera vaccine, IV saline at 3× baseline.`,
      `Microbiology labs on 24h rotation for rapid testing.`,
    ]),
    s("health", "Public Health", "P0", [
      `Boil-water advisory for ${pop} across ${z}.`,
      `Chlorine tablet distribution: 200k units in 6h.`,
      `Door-to-door symptom screening + ORS drop.`,
    ]),
    s("infra", "Infrastructure", "P0", [
      `WASA isolates suspected main; repair + super-chlorinate.`,
      `Parallel temporary line laid from secondary treatment plant.`,
      `Test 280 downstream sampling points every 2h.`,
    ]),
    s("evac", "Evacuation", "P2", [
      `No mass evacuation; hospital transfer for severe dehydration.`,
      `Vulnerable groups (infants, pregnant) offered relocation.`,
      `Safe-water stations at 22 schools + mosques.`,
    ]),
    s("alert", "Citizen Alerts", "P0", [
      `Immediate SMS + push: do not drink tap water in ${z}.`,
      `FM + TV ticker: boil-water advisory, every 10 min.`,
      `Community PA in mosques at each prayer call.`,
    ]),
  ],
};

function s(
  id: PlanSection["id"],
  title: string,
  priority: PlanSection["priority"],
  items: string[],
): PlanSection {
  return { id, title, priority, items };
}
