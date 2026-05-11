import { useRef, useState } from "react";
import { useApp, type DriverDocs } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Car, FileText, CheckCircle2, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DocsVerificationModal({ open, onClose }: Props) {
  const { driverDocs, setDriverDocs } = useApp();
  const [plate, setPlate] = useState("MED-23A");

  if (!open) return null;

  const allDone = driverDocs.photo && driverDocs.plate && driverDocs.soat;

  function setKey(k: keyof DriverDocs, v: boolean) {
    setDriverDocs({ [k]: v });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center">
      <div className="animate-in slide-in-from-bottom-8 w-full max-w-md rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-xs uppercase text-muted-foreground">Seguridad</div>
            <h3 className="text-lg font-bold">Verificación de documentos</h3>
            <p className="text-xs text-muted-foreground">
              Sube foto de perfil, placa y SOAT vigente para activar tu cuenta.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <DocItem
            icon={Camera}
            title="Foto de perfil"
            hint="Rostro visible, sin gafas ni gorra."
            verified={driverDocs.photo}
            onUpload={() => {
              setKey("photo", true);
              toast.success("Foto cargada");
            }}
          />
          <DocItem
            icon={Car}
            title="Placa de la moto"
            hint="Foto frontal o posterior con la placa legible."
            verified={driverDocs.plate}
            extra={
              <Input
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="MED-23A"
                className="mt-2 h-10 rounded-lg border-border bg-input text-sm uppercase tracking-wider"
                maxLength={10}
              />
            }
            onUpload={() => {
              if (plate.trim().length < 5) {
                toast.error("Ingresa una placa válida");
                return;
              }
              setKey("plate", true);
              toast.success("Placa verificada");
            }}
          />
          <DocItem
            icon={FileText}
            title="SOAT vigente"
            hint="PDF o foto del certificado SOAT."
            verified={driverDocs.soat}
            onUpload={() => {
              setKey("soat", true);
              toast.success("SOAT cargado");
            }}
          />
        </div>

        <Button
          onClick={() => {
            if (!allDone) {
              toast("Completa los tres documentos");
              return;
            }
            toast.success("¡Verificación enviada!", {
              description: "Revisaremos tus documentos en menos de 24 horas.",
            });
            onClose();
          }}
          className="mt-5 h-12 w-full bg-neon-gradient font-bold text-neon-foreground shadow-neon"
        >
          {allDone ? "Enviar verificación" : "Completa los documentos"}
        </Button>
      </div>
    </div>
  );
}

function DocItem({
  icon: Icon,
  title,
  hint,
  verified,
  extra,
  onUpload,
}: {
  icon: any;
  title: string;
  hint: string;
  verified: boolean;
  extra?: React.ReactNode;
  onUpload: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className={cn(
        "rounded-2xl border p-3 transition-all",
        verified ? "border-neon/50 bg-accent/40" : "border-border bg-secondary",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            verified ? "bg-neon text-neon-foreground" : "bg-card text-muted-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold">{title}</div>
          <div className="text-[11px] text-muted-foreground">{hint}</div>
        </div>
        {verified ? (
          <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[10px] font-bold uppercase text-success">
            <CheckCircle2 className="h-3 w-3" /> Verificado
          </span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => ref.current?.click()}
            className="h-9 gap-1"
          >
            <Upload className="h-3.5 w-3.5" /> Subir
          </Button>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={() => onUpload()}
        />
      </div>
      {extra}
    </div>
  );
}
