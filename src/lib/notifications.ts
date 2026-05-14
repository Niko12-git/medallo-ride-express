// Lightweight wrapper sobre la Web Notifications API.
// Funciona como "push local": si el usuario otorga permiso recibe notificaciones
// nativas del sistema (incluso con la PWA instalada). Si no, hace fallback a
// vibración + toast (manejado por el llamador).

export type NotifyKind = "panic" | "accepted" | "enroute" | "nearby" | "completed" | "info";

const ICON = "/icon-192.png";
const BADGE = "/icon-192.png";

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!notificationsSupported()) return "unsupported";
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

const VIBRATION: Record<NotifyKind, number[]> = {
  panic: [220, 90, 220, 90, 220],
  accepted: [120, 60, 120],
  enroute: [80, 40, 80],
  completed: [200],
  info: [60],
};

export function notify(
  kind: NotifyKind,
  title: string,
  body: string,
  options: { silent?: boolean; tag?: string } = {},
) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(VIBRATION[kind]);
    } catch {
      /* ignore */
    }
  }
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  try {
    const n = new Notification(title, {
      body,
      icon: ICON,
      badge: BADGE,
      tag: options.tag ?? `medallo-${kind}`,
      silent: options.silent,
      requireInteraction: kind === "panic",
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    /* ignore — algunos navegadores requieren Service Worker */
  }
}
