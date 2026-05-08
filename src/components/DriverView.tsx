import { useEffect, useState } from "react";
import { useApp, PLACES, quote, formatCOP, type Ride } from "@/lib/store";
import { RideMap } from "./RideMap";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Navigation2, Wallet, Clock, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { notify } from "@/lib/notifications";

function generateRequest(): Ride {
  const a = PLACES[Math.floor(Math.random() * PLACES.length)];
  let b = PLACES[Math.floor(Math.random() * PLACES.length)];
  while (b.name === a.name) b = PLACES[Math.floor(Math.random() * PLACES.length)];
  const q = quote(a, b);
  return {
    id: crypto.randomUUID(),
    origin: a,
    destination: b,
    ...q,
    payment: ["Efectivo", "Nequi", "Bancolombia"][Math.floor(Math.random() * 3)] as any,
    status: "Pendiente",
    createdAt: Date.now(),
  };
}

export function DriverView() {
  const { online, setOnline, currentRide, setCurrentRide, pushHistory } = useApp();
  const [request, setRequest] = useState<Ride | null>(null);

  useEffect(() => {
    if (!online || currentRide || request) return;
    const t = setTimeout(() => {
      const r = generateRequest();
      setRequest(r);
      notify(
        "info",
        "Nueva solicitud de viaje",
        `${r.origin.name} → ${r.destination.name} · ${formatCOP(r.price * 0.85)}`,
        { tag: `req-${r.id}` },
      );
    }, 3500);
    return () => clearTimeout(t);
  }, [online, currentRide, request]);

  function accept() {
    if (!request) return;
    const accepted = { ...request, status: "Aceptado" as const };
    setCurrentRide(accepted);
    setRequest(null);
    toast.success("Servicio aceptado", { description: "Dirígete al punto de recogida." });
    notify(
      "accepted",
      "Servicio aceptado",
      `Dirígete a ${accepted.origin.name}.`,
      { tag: `ride-${accepted.id}` },
    );
  }

  function complete() {
    if (!currentRide) return;
    pushHistory({ ...currentRide, status: "Completado" });
    setCurrentRide(null);
    toast.success("Viaje completado", { description: `Ganancia: ${formatCOP(currentRide.price * 0.85)}` });
    notify(
      "completed",
      "Viaje completado ✅",
      `Ganancia: ${formatCOP(currentRide.price * 0.85)}`,
      { tag: `ride-${currentRide.id}` },
    );
  }


  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card">
        <div>
          <div className="text-xs uppercase text-muted-foreground">Estado</div>
          <div className="text-lg font-bold">
            {online ? <span className="text-neon">En línea</span> : <span>Desconectado</span>}
          </div>
          <div className="text-xs text-muted-foreground">
            {online ? "Recibiendo solicitudes en Medellín" : "Activa para empezar a trabajar"}
          </div>
        </div>
        <Switch checked={online} onCheckedChange={setOnline} className="data-[state=checked]:bg-neon" />
      </div>

      <div className="relative h-64 overflow-hidden rounded-2xl border border-border shadow-card">
        <RideMap origin={currentRide?.origin} destination={currentRide?.destination} />
        {!currentRide && (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background/90 to-transparent p-4">
            <p className="text-xs text-muted-foreground">
              {online ? "Esperando solicitudes…" : "Sin servicios activos"}
            </p>
          </div>
        )}
      </div>

      {currentRide ? (
        <div className="space-y-3 rounded-2xl border border-neon/40 bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-neon">
            <Navigation2 className="h-5 w-5" />
            <span className="font-semibold">Servicio en curso</span>
          </div>
          <Route ride={currentRide} />
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <Pill icon={Clock} label={`${currentRide.durationMin} min`} />
            <Pill icon={MapPin} label={`${currentRide.distanceKm} km`} />
            <Pill icon={Wallet} label={formatCOP(currentRide.price * 0.85)} highlight />
          </div>
          <Button
            onClick={complete}
            className="h-12 w-full bg-neon-gradient font-bold text-neon-foreground shadow-neon"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" /> Finalizar servicio
          </Button>
        </div>
      ) : online && request ? (
        <div className="animate-in slide-in-from-bottom-4 space-y-3 rounded-2xl border-2 border-neon bg-card p-4 shadow-neon">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-neon px-2 py-0.5 text-[10px] font-bold uppercase text-neon-foreground">
              Nueva solicitud
            </span>
            <span className="text-xs text-muted-foreground">{request.payment}</span>
          </div>
          <Route ride={request} />
          <div className="grid grid-cols-3 gap-2 text-center">
            <Pill icon={MapPin} label={`${request.distanceKm} km`} />
            <Pill icon={Clock} label={`${request.durationMin} min`} />
            <Pill icon={Wallet} label={formatCOP(request.price * 0.85)} highlight />
          </div>
          <div className="grid grid-cols-[1fr_2fr] gap-2">
            <Button
              variant="outline"
              onClick={() => setRequest(null)}
              className="h-12"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              onClick={accept}
              className="h-12 bg-neon-gradient font-bold text-neon-foreground shadow-neon"
            >
              Aceptar servicio
            </Button>
          </div>
        </div>
      ) : online ? (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 text-sm font-semibold">Buscando solicitudes…</div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Activa el modo en línea para comenzar a recibir servicios.
        </div>
      )}
    </div>
  );
}

function Route({ ride }: { ride: Ride }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-2 w-2 rounded-full bg-muted-foreground" />
        <div>
          <div className="text-[10px] uppercase text-muted-foreground">Recogida</div>
          <div className="font-medium">{ride.origin.name}</div>
        </div>
      </div>
      <div className="ml-1 h-4 w-px bg-border" />
      <div className="flex items-start gap-2">
        <div className="mt-1.5 h-2 w-2 rounded-full bg-neon shadow-neon" />
        <div>
          <div className="text-[10px] uppercase text-muted-foreground">Destino</div>
          <div className="font-medium">{ride.destination.name}</div>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, label, highlight }: { icon: any; label: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-secondary p-2">
      <Icon className={"mx-auto mb-1 h-4 w-4 " + (highlight ? "text-neon" : "text-muted-foreground")} />
      <div className={"text-xs font-bold " + (highlight ? "text-neon" : "")}>{label}</div>
    </div>
  );
}
