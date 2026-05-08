import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { MEDELLIN_CENTER, type Place } from "@/lib/store";

// Fix leaflet default icon paths in bundlers
const neonIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:oklch(0.88 0.24 145);box-shadow:0 0 16px oklch(0.88 0.24 145 / .9), 0 0 4px #000;border:2px solid #0a0a0a"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
const dotIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:white;border:3px solid oklch(0.88 0.24 145);box-shadow:0 0 8px oklch(0.88 0.24 145 / .8)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(points, { padding: [60, 60], maxZoom: 14 });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    }
  }, [points, map]);
  return null;
}

export interface RideMapProps {
  origin?: Place | null;
  destination?: Place | null;
  className?: string;
}

export function RideMap({ origin, destination, className }: RideMapProps) {
  const points = useMemo(() => {
    const p: [number, number][] = [];
    if (origin) p.push([origin.lat, origin.lng]);
    if (destination) p.push([destination.lat, destination.lng]);
    return p;
  }, [origin, destination]);

  const ref = useRef<L.Map>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={(className ?? "h-full w-full") + " animate-pulse bg-secondary"} />;
  }

  return (
    <MapContainer
      center={MEDELLIN_CENTER}
      zoom={12}
      zoomControl={false}
      className={className ?? "h-full w-full"}
      ref={ref}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {origin && <Marker position={[origin.lat, origin.lng]} icon={dotIcon} />}
      {destination && <Marker position={[destination.lat, destination.lng]} icon={neonIcon} />}
      {points.length === 2 && (
        <Polyline
          positions={points}
          pathOptions={{ color: "#39ff14", weight: 4, opacity: 0.85, dashArray: "6 8" }}
        />
      )}
      <FitBounds points={points} />
    </MapContainer>
  );
}
