import { create } from "zustand";

export type Role = "cliente" | "conductor";
export type PaymentMethod = "Efectivo" | "Nequi" | "Bancolombia";
export type RideStatus = "Pendiente" | "Aceptado" | "EnCurso" | "Completado" | "Cancelado";

export interface Place {
  name: string;
  lat: number;
  lng: number;
  zone?: string;
}

export interface Ride {
  id: string;
  origin: Place;
  destination: Place;
  distanceKm: number;
  durationMin: number;
  price: number;
  payment: PaymentMethod;
  status: RideStatus;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  from: Role;
  text: string;
  at: number;
}

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  online: boolean;
  setOnline: (v: boolean) => void;
  currentRide: Ride | null;
  setCurrentRide: (r: Ride | null) => void;
  history: Ride[];
  pushHistory: (r: Ride) => void;
  messages: ChatMessage[];
  sendMessage: (m: Omit<ChatMessage, "id" | "at">) => void;
  panicCount: number;
  triggerPanic: () => void;
}

export const useApp = create<AppState>((set) => ({
  role: "cliente",
  setRole: (r) => set({ role: r }),
  online: false,
  setOnline: (v) => set({ online: v }),
  currentRide: null,
  setCurrentRide: (r) => set({ currentRide: r }),
  history: [
    {
      id: "h1",
      origin: { name: "Parque Lleras, El Poblado", lat: 6.2087, lng: -75.5678 },
      destination: { name: "Aeropuerto Olaya Herrera", lat: 6.2206, lng: -75.5906 },
      distanceKm: 4.2,
      durationMin: 14,
      price: 12500,
      payment: "Nequi",
      status: "Completado",
      createdAt: Date.now() - 86400000,
    },
    {
      id: "h2",
      origin: { name: "Estación Poblado", lat: 6.2120, lng: -75.5740 },
      destination: { name: "Las Palmas Mirador", lat: 6.2050, lng: -75.5300 },
      distanceKm: 8.1,
      durationMin: 22,
      price: 22000,
      payment: "Efectivo",
      status: "Cancelado",
      createdAt: Date.now() - 172800000,
    },
  ],
  pushHistory: (r) => set((s) => ({ history: [r, ...s.history] })),
  messages: [],
  sendMessage: (m) =>
    set((s) => ({
      messages: [...s.messages, { ...m, id: crypto.randomUUID(), at: Date.now() }],
    })),
  panicCount: 0,
  triggerPanic: () => set((s) => ({ panicCount: s.panicCount + 1 })),
}));

// --- Medellín data ---
export const MEDELLIN_CENTER: [number, number] = [6.2476, -75.5658];

export const PLACES: Place[] = [
  { name: "Parque Lleras, El Poblado", lat: 6.2087, lng: -75.5678, zone: "El Poblado" },
  { name: "Centro Comercial Santafé", lat: 6.1969, lng: -75.5644, zone: "El Poblado" },
  { name: "Estación Poblado (Metro)", lat: 6.2120, lng: -75.5740, zone: "El Poblado" },
  { name: "Las Palmas Mirador", lat: 6.2050, lng: -75.5300, zone: "Las Palmas" },
  { name: "Aeropuerto JMC, Rionegro", lat: 6.1645, lng: -75.4231, zone: "Las Palmas" },
  { name: "Aeropuerto Olaya Herrera", lat: 6.2206, lng: -75.5906, zone: "Belén" },
  { name: "Plaza Botero, Centro", lat: 6.2518, lng: -75.5687, zone: "Centro" },
  { name: "Estadio Atanasio Girardot", lat: 6.2566, lng: -75.5897, zone: "Laureles" },
  { name: "Parque de los Pies Descalzos", lat: 6.2452, lng: -75.5743, zone: "Centro" },
  { name: "Universidad de Antioquia", lat: 6.2675, lng: -75.5687, zone: "Centro" },
  { name: "Parque Arví", lat: 6.2783, lng: -75.5022, zone: "Santa Elena" },
  { name: "Pueblito Paisa", lat: 6.2386, lng: -75.5783, zone: "Belén" },
  { name: "Centro Comercial El Tesoro", lat: 6.1972, lng: -75.5547, zone: "El Poblado" },
  { name: "Laureles, Primer Parque", lat: 6.2447, lng: -75.5915, zone: "Laureles" },
  { name: "Envigado Parque Principal", lat: 6.1697, lng: -75.5836, zone: "Envigado" },
];

const SURCHARGE: Record<string, number> = {
  "Las Palmas": 1.35,
  "El Poblado": 1.15,
  "Santa Elena": 1.4,
};

export function quote(origin: Place, destination: Place) {
  // Haversine
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) * Math.cos(toRad(destination.lat)) * Math.sin(dLng / 2) ** 2;
  const distanceKm = +(2 * R * Math.asin(Math.sqrt(a))).toFixed(2);
  const durationMin = Math.max(5, Math.round(distanceKm * 3.2));
  const base = 4500;
  const perKm = 1800;
  let price = base + perKm * distanceKm;
  const mult = Math.max(SURCHARGE[origin.zone ?? ""] ?? 1, SURCHARGE[destination.zone ?? ""] ?? 1);
  price = Math.round((price * mult) / 500) * 500;
  const surchargeZone =
    (SURCHARGE[origin.zone ?? ""] ?? 0) > 1
      ? origin.zone
      : (SURCHARGE[destination.zone ?? ""] ?? 0) > 1
      ? destination.zone
      : null;
  return { distanceKm, durationMin, price, surchargeZone };
}

export const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
