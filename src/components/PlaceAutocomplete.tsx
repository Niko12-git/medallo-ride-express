import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { PLACES, type Place } from "@/lib/store";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: Place | null;
  onChange: (p: Place) => void;
  placeholder?: string;
  accent?: "origin" | "destination";
}

export function PlaceAutocomplete({ label, value, onChange, placeholder, accent }: Props) {
  const [q, setQ] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setQ(value?.name ?? ""), [value]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = PLACES.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 6);

  return (
    <div ref={ref} className="relative">
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <span
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2",
            accent === "origin" ? "text-muted-foreground" : "text-neon"
          )}
        >
          <MapPin className="h-4 w-4" />
        </span>
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="h-12 rounded-xl border-border bg-input pl-10 text-sm font-medium"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-card">
          {filtered.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                onChange(p);
                setQ(p.name);
                setOpen(false);
              }}
              className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-secondary"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
              <div>
                <div className="font-medium">{p.name}</div>
                {p.zone && (
                  <div className="text-xs text-muted-foreground">{p.zone} · Medellín</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
