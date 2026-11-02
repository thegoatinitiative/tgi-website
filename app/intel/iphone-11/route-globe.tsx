"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Kind = "solid" | "ticket" | "tz" | "walk" | "found" | "anticipated";

type Stop = {
  id: string;
  name: string;
  lon: number;
  lat: number;
  when: string;
  kind: Kind;
  kindLabel: string;
  text: string;
};

type Segment = { from: string; to: string; kind: Kind };

const STOPS: Stop[] = [
  { id: "guangzhou", name: "Guangzhou", lon: 113.3, lat: 23.29, when: "4–5 December 2023", kind: "solid", kindLabel: "Photographed, or the phone joined Wi-Fi", text: "Meituan check-in in Li Guangsong’s name, and bank texts the same days. Placed on the city. The phone saved no GPS." },
  { id: "bangkok", name: "Bangkok", lon: 100.75, lat: 13.69, when: "6–7 December 2023", kind: "solid", kindLabel: "Photographed, or the phone joined Wi-Fi", text: "Amaranth Suvarnabhumi Hotel Wi-Fi, plus songthaew and street photos." },
  { id: "auh", name: "Abu Dhabi airport", lon: 54.65, lat: 24.43, when: "8 December 2023", kind: "solid", kindLabel: "Photographed, or the phone joined Wi-Fi", text: "Abu Dhabi Airport Wi-Fi and an Etihad onboard text." },
  { id: "casa", name: "Casablanca", lon: -7.59, lat: 33.57, when: "9–14 December 2023", kind: "solid", kindLabel: "Photographed, or the phone joined Wi-Fi", text: "Street photos, Hay Hassani, and the HELLOGUEST and Jiang networks. A 16:57 frame on 14 December conflicts with the morning Air France departure." },
  { id: "cdg", name: "Paris CDG", lon: 2.55, lat: 49.01, when: "14 December 2023, ticket only", kind: "ticket", kindLabel: "On a ticket. Boarding is not confirmed.", text: "Air France connection on the ticket. No Paris photograph. The morning Casablanca departure conflicts with a Hay Hassani frame at 16:57." },
  { id: "pty", name: "Tocumen", lon: -79.38, lat: 9.07, when: "15 December 2023, 00:43 UTC", kind: "solid", kindLabel: "Photographed, or the phone joined Wi-Fi", text: "The phone joined Airport_Tocumen Wi-Fi." },
  { id: "quito", name: "Quito", lon: -78.47, lat: -0.18, when: "15 December 2023", kind: "solid", kindLabel: "Photographed, or the phone joined Wi-Fi", text: "Uber place cache set to Quito, and Ecuador Wi-Fi the same day. Not a street address." },
  { id: "gye", name: "Guayaquil", lon: -79.88, lat: -2.16, when: "15–16 December 2023", kind: "tz", kindLabel: "Time zone only. Not a street.", text: "The clock was on America/Guayaquil. This dot is the city the time zone is named for." },
  { id: "pasto", name: "Pasto", lon: -77.28, lat: 1.4, when: "18 December 2023, ticket", kind: "ticket", kindLabel: "On a ticket", text: "Avianca, Pasto to Bogotá. The Colombian entry date on the QR is 17 December." },
  { id: "bog", name: "Bogotá", lon: -74.15, lat: 4.7, when: "18 December 2023, ticket", kind: "ticket", kindLabel: "On a ticket", text: "Avianca connection, Bogotá to Montería. No street photograph." },
  { id: "mtr", name: "Montería", lon: -75.83, lat: 8.82, when: "18 December 2023, ticket", kind: "ticket", kindLabel: "On a ticket", text: "Avianca arrival. Li Guangsong, Guo Shaoshen, and Sun Lanqin are on these tickets." },
  { id: "cap", name: "Capurganá", lon: -77.35, lat: 8.63, when: "19 December 2023", kind: "solid", kindLabel: "Photographed", text: "A note says leave the boat at Capurganá, not Acandí. The boat photographs are 13:22. This is the landing the note names, not a GPS fix." },
  { id: "darien", name: "Darién walk", lon: -77.525, lat: 8.39, when: "20 December 2023", kind: "walk", kindLabel: "Jungle photographs. No GPS.", text: "Wet canopy, packs, and people ahead, from about 05:10 to 08:13. The red band is a corridor from the Capurganá landing toward Panama. It is not a surveyed trail, and it is not a camp." },
  { id: "panama", name: "Panama, place unnamed", lon: -77.7, lat: 8.15, when: "23 December 2023", kind: "tz", kindLabel: "Time zone only. Place unnamed.", text: "The phone was on Panama time and a local Tigo top-up. One frame is a fenced compound. This dot is only the drawn end of the walk corridor." },
  { id: "cr", name: "Costa Rica", lon: -84.09, lat: 9.93, when: "24 December 2023", kind: "tz", kindLabel: "Time zone only. Not a street.", text: "The clock moved to Costa Rica. No town is named." },
  { id: "ni", name: "Nicaragua", lon: -86.25, lat: 12.13, when: "26 December 2023", kind: "tz", kindLabel: "Time zone only. Not a street.", text: "The clock moved to Nicaragua. No town is named." },
  { id: "gt", name: "Guatemala", lon: -90.51, lat: 14.63, when: "27 December 2023", kind: "tz", kindLabel: "Time zone only. Not a street.", text: "The clock moved to Guatemala. A passport photo falls on this day. No town is named." },
  { id: "mx", name: "Mexico City time", lon: -99.13, lat: 19.43, when: "29 December 2023 – 3 January 2024", kind: "tz", kindLabel: "Time zone only. Not a street.", text: "The clock was on America/Mexico_City. The card, the Alipay payment, and the cabin selfie fall in this window. The white line runs from here to Jewel Valley Road. It is not a GPS track." },
  { id: "found", name: "Jewel Valley Road", lon: -116.261675, lat: 32.606133, when: "Recovery. Not a device timestamp.", kind: "found", kindLabel: "Where the phone was found", text: "Off Jewel Valley Road in Boulevard, California, feet from the border wall. The phone saved no GPS. This dot is the mapped border fence nearest the south end of that road." },
  { id: "sg", name: "San Gabriel, anticipated", lon: -118.092805, lat: 34.073475, when: "Card 2 January. The phone did not go here.", kind: "anticipated", kindLabel: "Anticipated route. The phone was not found here.", text: "1960 South California Street, the address written on the card in Mexico. Records indicate the parcel is owned by Yellow Tiger Inc. The handset never went there." },
];

const SEGMENTS: Segment[] = [
  { from: "guangzhou", to: "bangkok", kind: "solid" },
  { from: "bangkok", to: "auh", kind: "solid" },
  { from: "auh", to: "casa", kind: "solid" },
  { from: "casa", to: "cdg", kind: "ticket" },
  { from: "cdg", to: "pty", kind: "ticket" },
  { from: "pty", to: "quito", kind: "solid" },
  { from: "quito", to: "gye", kind: "tz" },
  { from: "gye", to: "pasto", kind: "ticket" },
  { from: "pasto", to: "bog", kind: "ticket" },
  { from: "bog", to: "mtr", kind: "ticket" },
  { from: "mtr", to: "cap", kind: "ticket" },
  { from: "cap", to: "panama", kind: "walk" },
  { from: "panama", to: "cr", kind: "tz" },
  { from: "cr", to: "ni", kind: "tz" },
  { from: "ni", to: "gt", kind: "tz" },
  { from: "gt", to: "mx", kind: "tz" },
  { from: "mx", to: "found", kind: "found" },
  { from: "mx", to: "sg", kind: "anticipated" },
];

const AMERICAS_FROM = SEGMENTS.findIndex((segment) => segment.from === "pty");

const DETAIL = [
  { name: "1960 South California Street", lon: -118.092805, lat: 34.073475, color: "#C4A35A", text: "Mapped address point. Records indicate Yellow Tiger Inc. owns the parcel." },
  { name: "Photo GPS, 12:34", lon: -118.09211, lat: 34.07371, color: "#e74c3c", text: "Where the 21 January photographs were taken, about 70 meters northeast, beside Saint Anthony’s." },
  { name: "OnX pin", lon: -118.09252, lat: 34.07378, color: "#5dade2", text: "OnX pin the same day, between the house point and the camera. Tax mail goes to Montclair." },
];

const VIEWS = {
  world: {
    center: [-55, 14] as [number, number],
    zoom: 1.15,
    title: "Full route",
    note: "Drag the satellite to turn the globe. Scroll the page as usual. Hold the Command key and scroll to zoom. The white line runs from Mexico City to Jewel Valley Road, where the phone was found. The gold dashes run to the card address in San Gabriel. The phone did not go there.",
  },
  americas: {
    center: [-97, 16] as [number, number],
    zoom: 2.25,
    title: "Americas",
    note: "Drag the satellite to turn the globe. This face is Colombia through the Darién, then Central America and Mexico. The thick red segment is the jungle walk. It is a corridor, not a surveyed trail.",
  },
};

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

function arc(from: Stop, to: Stop): [number, number][] {
  const φ1 = toRad(from.lat);
  const λ1 = toRad(from.lon);
  const φ2 = toRad(to.lat);
  const λ2 = toRad(to.lon);
  const x1 = Math.cos(φ1) * Math.cos(λ1);
  const y1 = Math.cos(φ1) * Math.sin(λ1);
  const z1 = Math.sin(φ1);
  const x2 = Math.cos(φ2) * Math.cos(λ2);
  const y2 = Math.cos(φ2) * Math.sin(λ2);
  const z2 = Math.sin(φ2);
  const omega = Math.acos(Math.min(1, Math.max(-1, x1 * x2 + y1 * y2 + z1 * z2)));
  if (omega < 1e-6) return [[from.lon, from.lat], [to.lon, to.lat]];
  const steps = 72;
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const a = Math.sin((1 - t) * omega) / Math.sin(omega);
    const b = Math.sin(t * omega) / Math.sin(omega);
    const x = a * x1 + b * x2;
    const y = a * y1 + b * y2;
    const z = a * z1 + b * z2;
    points.push([toDeg(Math.atan2(y, x)), toDeg(Math.atan2(z, Math.hypot(x, y)))]);
  }
  return points;
}

function dotStyle(kind: Kind): string {
  if (kind === "ticket") return "display:block;width:11px;height:11px;background:#e6a817;border:2px solid #fff;box-shadow:0 0 0 1px #111";
  if (kind === "tz") return "display:block;width:12px;height:12px;border-radius:50%;border:3px solid #7ec8f0;background:rgba(8,16,28,.45);box-shadow:0 0 0 1px #fff";
  if (kind === "anticipated") return "display:block;width:12px;height:12px;background:transparent;transform:rotate(45deg);border:3px solid #E8C36A;box-shadow:0 0 0 1px #111";
  if (kind === "found") return "display:block;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #0B1F3A;box-shadow:0 0 0 2px #fff";
  if (kind === "walk") return "display:block;width:12px;height:12px;border-radius:50%;background:#ff4d4d;border:2px solid #fff;box-shadow:0 0 0 1px #111";
  return "display:block;width:12px;height:12px;border-radius:50%;background:#ff5a4a;border:2px solid #fff;box-shadow:0 0 0 1px #111";
}

function popupNode(kindLabel: string, name: string, when: string, text: string): HTMLDivElement {
  const root = document.createElement("div");
  root.style.cssText = "font:15px/1.4 Georgia,serif;color:#1a1a1a;max-width:280px";
  const kind = document.createElement("div");
  kind.textContent = kindLabel;
  kind.style.cssText = "font:11px/1.3 ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;color:#8a6a22;margin-bottom:4px";
  const title = document.createElement("strong");
  title.textContent = name;
  title.style.cssText = "display:block;font-size:16px";
  const date = document.createElement("div");
  date.textContent = when;
  date.style.margin = "2px 0 6px";
  const body = document.createElement("div");
  body.textContent = text;
  root.append(kind, title, date, body);
  return root;
}

function markerButton(stop: Stop): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", stop.name);
  button.style.cssText = "width:22px;height:22px;padding:0;border:0;background:transparent;cursor:pointer;display:grid;place-items:center";
  const dot = document.createElement("span");
  dot.style.cssText = dotStyle(stop.kind);
  button.appendChild(dot);
  return button;
}

export function RouteGlobe({ view, onFail }: { view: "world" | "americas"; onFail?: () => void }) {
  const frame = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const camera = VIEWS[view];

  useEffect(() => {
    const container = frame.current;
    if (!container) return;

    const byId = Object.fromEntries(STOPS.map((stop) => [stop.id, stop]));
    const segments = view === "world" ? SEGMENTS : SEGMENTS.slice(AMERICAS_FROM);
    const stops = view === "world" ? STOPS : STOPS.filter((stop) => segments.some((segment) => segment.from === stop.id || segment.to === stop.id) || stop.id === "darien");

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
      container,
      center: camera.center,
      zoom: camera.zoom,
      bearing: 0,
      pitch: 0,
      minZoom: 0.55,
      maxZoom: 16,
      maxPitch: 0,
      attributionControl: { compact: false },
      cooperativeGestures: true,
      dragRotate: true,
      dragPan: true,
      pitchWithRotate: false,
      aroundCenter: true,
      renderWorldCopies: false,
      canvasContextAttributes: { antialias: true },
      style: {
        version: 8,
        projection: { type: "globe" },
        sky: {
          "sky-color": "#07111f",
          "horizon-color": "#8eb4d4",
          "fog-color": "#07111f",
          "sky-horizon-blend": 0.65,
          "atmosphere-blend": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 1,
            5, 0.85,
            8, 0.15,
          ],
        },
        sources: {
          satellite: {
            type: "raster",
            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
            tileSize: 256,
            maxzoom: 18,
            attribution: "Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community",
          },
          places: {
            type: "raster",
            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"],
            tileSize: 256,
            maxzoom: 18,
          },
        },
        layers: [
          { id: "satellite", type: "raster", source: "satellite" },
          { id: "places", type: "raster", source: "places", paint: { "raster-opacity": 0.92 } },
        ],
      },
    });
    } catch {
      onFail?.();
      return;
    }
    mapRef.current = map;
    let gone = false;
    requestAnimationFrame(() => {
      if (!gone) map.resize();
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: false }), "top-right");
    map.on("error", (event) => {
      const message = String(event.error?.message || event.error || "");
      if (/webgl|gl_renderer|failed to initialize/i.test(message)) onFail?.();
    });
    const markers: maplibregl.Marker[] = [];
    const detailMarkers: maplibregl.Marker[] = [];
    const popup = new maplibregl.Popup({ offset: 16, closeButton: false, maxWidth: "300px", locationOccludedOpacity: 0 });

    const showPopup = (lngLat: [number, number], node: HTMLElement) => {
      popup.setLngLat(lngLat).setDOMContent(node).addTo(map);
    };

    map.on("load", () => {
      if (gone) return;
      const features = segments.map((segment) => ({
        type: "Feature" as const,
        properties: { kind: segment.kind },
        geometry: { type: "LineString" as const, coordinates: arc(byId[segment.from], byId[segment.to]) },
      }));
      map.addSource("route", { type: "geojson", data: { type: "FeatureCollection", features } });

      const paintFor = (kind: Kind, width: number, color: string, dash?: number[]) => {
        map.addLayer({
          id: `route-${kind}${dash ? "-line" : ""}`,
          type: "line",
          source: "route",
          filter: ["==", ["get", "kind"], kind],
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": color,
            "line-width": width,
            "line-opacity": 0.95,
            ...(dash ? { "line-dasharray": dash } : {}),
          },
        });
      };

      map.addLayer({
        id: "route-casing",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#07111f", "line-width": 8, "line-opacity": 0.8 },
      });
      paintFor("found", 8, "#0B1F3A");
      map.addLayer({
        id: "route-found-core",
        type: "line",
        source: "route",
        filter: ["==", ["get", "kind"], "found"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#ffffff", "line-width": 3.5 },
      });
      paintFor("anticipated", 6, "#5c4312", [1.4, 1.1]);
      map.addLayer({
        id: "route-anticipated-core",
        type: "line",
        source: "route",
        filter: ["==", ["get", "kind"], "anticipated"],
        layout: { "line-cap": "butt", "line-join": "round" },
        paint: { "line-color": "#E8C36A", "line-width": 3, "line-dasharray": [1.6, 1.2] },
      });
      paintFor("solid", 4, "#ff5a4a");
      paintFor("ticket", 3.5, "#e6a817", [1.6, 1.2]);
      paintFor("tz", 3, "#7ec8f0", [1.2, 1.3]);
      paintFor("walk", 9, "#ff4d4d");

      stops.forEach((stop) => {
        const button = markerButton(stop);
        const marker = new maplibregl.Marker({ element: button, anchor: "center", opacityWhenCovered: "0" })
          .setLngLat([stop.lon, stop.lat])
          .addTo(map);
        markers.push(marker);
        const open = () => showPopup([stop.lon, stop.lat], popupNode(stop.kindLabel, stop.name, stop.when, stop.text));
        button.addEventListener("mouseenter", open);
        button.addEventListener("focus", open);
        button.addEventListener("click", () => {
          const zoom = stop.id === "found" ? 11 : stop.id === "sg" ? 13 : Math.max(map.getZoom(), view === "world" ? 3.2 : 4);
          map.flyTo({ center: [stop.lon, stop.lat], zoom, duration: 1400 });
          open();
        });
      });

      DETAIL.forEach((place) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", place.name);
        button.style.cssText = "width:16px;height:16px;padding:0;border:0;background:transparent;cursor:pointer;display:none";
        const dot = document.createElement("span");
        dot.style.cssText = `display:block;width:10px;height:10px;border-radius:50%;background:${place.color};border:2px solid #fff;box-shadow:0 0 0 1px #111`;
        button.appendChild(dot);
        const marker = new maplibregl.Marker({ element: button, anchor: "center", opacityWhenCovered: "0" }).setLngLat([place.lon, place.lat]);
        button.addEventListener("mouseenter", () => {
          showPopup([place.lon, place.lat], popupNode("San Gabriel block", place.name, "21 January 2024", place.text));
        });
        detailMarkers.push(marker);
      });

      const syncDetail = () => {
        const show = map.getZoom() >= 9;
        detailMarkers.forEach((marker) => {
          const element = marker.getElement();
          if (show) {
            if (!marker.getElement().isConnected || !map.getContainer().contains(element)) marker.addTo(map);
            element.style.display = "grid";
          } else if (element.style.display !== "none") {
            element.style.display = "none";
          }
        });
      };
      map.on("zoom", syncDetail);
      map.getCanvas().style.cursor = "grab";
      map.on("dragstart", () => {
        map.getCanvas().style.cursor = "grabbing";
      });
      map.on("dragend", () => {
        map.getCanvas().style.cursor = "grab";
      });
      map.resize();
      if (!gone) setReady(true);
    });

    const onResize = () => map.resize();
    window.addEventListener("resize", onResize);

    return () => {
      gone = true;
      window.removeEventListener("resize", onResize);
      markers.splice(0).forEach((marker) => marker.remove());
      detailMarkers.splice(0).forEach((marker) => marker.remove());
      popup.remove();
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [view, camera.center, camera.zoom]);

  const recenter = () => {
    mapRef.current?.flyTo({
      center: camera.center,
      zoom: camera.zoom,
      bearing: 0,
      pitch: 0,
      duration: 900,
    });
  };

  return (
    <div className="route-globe flex w-full flex-col items-center">
      <style>{`
        .route-globe .maplibregl-marker-covered { pointer-events: none; }
        .route-globe .maplibregl-ctrl-attrib {
          background: rgba(7, 17, 31, 0.82);
          color: #cbd5e1;
          font-size: 12px;
        }
        .route-globe .maplibregl-ctrl-attrib a { color: #7dd3fc; }
        .route-globe .maplibregl-ctrl-group {
          background: rgba(7, 17, 31, 0.88);
          border: 1px solid rgba(148, 163, 184, 0.35);
        }
        .route-globe .maplibregl-ctrl-group button { filter: invert(1); }
      `}</style>
      <div
        className="relative mx-auto"
        style={{ width: "min(92vw, 62vh, 920px)", height: "min(92vw, 62vh, 920px)", boxShadow: "0 0 0 1px rgba(148,163,184,0.35)" }}
      >
        <div ref={frame} style={{ position: "absolute", inset: 0 }} />
        {ready ? null : (
          <p className="pointer-events-none absolute inset-0 z-10 grid place-items-center font-mono text-sm tracking-widest text-gray-300">
            LOADING SATELLITE
          </p>
        )}
      </div>
      <div className="mt-4 flex max-w-4xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 text-sm leading-snug text-gray-200">
        <p><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[#ff5a4a]" />Photographed or Wi-Fi</p>
        <p><span className="mr-2 inline-block h-2.5 w-2.5 bg-[#e6a817]" />Ticket. Paris boarding is not confirmed.</p>
        <p><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full border-2 border-[#7ec8f0]" />Time zone only</p>
        <p><span className="mr-2 inline-block h-2.5 w-5 bg-white" />Jewel Valley. Not a GPS track.</p>
        <p><span className="mr-2 inline-block h-2.5 w-5 bg-[#E8C36A]" />San Gabriel. The phone did not go there.</p>
      </div>
      <button
        type="button"
        onClick={recenter}
        className="mt-4 rounded-sm border border-slate-600 bg-[#07111f] px-4 py-2 font-mono text-xs tracking-widest text-gray-100 hover:border-primary hover:text-white"
      >
        CENTER GLOBE
      </button>
    </div>
  );
}

export function globeCopy(view: "world" | "americas"): { title: string; note: string } {
  return { title: VIEWS[view].title, note: VIEWS[view].note };
}
