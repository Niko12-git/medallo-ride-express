import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, IdCard, Camera, Star } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Medallo Express" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const role = useApp((s) => s.role);
  const isDriver = role === "conductor";

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <AppHeader />
      <main className="flex-1 px-4 py-4 pb-28">
        <div className="mb-4 rounded-2xl border border-border bg-card p-5 text-center shadow-card">
          <div className="relative mx-auto mb-3 h-20 w-20">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-neon-gradient text-2xl font-bold text-neon-foreground shadow-neon">
              {isDriver ? "CM" : "JP"}
            </div>
            <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-card ring-2 ring-neon">
              <Camera className="h-3.5 w-3.5 text-neon" />
            </button>
          </div>
          <h2 className="text-lg font-bold">{isDriver ? "Carlos Muñoz" : "Juan Pérez"}</h2>
          <p className="text-xs text-muted-foreground">{isDriver ? "Conductor verificado" : "Cliente"} · Medellín</p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-semibold">{isDriver ? "4.9" : "4.8"}</span>
            <span className="text-muted-foreground">· {isDriver ? "1.2k viajes" : "47 viajes"}</span>
          </div>
        </div>

        <Section title="Datos personales">
          <Field label="Nombre completo" value={isDriver ? "Carlos Muñoz Restrepo" : "Juan Pérez Gómez"} />
          <Field label="Cédula" value="1.020.345.678" />
          <Field label="Dirección" value="Calle 10 #43E-25, El Poblado" />
          <Field label="Teléfono" value="+57 300 123 4567" />
        </Section>

        {isDriver && (
          <Section title="Documentos (gestión simulada)">
            <Doc name="Licencia de conducción A2" />
            <Doc name="SOAT vigente" />
            <Doc name="Tarjeta de propiedad" />
            <Doc name="Certificado técnico-mecánico" />
          </Section>
        )}

        <Button variant="outline" className="mt-4 w-full">
          Cerrar sesión
        </Button>
      </main>
      <BottomNav />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="border-b border-border px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function Doc({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <FileText className="h-5 w-5 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium">{name}</span>
      <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success">
        <CheckCircle2 className="h-3 w-3" /> Verificado
      </span>
    </div>
  );
}
