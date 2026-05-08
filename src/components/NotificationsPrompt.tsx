import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import {
  notificationPermission,
  requestNotificationPermission,
  notificationsSupported,
} from "@/lib/notifications";
import { toast } from "sonner";

export function NotificationsPrompt() {
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setPerm(notificationPermission());
    if (typeof sessionStorage !== "undefined") {
      setDismissed(sessionStorage.getItem("medallo:notif-dismissed") === "1");
    }
  }, []);

  if (!notificationsSupported() || perm !== "default" || dismissed) return null;

  return (
    <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-neon/40 bg-card p-3 shadow-card">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neon-gradient text-neon-foreground">
        <Bell className="h-4 w-4" />
      </div>
      <div className="flex-1 text-xs">
        <div className="font-semibold">Activa las notificaciones</div>
        <div className="text-muted-foreground">
          Recibe alertas del viaje y del botón de pánico.
        </div>
      </div>
      <button
        onClick={async () => {
          const r = await requestNotificationPermission();
          setPerm(r);
          if (r === "granted") toast.success("Notificaciones activadas");
          else if (r === "denied") toast("Notificaciones bloqueadas en el navegador");
        }}
        className="rounded-lg bg-neon px-3 py-1.5 text-xs font-bold text-neon-foreground"
      >
        Activar
      </button>
      <button
        aria-label="Cerrar"
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem("medallo:notif-dismissed", "1");
        }}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
