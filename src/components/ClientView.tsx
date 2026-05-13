import { useEffect, useState } from "react";
import { useApp, quote, formatCOP, type PaymentMethod, type Place, type ServiceType, type PackageSize } from "@/lib/store";
import { PlaceAutocomplete } from "./PlaceAutocomplete";
import { RideMap } from "./RideMap";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Banknote, Smartphone, Building2, Clock, Route, Sparkles, CheckCircle2,
  UserRound, Package, CloudRain, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { notify } from "@/lib/notifications";
import { AnimatePresence, motion } from "framer-motion";

const PAY_OPTIONS: { id: PaymentMethod; icon: any; hint: string }[] = [
  { id: "Efectivo", icon: Banknote, hint: "Paga al llegar" },
  { id: "Nequi", icon: Smartphone, hint: "Transferencia" },
  { id: "Bancolombia", icon: Building2, hint: "QR o transferencia" },
];

const SIZE_OPTIONS: { id: PackageSize; hint: string }[] = [
  { id: "Pequeño", hint: "Sobre / caja chica" },
  { id: "Mediano", hint: "Hasta una mochila" },
  { id: "Grande", hint: "Caja voluminosa" },
];

export function ClientView() {
  const { currentRide, setCurrentRide, pushHistory, raining, setRaining, setPendingRating } = useApp();
  const [origin, setOrigin] = useState<Place | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>("Nequi");
  const [serviceType, setServiceType] = useState<ServiceType>("Persona");
  const [packageSize, setPackageSize] = useState<PackageSize>("Mediano");
  const [packageNote, setPackageNote] = useState("");
  const [searching, setSearching] = useState(false);

  const q = origin && destination ? quote(origin, destination, { serviceType, packageSize, raining }) : null;

  useEffect(() => {
    if (!currentRide || currentRide.status !== "Aceptado") return;
    const tEnroute = setTimeout(() => {
      notify(
        "enroute",
        "Tu motorizado va en camino",
        `Carlos M. está cerca de ${currentRide.origin.name}.`,
        { tag: `ride-${currentRide.id}` },
      );
      toast("Conductor en camino", { description: "Está muy cerca del punto de recogida." });
    }, 3500);
    const tDone = setTimeout(() => {
      const completed = { ...currentRide, status: "Completado" as const };
      pushHistory(completed);
      setPendingRating(completed);
      setCurrentRide(null);
      toast.success("Viaje completado", { description: "Califica tu experiencia." });
      notify(
        "completed",
        "Viaje completado ✅",
        `Llegaste a ${currentRide.destination.name}. Total: ${formatCOP(currentRide.price)}.`,
        { tag: `ride-${currentRide.id}` },
      );
    }, 8000);
    return () => {
      clearTimeout(tEnroute);
      clearTimeout(tDone);
    };
  }, [currentRide, pushHistory, setCurrentRide]);

  function requestRide() {
    if (!origin || !destination || !q) return;
    if (q.outOfCoverage) {
      toast.error("Zona fuera de cobertura", {
        description: "Medallo Express opera en el Valle de Aburrá y municipios cercanos.",
      });
      return;
    }
    setSearching(true);
    const ride = {
      id: crypto.randomUUID(),
      origin,
      destination,
      distanceKm: q.distanceKm,
      durationMin: q.durationMin,
      price: q.price,
      payment,
      status: "Pendiente" as const,
      createdAt: Date.now(),
      serviceType,
      raining: q.rainingApplied,
      longDistance: q.longDistance,
      ...(serviceType === "Paquete" ? { packageSize, packageNote: packageNote.trim() || undefined } : {}),
    };
    setCurrentRide(ride);
    setTimeout(() => {
      setCurrentRide({ ...ride, status: "Aceptado" });
      setSearching(false);
      toast.success("¡Conductor en camino!", {
        description: "Carlos M. · Honda CB 160 · Placa MED-23A",
      });
      notify(
        "accepted",
        "Conductor aceptó tu viaje",
        "Carlos M. · Honda CB 160 · MED-23A. Llega en ~3 min.",
        { tag: `ride-${ride.id}` },
      );
    }, 2200);
  }

  if (currentRide) {
    return (
      <div className="space-y-3">
        <div className="relative h-64 overflow-hidden rounded-2xl border border-border shadow-card">
          <RideMap origin={currentRide.origin} destination={currentRide.destination} />
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          {currentRide.status === "Pendiente" || searching ? (
            <div className="space-y-3 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-neon border-t-transparent" />
              <h3 className="text-lg font-semibold">Buscando conductor cercano…</h3>
              <p className="text-sm text-muted-foreground">Estamos contactando motorizados en {currentRide.origin.zone}.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Conductor confirmado</span>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-neon">
                  {currentRide.serviceType === "Paquete" ? <Package className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
                  {currentRide.serviceType ?? "Persona"}
                  {currentRide.serviceType === "Paquete" && currentRide.packageSize ? ` · ${currentRide.packageSize}` : ""}
                </span>
              </div>
              {currentRide.serviceType === "Paquete" && currentRide.packageNote && (
                <p className="rounded-lg bg-secondary p-2 text-xs text-muted-foreground">
                  {currentRide.packageNote}
                </p>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neon-gradient text-lg font-bold text-neon-foreground">CM</div>
                <div className="flex-1">
                  <div className="font-semibold">Carlos M.</div>
                  <div className="text-xs text-muted-foreground">Honda CB 160 · MED-23A · ⭐ 4.9</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Llega en</div>
                  <div className="text-lg font-bold text-neon">3 min</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
                <div>
                  <div className="text-muted-foreground">Distancia</div>
                  <div className="font-semibold">{currentRide.distanceKm} km</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Tiempo</div>
                  <div className="font-semibold">{currentRide.durationMin} min</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total</div>
                  <div className="font-semibold text-neon">{formatCOP(currentRide.price)}</div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  pushHistory({ ...currentRide, status: "Cancelado" });
                  setCurrentRide(null);
                  toast("Viaje cancelado");
                }}
              >
                Cancelar viaje
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative h-56 overflow-hidden rounded-2xl border border-border shadow-card">
        <RideMap origin={origin} destination={destination} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {([
          { id: "Persona" as ServiceType, icon: UserRound, label: "Persona", hint: "Transporte de pasajero" },
          { id: "Paquete" as ServiceType, icon: Package, label: "Paquete", hint: "Envío express" },
        ]).map(({ id, icon: Icon, label, hint }) => (
          <button
            key={id}
            onClick={() => setServiceType(id)}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-3 text-left transition-all",
              serviceType === id
                ? "border-neon bg-accent shadow-neon"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <Icon className={cn("h-6 w-6 shrink-0", serviceType === id && "text-neon")} />
            <div>
              <div className={cn("text-sm font-bold", serviceType === id && "text-foreground")}>{label}</div>
              <div className="text-[10px] opacity-80">{hint}</div>
            </div>
          </button>
        ))}
      </div>

      {serviceType === "Paquete" && (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div>
            <div className="mb-2 text-xs font-medium text-muted-foreground">Tamaño del paquete</div>
            <div className="grid grid-cols-3 gap-2">
              {SIZE_OPTIONS.map(({ id, hint }) => (
                <button
                  key={id}
                  onClick={() => setPackageSize(id)}
                  className={cn(
                    "rounded-xl border p-2.5 text-xs transition-all",
                    packageSize === id
                      ? "border-neon bg-accent shadow-neon"
                      : "border-border bg-secondary text-muted-foreground"
                  )}
                >
                  <div className={cn("font-semibold", packageSize === id && "text-neon")}>{id}</div>
                  <div className="mt-0.5 text-[10px] opacity-70">{hint}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Descripción y datos del destinatario (opcional)
            </label>
            <Input
              value={packageNote}
              onChange={(e) => setPackageNote(e.target.value)}
              placeholder="Ej: Documentos, entregar a Juan · 300 123 4567"
              className="h-11 rounded-xl border-border bg-input text-sm"
            />
          </div>
        </div>
      )}

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-card">
        <PlaceAutocomplete
          label={serviceType === "Paquete" ? "Recogida" : "Origen"}
          value={origin}
          onChange={setOrigin}
          placeholder="¿Dónde estás?"
          accent="origin"
        />
        <PlaceAutocomplete
          label={serviceType === "Paquete" ? "Entrega" : "Destino"}
          value={destination}
          onChange={setDestination}
          placeholder={serviceType === "Paquete" ? "¿A dónde se entrega?" : "¿A dónde vas en Medellín?"}
          accent="destination"
        />
      </div>

      <button
        onClick={() => setRaining(!raining)}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all",
          raining ? "border-neon bg-accent shadow-neon" : "border-border bg-card",
        )}
      >
        <CloudRain className={cn("h-5 w-5", raining ? "text-neon" : "text-muted-foreground")} />
        <div className="flex-1">
          <div className="text-sm font-bold">Está lloviendo</div>
          <div className="text-[11px] text-muted-foreground">
            Aplica un recargo del 15% para compensar al conductor.
          </div>
        </div>
        <Switch checked={raining} onCheckedChange={setRaining} className="data-[state=checked]:bg-neon" />
      </button>

      {origin && destination && q && q.outOfCoverage && (
        <div className="flex items-start gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <div className="font-bold text-destructive">Zona fuera de cobertura</div>
            <div className="text-xs text-muted-foreground">
              Medallo Express opera principalmente en el Valle de Aburrá. Elige un punto más cercano para continuar.
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {origin && destination && q && (
          <motion.div
            key="quote-card"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.9 }}
            className="space-y-3 rounded-2xl border border-neon/30 bg-card p-4 shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cotización</h3>
              <div className="flex flex-wrap gap-1">
                {q.surchargeZone && (
                  <Badge tone="warning"><Sparkles className="h-3 w-3" /> Recargo {q.surchargeZone}</Badge>
                )}
                {q.longDistance && !q.outOfCoverage && (
                  <Badge tone="warning"><AlertTriangle className="h-3 w-3" /> Larga distancia</Badge>
                )}
                {q.rainingApplied && (
                  <Badge tone="info"><CloudRain className="h-3 w-3" /> Lluvia +15%</Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat icon={Route} label="Distancia" value={`${q.distanceKm} km`} />
              <Stat icon={Clock} label="Tiempo" value={`${q.durationMin} min`} />
              <Stat icon={Sparkles} label="Precio" value={formatCOP(q.price)} highlight />
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Método de pago</div>
              <div className="grid grid-cols-3 gap-2">
                {PAY_OPTIONS.map(({ id, icon: Icon, hint }) => (
                  <button
                    key={id}
                    onClick={() => setPayment(id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border p-2.5 text-xs transition-all",
                      payment === id
                        ? "border-neon bg-accent shadow-neon"
                        : "border-border bg-secondary text-muted-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", payment === id && "text-neon")} />
                    <span className="font-semibold">{id}</span>
                    <span className="text-[10px] opacity-70">{hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={requestRide}
              disabled={q.outOfCoverage}
              className="h-12 w-full bg-neon-gradient text-base font-bold text-neon-foreground shadow-neon hover:opacity-95 disabled:opacity-50"
            >
              {q.outOfCoverage
                ? "Fuera de cobertura"
                : serviceType === "Paquete"
                ? "Solicitar envío"
                : "Solicitar motorizado"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!origin || !destination ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
          <div className="mb-2 text-sm font-semibold">Elige tu ruta</div>
          <p className="text-xs text-muted-foreground">
            Selecciona origen y destino para ver tu cotización al instante.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-secondary p-2.5">
      <Icon className={cn("mx-auto mb-1 h-4 w-4", highlight ? "text-neon" : "text-muted-foreground")} />
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={cn("text-sm font-bold", highlight && "text-neon")}>{value}</div>
    </div>
  );
}

function Badge({
  tone = "warning",
  children,
}: {
  tone?: "warning" | "info";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
        tone === "warning" && "bg-warning/15 text-warning",
        tone === "info" && "bg-accent text-neon",
      )}
    >
      {children}
    </span>
  );
}
