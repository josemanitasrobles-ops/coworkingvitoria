import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@tanstack/react-router";

export default function PasoContacto({ valores, onCambio, onSubmit, enviando, error, onVolver }) {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <Label htmlFor="nombre" className="eyebrow">
          Nombre y apellidos
        </Label>
        <Input
          id="nombre"
          value={valores.nombre}
          onChange={(e) => onCambio({ nombre: e.target.value })}
          placeholder="Ana Fernández"
          autoComplete="name"
          required
          className="mt-2 h-12 rounded-none border-border bg-white"
        />
      </div>

      <div>
        <Label htmlFor="telefono" className="eyebrow">
          Teléfono
        </Label>
        <Input
          id="telefono"
          type="tel"
          value={valores.telefono}
          onChange={(e) => onCambio({ telefono: e.target.value })}
          placeholder="600 000 000"
          autoComplete="tel"
          required
          className="mt-2 h-12 rounded-none border-border bg-white"
        />
      </div>

      <div>
        <Label htmlFor="email" className="eyebrow">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          value={valores.email}
          onChange={(e) => onCambio({ email: e.target.value })}
          placeholder="ana@empresa.com"
          autoComplete="email"
          required
          className="mt-2 h-12 rounded-none border-border bg-white"
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        <Checkbox
          id="privacidad"
          checked={valores.privacidad}
          onCheckedChange={(v) => onCambio({ privacidad: v === true })}
          className="mt-0.5"
        />
        <Label htmlFor="privacidad" className="text-xs font-normal leading-relaxed text-muted-foreground">
          He leído y acepto la{" "}
          <Link to="/privacidad" className="underline hover:text-ochre">
            política de privacidad
          </Link>{" "}
          y el tratamiento de mis datos para gestionar esta reserva.
        </Label>
      </div>

      {error && (
        <div className="flex gap-3 border border-ocupado/30 bg-red-50 p-4 text-sm text-red-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
        <button
          type="submit"
          disabled={enviando}
          className="flex flex-1 items-center justify-center gap-2 bg-ochre px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-ink disabled:opacity-60"
        >
          {enviando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando
            </>
          ) : (
            "Enviar solicitud"
          )}
        </button>
        <button
          type="button"
          onClick={onVolver}
          className="flex items-center justify-center gap-2 border border-border px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </button>
      </div>
    </form>
  );
}