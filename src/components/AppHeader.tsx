import { Link } from "@tanstack/react-router";
import { RoleSwitcher } from "./RoleSwitcher";
import { Zap } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-gradient shadow-neon">
            <Zap className="h-4 w-4 text-neon-foreground" strokeWidth={3} />
          </span>
          <span className="text-base font-bold tracking-tight">
            Medallo<span className="text-neon">Express</span>
          </span>
        </Link>
        <RoleSwitcher />
      </div>
    </header>
  );
}
