import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function SelectorFechaHora({
  fecha,
  onFecha,
  hora,
  onHora,
  franjas = [],
  className,
}) {
  const fechaDate = fecha ? new Date(`${fecha}T12:00:00`) : undefined;

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6", className)}>
      <div className="flex items-center gap-3">
        <span className="eyebrow hidden sm:block">Día</span>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex h-11 min-w-[220px] items-center gap-3 border border-border bg-white px-4 text-sm text-ink transition-colors hover:border-ink"
            >
              <CalendarDays className="h-4 w-4 text-ochre" />
              {fechaDate ? (
                <span className="capitalize">
                  {format(fechaDate, "EEEE d 'de' MMMM", { locale: es })}
                </span>
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
              onSelect={(d) => d && onFecha(format(d, "yyyy-MM-dd"))}
              disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="selector-hora" className="eyebrow hidden sm:block">
          Hora
        </label>
        <div className="relative flex items-center">
          <Clock className="pointer-events-none absolute left-3.5 h-4 w-4 text-ochre" />
          <select
            id="selector-hora"
            value={hora}
            onChange={(e) => onHora(e.target.value)}
            className="h-11 min-w-[150px] cursor-pointer appearance-none border border-border bg-white pl-10 pr-9 font-mono text-xs tracking-wider text-ink transition-colors hover:border-ink focus:border-ink focus:outline-none"
          >
            {franjas.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 text-[10px] text-muted-foreground">
            ▼
          </span>
        </div>
      </div>
    </div>
  );
}