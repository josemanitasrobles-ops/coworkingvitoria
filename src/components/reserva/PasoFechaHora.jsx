import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

export default function PasoFechaHora({
  espacios,
  valores,
  onCambio,
  franjas,
  duraciones,
  error,
  comprobando,
  onSiguiente,
}) {
  const fechaDate = valores.fecha ? new Date(`${valores.fecha}T12:00:00`) : undefined;

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSiguiente();
      }}
    >
      <div>
        <Label htmlFor="espacio" className="eyebrow">
          Espacio
        </Label>
        <select
          id="espacio"
          value={valores.espacioId}
          onChange={(e) => onCambio({ espacioId: e.target.value })}
          className="mt-2 h-12 w-full border border-border bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none"
        >
          <option value="">Selecciona un espacio</option>
          {espacios.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre} · {e.tipo || "Espacio"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="eyebrow">Día</span>
        <div className="mt-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex h-12 w-full items-center gap-3 border border-border bg-white px-3 text-left text-sm text-ink transition-colors hover:border-ink"
              >
                <CalendarDays className="h-4 w-4 text-ochre" />
                {fechaDate ? (
                  <span className="capitalize">{format(fechaDate, "EEEE d 'de' MMMM", { locale: es })}</span>
                ) : (
                  <span className="text-muted-foreground">Elige un día</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fechaDate}
                locale={es}
                onSelect={(d) => d && onCambio({ fecha: format(d, "yyyy-MM-dd") })}
                disabled={{ before: new Date() }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="inicio" className="eyebrow">
            Hora de inicio
          </Label>
          <select
            id="inicio"
            value={valores.inicio}
            onChange={(e) => onCambio({ inicio: e.target.value })}
            className="mt-2 h-12 w-full border border-border bg-white px-3 font-mono text-sm text-ink focus:border-ink focus:outline-none"
          >
            <option value="">Selecciona</option>
            {franjas.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="duracion" className="eyebrow">
            Duración
          </Label>
          <select
            id="duracion"
            value={valores.duracion}
            onChange={(e) => onCambio({ duracion: Number(e.target.value) })}
            className="mt-2 h-12 w-full border border-border bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none"
          >
            {duraciones.map((d) => (
              <option key={d} value={d}>
                {d} {d === 1 ? "hora" : "horas"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex gap-3 border border-ocupado/30 bg-red-50 p-4 text-sm text-red-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={comprobando}
        className="flex w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-ochre disabled:opacity-60"
      >
        {comprobando ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Comprobando disponibilidad
          </>
        ) : (
          "Siguiente"
        )}
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        Al continuar comprobaremos la disponibilidad real de la franja.
      </p>
      <Input type="hidden" value={valores.fecha} readOnly />
    </form>
  );
}