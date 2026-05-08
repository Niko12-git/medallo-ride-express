import { Link, useLocation } from "@tanstack/react-router";
import { Home, Clock, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/historial", label: "Historial", icon: Clock },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition-colors",
                  active ? "text-neon" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_oklch(0.88_0.24_145)]")} />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
