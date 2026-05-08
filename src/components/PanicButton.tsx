import { useApp } from "@/lib/store";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { notify } from "@/lib/notifications";

export function PanicButton() {
  const trigger = useApp((s) => s.triggerPanic);
  return (
    <button
      onClick={() => {
        trigger();
        toast.error("Alerta de pánico enviada", {
          description: "Hemos notificado a tu contacto de emergencia y a la central. Mantén la calma.",
          duration: 5000,
        });
        notify(
          "panic",
          "🚨 Alerta de pánico activada",
          "Notificamos a tu contacto de emergencia y a la central de Medallo Express.",
          { tag: "panic" },
        );
        if (navigator.vibrate) navigator.vibrate([200, 80, 200]);
      }}
      className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-[0_0_24px_oklch(0.62_0.24_25/.7)] ring-2 ring-destructive/40 transition-transform active:scale-95"
      aria-label="Botón de pánico"
    >
      <AlertTriangle className="h-6 w-6" />
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-30" />
    </button>
  );
}
