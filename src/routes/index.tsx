import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { StatusBar } from "@/components/citycascade/StatusBar";
import { CommandSidebar } from "@/components/citycascade/CommandSidebar";
import { MapPanel, type SelectedZone } from "@/components/citycascade/MapPanel";
import { RiskSummary } from "@/components/citycascade/RiskSummary";
import { ZoneRiskList } from "@/components/citycascade/ZoneRiskList";
import { HospitalStatusPanel } from "@/components/citycascade/HospitalStatusPanel";
import { RoadBlockPanel } from "@/components/citycascade/RoadBlockPanel";
import { AIResponsePanel } from "@/components/citycascade/AIResponsePanel";
import { DISASTERS } from "@/components/citycascade/data";
import type { DisasterId } from "@/components/citycascade/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CityCascade AI — Disaster Operations Dashboard" },
      {
        name: "description",
        content:
          "CityCascade AI: emergency operations console for simulating urban disasters and generating AI-driven response plans for Dhaka.",
      },
    ],
  }),
  component: Dashboard,
});

type Status = "idle" | "simulating" | "active" | "error";

function Dashboard() {
  const [city, setCity] = useState("dhaka");
  const [disaster, setDisaster] = useState<DisasterId | null>(null);
  const [intensity, setIntensity] = useState(6);
  const [status, setStatus] = useState<Status>("idle");
  const [zone, setZone] = useState<SelectedZone | null>(null);
  const [brush, setBrush] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upcomingCityMessage, setUpcomingCityMessage] = useState<string | null>(null);

  const disasterObj = DISASTERS.find((d) => d.id === disaster) ?? null;

  const cascadeResult = useMemo(() => {
    if (status !== "active" || !disasterObj) return null;
    const base = zone?.population ?? 120000;
    const mult = intensity / 10;
    const diseaseHeavy = ["dengue", "water", "waste"].includes(disasterObj.id);
    return {
      affectedPopulation: Math.round(base * (0.9 + mult)),
      hospitalStrain: Math.min(99, Math.round(30 + intensity * (diseaseHeavy ? 6 : 4))),
      roadsBlocked: Math.max(1, Math.round(intensity * (["flood", "rain", "earthquake"].includes(disasterObj.id) ? 3 : 2))),
      waterContamination: Math.min(100, Math.round(intensity * (["flood", "water", "waste"] .includes(disasterObj.id) ? 10 : 5))),
      diseaseRisk: Math.min(100, Math.round(intensity * (diseaseHeavy ? 10 : 6))),
    };
  }, [status, disasterObj, zone, intensity]);


  function handleSimulate() {
    if (!disaster) {
      setError("Select a disaster first.");
      return;
    }
    setError(null);
    setStatus("simulating");
    window.setTimeout(() => setStatus("active"), 1400);
  }
  function handleReset() {
    setError(null);
    setUpcomingCityMessage(null);
    setStatus("idle");
    setDisaster(null);
    setIntensity(6);
    setZone(null);
  }
  function handleGenerate() {
    if (!disaster) {
      setError("Select a disaster first.");
      return;
    }
    setError(null);
    setStatus("simulating");
    window.setTimeout(() => setStatus("active"), 1000);
  }

  const cityLabel = city.toUpperCase();
  const dbMode = "LIVE EDGE";

  return (
    <div className="flex h-screen flex-col">
      <StatusBar city={cityLabel} status={status} dbMode={dbMode} />

      <div className="flex flex-1 gap-3 overflow-hidden p-3">
        {/* Main column */}
        <div className="flex flex-1 flex-col gap-3 min-w-0">
          <RiskSummary active={status === "active"} data={cascadeResult} />

          <div className="flex flex-1 gap-3 min-h-0">
            <div className="flex-1 min-w-0">
              <MapPanel
                disaster={disasterObj}
                intensity={intensity}
                status={status}
                selectedZoneId={zone?.id ?? null}
                onZoneSelect={(z) => setZone(z)}
                onSimulate={handleSimulate}
                brush={brush}
              />
            </div>

            {/* Inner right info column */}
            <div className="hidden xl:flex w-[300px] flex-col gap-3 overflow-y-auto scroll-cyan">
              <ZoneRiskList active={status === "active"} />
              <HospitalStatusPanel active={status === "active"} />
              <RoadBlockPanel active={status === "active"} />
            </div>
          </div>

          {error && (
            <div className="panel panel-red p-3 text-[12px] tracking-wider text-[color:var(--neon-red)]">{error}</div>
          )}

          {/* Bottom AI drawer */}
          <div className="max-h-[46vh]">
            <AIResponsePanel
              status={status}
              disaster={disasterObj}
              intensity={intensity}
              zone={zone}
              onGenerate={handleGenerate}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Right command sidebar */}
        <div className="w-[320px] shrink-0">
          <CommandSidebar
            city={city}
            onCity={setCity}
            disaster={disaster}
            onDisaster={setDisaster}
            intensity={intensity}
            onIntensity={setIntensity}
            onSimulate={handleSimulate}
            onReset={handleReset}
            status={status}
            brush={brush}
            onBrush={setBrush}
            zone={zone}
            upcomingCityMessage={upcomingCityMessage}
            onUpcomingCitySelect={(name) => setUpcomingCityMessage(`Coming soon: city map data not installed yet. (${name})`)}
          />
        </div>
      </div>

      {/* Smaller-screen fallback panels for the inner info column */}
      <div className="xl:hidden grid grid-cols-1 md:grid-cols-3 gap-3 p-3 pt-0">
        <ZoneRiskList active={status === "active"} />
        <HospitalStatusPanel active={status === "active"} />
        <RoadBlockPanel active={status === "active"} />
      </div>
    </div>
  );
}
