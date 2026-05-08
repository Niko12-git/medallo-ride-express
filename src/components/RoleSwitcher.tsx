import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Bike, UserRound } from "lucide-react";

export function RoleSwitcher() {
  const { role, setRole } = useApp();
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-card">
      <button
        onClick={() => setRole("cliente")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
          role === "cliente" ? "bg-neon-gradient text-neon-foreground shadow-neon" : "text-muted-foreground"
        )}
      >
        <UserRound className="h-3.5 w-3.5" /> Cliente
      </button>
      <button
        onClick={() => setRole("conductor")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
          role === "conductor" ? "bg-neon-gradient text-neon-foreground shadow-neon" : "text-muted-foreground"
        )}
      >
        <Bike className="h-3.5 w-3.5" /> Conductor
      </button>
    </div>
  );
}
