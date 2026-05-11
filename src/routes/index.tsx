import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { ClientView } from "@/components/ClientView";
import { DriverView } from "@/components/DriverView";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PanicButton } from "@/components/PanicButton";
import { NotificationsPrompt } from "@/components/NotificationsPrompt";
import { RatingModal } from "@/components/RatingModal";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medallo Express — Motorizado en Medellín" },
      { name: "description", content: "Pide tu motorizado en Medellín en segundos. Tarifas justas, pago en Efectivo, Nequi o Bancolombia." },
    ],
  }),
  component: Index,
});

function Index() {
  const role = useApp((s) => s.role);
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <AppHeader />
      <NotificationsPrompt />
      <main className="flex-1 px-4 py-4 pb-28">
        {role === "cliente" ? <ClientView /> : <DriverView />}
      </main>
      <PanicButton />
      <BottomNav />
      <RatingModal />
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}
