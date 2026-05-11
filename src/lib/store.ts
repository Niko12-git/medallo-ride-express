import { create } from "zustand";

export type Role = "cliente" | "conductor";
export type PaymentMethod = "Efectivo" | "Nequi" | "Bancolombia";
export type RideStatus = "Pendiente" | "Aceptado" | "EnCurso" | "Completado" | "Cancelado";
export type ServiceType = "Persona" | "Paquete";
export type PackageSize = "Pequeño" | "Mediano" | "Grande";

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
  serviceType?: ServiceType;
  packageSize?: PackageSize;
  packageNote?: string;
  raining?: boolean;
  longDistance?: boolean;
  rating?: number;
  comment?: string;
}

export interface DriverDocs {
  photo: boolean;
  plate: boolean;
  soat: boolean;
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
  raining: boolean;
  setRaining: (v: boolean) => void;
  currentRide: Ride | null;
  setCurrentRide: (r: Ride | null) => void;
  history: Ride[];
  pushHistory: (r: Ride) => void;
  rateRide: (id: string, rating: number, comment?: string) => void;
  pendingRating: Ride | null;
  setPendingRating: (r: Ride | null) => void;
  messages: ChatMessage[];
  sendMessage: (m: Omit<ChatMessage, "id" | "at">) => void;
  panicCount: number;
  triggerPanic: () => void;
  driverDocs: DriverDocs;
  setDriverDocs: (d: Partial<DriverDocs>) => void;
  cashedOut: number;
  cashOut: (amount: number) => void;
}

export const useApp = create<AppState>((set) => ({
  role: "cliente",
  setRole: (r) => set({ role: r }),
  online: false,
  setOnline: (v) => set({ online: v }),
  raining: false,
  setRaining: (v) => set({ raining: v }),
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
  rateRide: (id, rating, comment) =>
    set((s) => ({
      history: s.history.map((h) => (h.id === id ? { ...h, rating, comment } : h)),
    })),
  pendingRating: null,
  setPendingRating: (r) => set({ pendingRating: r }),
  messages: [],
  sendMessage: (m) =>
    set((s) => ({
      messages: [...s.messages, { ...m, id: crypto.randomUUID(), at: Date.now() }],
    })),
  panicCount: 0,
  triggerPanic: () => set((s) => ({ panicCount: s.panicCount + 1 })),
  driverDocs: { photo: false, plate: false, soat: false },
  setDriverDocs: (d) => set((s) => ({ driverDocs: { ...s.driverDocs, ...d } })),
  cashedOut: 0,
  cashOut: (amount) => set((s) => ({ cashedOut: s.cashedOut + amount })),
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
  { name: "Sabaneta Parque Principal", lat: 6.1517, lng: -75.6160, zone: "Sabaneta" },
  { name: "Bello Parque Principal", lat: 6.3373, lng: -75.5582, zone: "Bello" },
  { name: "Caldas Parque Principal", lat: 6.0911, lng: -75.6362, zone: "Caldas" },
  { name: "Barbosa Parque Principal", lat: 6.4383, lng: -75.3320, zone: "Barbosa" },
  { name: "Santa Fe de Antioquia", lat: 6.5569, lng: -75.8267, zone: "Occidente" },
];

const SURCHARGE: Record<string, number> = {
  "Las Palmas": 1.35,
  "El Poblado": 1.15,
  "Santa Elena": 1.4,
};

export const PACKAGE_MULT: Record<PackageSize, number> = {
  "Pequeño": 0.85,
  "Mediano": 1.0,
  "Grande": 1.25,
};

// Bounding box for the Medellín metropolitan area (Valle de Aburrá).
// Anything outside is considered "long distance" and gets a 1.5x surcharge.
// Anything outside the extended box is "out of coverage".
export const METRO_BOUNDS = { latMin: 6.10, latMax: 6.40, lngMin: -75.70, lngMax: -75.45 };
export const EXTENDED_BOUNDS = { latMin: 5.95, latMax: 6.55, lngMin: -75.85, lngMax: -75.30 };

const inBounds = (p: Place, b: typeof METRO_BOUNDS) =>
  p.lat >= b.latMin && p.lat <= b.latMax && p.lng >= b.lngMin && p.lng <= b.lngMax;

export const isWithinMetro = (p: Place) => inBounds(p, METRO_BOUNDS);
export const isWithinCoverage = (p: Place) => inBounds(p, EXTENDED_BOUNDS);

export const RAIN_SURCHARGE = 1.15;
export const LONG_DISTANCE_SURCHARGE = 1.5;

export interface Quote {
  distanceKm: number;
  durationMin: number;
  price: number;
  surchargeZone: string | null;
  longDistance: boolean;
  outOfCoverage: boolean;
  rainingApplied: boolean;
  surcharges: string[];
}

export function quote(
  origin: Place,
  destination: Place,
  opts?: { serviceType?: ServiceType; packageSize?: PackageSize; raining?: boolean },
): Quote {
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
  const surcharges: string[] = [];

  const mult = Math.max(SURCHARGE[origin.zone ?? ""] ?? 1, SURCHARGE[destination.zone ?? ""] ?? 1);
  if (mult > 1) price = price * mult;

  if (opts?.serviceType === "Paquete") {
    const pm = PACKAGE_MULT[opts.packageSize ?? "Mediano"] ?? 1;
    price = price * pm;
    if (pm !== 1) surcharges.push(`Paquete ${opts.packageSize}`);
  }

  const longDistance = !isWithinMetro(origin) || !isWithinMetro(destination);
  const outOfCoverage = !isWithinCoverage(origin) || !isWithinCoverage(destination);
  if (longDistance) {
    price = price * LONG_DISTANCE_SURCHARGE;
    surcharges.push("Larga distancia +50%");
  }

  const rainingApplied = !!opts?.raining;
  if (rainingApplied) {
    price = price * RAIN_SURCHARGE;
    surcharges.push("Lluvia +15%");
  }

  price = Math.round(price / 500) * 500;
  const surchargeZone =
    (SURCHARGE[origin.zone ?? ""] ?? 0) > 1
      ? origin.zone ?? null
      : (SURCHARGE[destination.zone ?? ""] ?? 0) > 1
      ? destination.zone ?? null
      : null;

  return { distanceKm, durationMin, price, surchargeZone, longDistance, outOfCoverage, rainingApplied, surcharges };
}

export const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
