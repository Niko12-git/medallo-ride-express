import { useState } from "react";
import { useApp, formatCOP } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function RatingModal() {
  const { pendingRating, setPendingRating, rateRide } = useApp();
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  if (!pendingRating) return null;

  function close() {
    setStars(0);
    setHover(0);
    setComment("");
    setPendingRating(null);
  }

  function submit() {
    if (!pendingRating || stars === 0) {
      toast("Selecciona una calificación");
      return;
    }
    rateRide(pendingRating.id, stars, comment.trim() || undefined);
    toast.success("¡Gracias por tu calificación!");
    close();
  }

  const ride = pendingRating;
  const active = hover || stars;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center">
      <div className="animate-in slide-in-from-bottom-8 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Viaje completado</div>
            <h3 className="text-lg font-bold">¿Cómo estuvo Carlos M.?</h3>
            <p className="text-xs text-muted-foreground">
              {ride.origin.name} → {ride.destination.name} · {formatCOP(ride.price)}
            </p>
          </div>
          <button
            onClick={close}
            className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
            aria-label="Omitir"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-5 flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setStars(n)}
              className="transition-transform active:scale-90"
              aria-label={`${n} estrellas`}
            >
              <Star
                className={cn(
                  "h-10 w-10 transition-all",
                  n <= active
                    ? "fill-warning text-warning drop-shadow-[0_0_6px_oklch(0.85_0.18_85_/_0.6)]"
                    : "text-muted-foreground/40",
                )}
              />
            </button>
          ))}
        </div>

        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Deja un comentario (opcional)…"
          className="min-h-20 resize-none rounded-xl border-border bg-input text-sm"
        />

        <div className="mt-4 grid grid-cols-[1fr_2fr] gap-2">
          <Button variant="outline" onClick={close} className="h-11">
            Omitir
          </Button>
          <Button
            onClick={submit}
            disabled={stars === 0}
            className="h-11 bg-neon-gradient font-bold text-neon-foreground shadow-neon disabled:opacity-50"
          >
            Enviar calificación
          </Button>
        </div>
      </div>
    </div>
  );
}
