import { useEffect, useRef, useState } from "react";
import type { Feature, Polygon, MultiPolygon } from "geojson";

import type { Disaster } from "./data";
import { DisasterIconMap } from "./icons";
import { DHAKA_CENTER, DHAKA_ZONES, DHAKA_ZOOM, type ZoneProps } from "./dhakaZones";
import { AlertIcon, CrosshairIcon } from "./icons";

export interface SelectedZone {
  id: string;
  name: string;
  population: number;
  baseRisk: number;
  center: [number, number];
}

interface Props {
  disaster: Disaster | null;
  intensity: number;
  status: "idle" | "simulating" | "active" | "error";
  selectedZoneId: string | null;
  onZoneSelect: (zone: SelectedZone) => void;
  onSimulate: () => void;
  brush?: boolean;
}

type ZoneFeature = Feature<Polygon | MultiPolygon, ZoneProps>;

function featureCenter(f: ZoneFeature): [number, number] {
  // Works for Polygon and MultiPolygon by flattening all outer rings.
  const rings =
    f.geometry.type === "Polygon"
      ? [f.geometry.coordinates[0]]
      : f.geometry.coordinates.map((poly) => poly[0]);
  const points = rings.flat();
  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
  return [lat, lng];
}

function severityColor(risk: number) {
  if (risk >= 75) return "#ff5568";
  if (risk >= 50) return "#ffb24a";
  return "#7cf4ff";
}

export function MapPanel({
  disaster,
  intensity,
  status,
  selectedZoneId,
  onZoneSelect,
  onSimulate,
  brush = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const pinsRef = useRef<[number, number][]>([]);
  const [pins, setPins] = useState<[number, number][]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Keep fresh copy of props for leaflet event handlers.
  const propsRef = useRef({ disaster, intensity, status, selectedZoneId, brush, onZoneSelect, onSimulate });
  useEffect(() => {
    propsRef.current = { disaster, intensity, status, selectedZoneId, brush, onZoneSelect, onSimulate };
  });

  // Initialize the Leaflet map on mount (client-only).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current || mapRef.current) return;

    let disposed = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function ensureLeaflet(): Promise<any> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.L) return w.L;
      await new Promise<void>((resolve, reject) => {
        if (document.getElementById("leaflet-cdn")) {
          const check = () => (w.L ? resolve() : setTimeout(check, 50));
          check();
          return;
        }
        const s = document.createElement("script");
        s.id = "leaflet-cdn";
        s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load Leaflet from CDN"));
        document.head.appendChild(s);
      });
      return w.L;
    }

    (async () => {
      try {
        const L = await ensureLeaflet();
        if (disposed || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: DHAKA_CENTER,
        zoom: DHAKA_ZOOM,
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: false,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: ["a", "b", "c", "d"],
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);

      const geo = L.geoJSON(DHAKA_ZONES, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style: (f: any) => {
          const feat = f as ZoneFeature;
          const p = propsRef.current;
          return styleFor(
            feat.properties,
            p.status,
            feat.properties.id === p.selectedZoneId,
            p.intensity,
          );
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEachFeature: (feature: any, layer: any) => {
          const f = feature as ZoneFeature;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const path = layer as any;

          path.on("mouseover", () => {
            path.setStyle({ weight: 2.4, fillOpacity: 0.32 });
          });
          path.on("mouseout", () => {
            const p = propsRef.current;
            path.setStyle(
              styleFor(f.properties, p.status, f.properties.id === p.selectedZoneId, p.intensity),
            );
          });
          path.on("click", () => {
            const p = propsRef.current;
            const [lat, lng] = featureCenter(f);
            p.onZoneSelect({
              id: f.properties.id,
              name: f.properties.name,
              population: f.properties.population,
              baseRisk: f.properties.baseRisk,
              center: [lat, lng],
            });
            if (p.disaster && p.status !== "simulating") p.onSimulate();
          });

          path.bindTooltip(
            `<div style="font-family:monospace;font-size:11px;letter-spacing:.1em;color:#cfeaff;">
              <div style="color:#7cf4ff;text-transform:uppercase;letter-spacing:.2em;font-weight:700;margin-bottom:2px;">${f.properties.name}</div>
              <div>POP ${(f.properties.population / 1000).toFixed(0)}k · RISK ${f.properties.baseRisk}</div>
              <div style="opacity:.7;margin-top:2px;">click to target</div>
            </div>`,
            { direction: "top", sticky: true, opacity: 0.95 },
          );
        },
      }).addTo(map);
      geoLayerRef.current = geo;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on("click", (e: any) => {
        const p = propsRef.current;
        if (!p.disaster || p.status === "simulating") return;
        const newPin: [number, number] = [e.latlng.lat, e.latlng.lng];
        const next = p.brush ? [...pinsRef.current, newPin] : [newPin];
        pinsRef.current = next;
        drawMarkers(L, map, markersRef, next, p.disaster);
        setPins(next);
        if (p.status !== "active") p.onSimulate();
      });

      setTimeout(() => map.invalidateSize(), 50);
      setMapReady(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[CityCascade] map init failed", err);
      }
    })();

    return () => {
      disposed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        geoLayerRef.current = null;
      }
    };
  }, []);

  // Restyle polygons whenever status/selected zone/intensity changes.
  useEffect(() => {
    const layer = geoLayerRef.current;
    if (!layer) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    layer.eachLayer((l: any) => {
      const feat = l.feature as ZoneFeature | undefined;
      if (!feat) return;
      const isSel = feat.properties.id === selectedZoneId;
      l.setStyle(styleFor(feat.properties, status, isSel, intensity));
    });
  }, [selectedZoneId, status, intensity]);

  // Reset pins when status goes back to idle.
  useEffect(() => {
    if (status === "idle" && pinsRef.current.length > 0) {
      pinsRef.current = [];
      setPins([]);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    }
  }, [status]);

  const showEmpty = !disaster && status === "idle";
  const showLoading = status === "simulating";
  const showError = status === "error";

  return (
    <div className="panel panel-cyan relative h-full overflow-hidden" data-testid="map-panel">
      {/* Title strip */}
      <div className="absolute inset-x-0 top-0 z-[500] flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-background/95 to-transparent pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="font-display text-[11px] tracking-[0.3em] neon-text-cyan">Tactical Map</span>
          <span className="text-[10px] text-muted-foreground tracking-widest font-mono">
            DHAKA · 23.8103°N 90.4125°E · LEAFLET · {DHAKA_ZONES.features.length} ZONES
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
          <Legend dot="#7cf4ff" label="STABLE" />
          <Legend dot="#ffb24a" label="ELEVATED" />
          <Legend dot="#ff5568" label="CRITICAL" />
        </div>
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        className="citycascade-map absolute inset-0"
        style={{ background: "#0e1524" }}
      />

      {!mapReady && (
        <div className="pointer-events-none absolute inset-0 z-[440] grid place-items-center">
          <span className="font-display text-[11px] tracking-[0.3em] text-muted-foreground">
            INITIALISING TACTICAL MAP...
          </span>
        </div>
      )}

      {/* Sweep line overlay while simulating */}
      {showLoading && (
        <div className="pointer-events-none absolute inset-0 z-[450] overflow-hidden">
          <div
            className="scan-line absolute inset-x-0 h-24"
            style={{
              background: "linear-gradient(180deg, transparent, oklch(0.85 0.18 200 / 0.22), transparent)",
            }}
          />
        </div>
      )}

      {/* Empty state */}
      {showEmpty && mapReady && (
        <div className="pointer-events-none absolute inset-0 z-[450] grid place-items-center">
          <div className="panel panel-cyan text-center max-w-sm px-6 py-5 pointer-events-auto">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-[color:var(--neon-cyan)]/60">
              <CrosshairIcon className="h-5 w-5 neon-text-cyan" />
            </div>
            <div className="font-display text-sm tracking-[0.25em] neon-text-cyan">AWAITING INPUT</div>
            <p className="mt-2 text-xs text-muted-foreground tracking-widest">
              Select a disaster, then click a Dhaka zone or anywhere on the map.
            </p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {showLoading && (
        <div className="pointer-events-none absolute inset-0 z-[460] grid place-items-center bg-background/35 backdrop-blur-[2px]">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-[color:var(--neon-cyan)] border-t-transparent animate-spin" />
            <div className="font-display text-sm tracking-[0.3em] neon-text-cyan">SIMULATING CASCADE...</div>
            <p className="mt-1 text-[10px] text-muted-foreground tracking-widest">
              MODELING ZONE PROPAGATION · INTENSITY {intensity}
            </p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {showError && (
        <div className="absolute inset-0 z-[470] grid place-items-center bg-background/50 backdrop-blur-sm">
          <div className="panel panel-red max-w-sm p-5 text-center">
            <AlertIcon className="mx-auto h-8 w-8 neon-text-red" />
            <div className="mt-2 font-display text-sm tracking-[0.25em] neon-text-red">
              MAP / TELEMETRY FAULT
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground tracking-widest">
              Tile stream lost. Reset the field or retry the cascade.
            </p>
          </div>
        </div>
      )}

      {/* Disaster + epicenter chip */}
      <div className="absolute bottom-3 left-3 z-[500] panel px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground tracking-widest flex items-center gap-2">
        {disaster && (() => {
          const Icon = DisasterIconMap[disaster.id];
          return <Icon className="h-3.5 w-3.5 neon-text-red" />;
        })()}
        <span>
          {pins.length > 0
            ? `EPICENTER · ${pins[pins.length - 1][0].toFixed(4)}, ${pins[pins.length - 1][1].toFixed(4)}`
            : "EPICENTER · NULL"}
        </span>
        {brush && <span className="ml-2 neon-text-cyan">BRUSH</span>}
      </div>
    </div>
  );
}

function styleFor(
  props: ZoneProps,
  st: Props["status"],
  selected: boolean,
  intensity: number,
) {
  const risk = props.baseRisk;
  const bump = st === "active" ? Math.min(30, intensity * 2) : 0;
  const colour = severityColor(risk + bump);
  return {
    color: colour,
    weight: selected ? 2.5 : 1.1,
    opacity: selected ? 1 : 0.75,
    fillColor: colour,
    fillOpacity: st === "active" ? (selected ? 0.38 : 0.22) : selected ? 0.25 : 0.08,
    dashArray: selected ? undefined : "4 3",
  };
}

function drawMarkers(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  L: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markersRef: React.MutableRefObject<any[]>,
  pins: [number, number][],
  disaster: Disaster | null,
) {
  markersRef.current.forEach((m) => m.remove());
  markersRef.current = [];
  const c = disaster ? "#ff4b5c" : "#7cf4ff";
  pins.forEach((p) => {
    const icon = L.divIcon({
      className: "citycascade-pin",
      html: `<div style="width:18px;height:18px;border-radius:999px;background:${c};box-shadow:0 0 0 3px rgba(0,0,0,.6),0 0 18px ${c};border:2px solid #0b0f1d;"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    const mk = L.marker(p, { icon }).addTo(map);
    mk.bindPopup(
      `<div style="font-family:monospace;font-size:11px;">
        <div style="color:#7cf4ff;letter-spacing:0.2em;">EPICENTER</div>
        <div>LAT ${p[0].toFixed(4)} · LNG ${p[1].toFixed(4)}</div>
        ${disaster ? `<div style="margin-top:4px;color:#ff6b7a;">${disaster.name.toUpperCase()}</div>` : ""}
      </div>`,
    );
    markersRef.current.push(mk);
  });
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: dot, boxShadow: `0 0 6px ${dot}` }}
      />
      {label}
    </span>
  );
}
