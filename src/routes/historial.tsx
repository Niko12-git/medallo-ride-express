import { createFileRoute } from "@tanstack/react-router";
import { useApp, formatCOP } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { CheckCircle2, XCircle, MapPin, Package, UserRound } from "lucide-react";

export const Route = createFileRoute("/historial")({
  head: () => ({ meta: [{ title: "Historial — Medallo Express" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const history = useApp((s) => s.history);
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <AppHeader />
      <main className="flex-1 px-4 py-4 pb-28">
        <h1 className="mb-4 text-2xl font-bold tracking-tight">Historial de viajes</h1>
        {history.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Aún no tienes viajes registrados.
          </p>
        ) : (
          <ul className="space-y-3">
            {history.map((r) => (
              <li key={r.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                  <span
                    className={
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase " +
                      (r.status === "Completado"
                        ? "bg-success/15 text-success"
                        : "bg-destructive/15 text-destructive")
                    }
                  >
                    {r.status === "Completado" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {r.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{r.origin.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
                    <span>{r.destination.name}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    {r.serviceType === "Paquete" ? <Package className="h-3 w-3 text-neon" /> : <UserRound className="h-3 w-3" />}
                    {r.serviceType ?? "Persona"}
                    {r.serviceType === "Paquete" && r.packageSize ? ` · ${r.packageSize}` : ""}
                    {" · "}{r.distanceKm} km · {r.payment}
                  </span>
                  <span className="text-base font-bold text-neon">{formatCOP(r.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
