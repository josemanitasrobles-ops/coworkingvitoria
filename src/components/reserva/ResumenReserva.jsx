import { Image } from "@/components/ui/image";
import { Users, CalendarDays, Clock } from "lucide-react";
import { formatearFechaLarga, precio } from "@/lib/horario";

export default function ResumenReserva({ espacio, fecha, inicio, fin, total }) {
  return (
    <div className="border border-border bg-white">
      <div className="aspect-[4/3] w-full bg-secondary">
        {espacio?.fotos?.[0] ? (
          <Image
            src={espacio.fotos[0]}
            alt={espacio.nombre}
            fittingType="fill"
            className="h-full w-full"
          />
        ) : (
          <div className="grid h-full w-full place-items-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Sin foto
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="eyebrow">{espacio?.tipo || "Espacio"}</p>
        <h2 className="mt-2 font-display text-2xl font-light text-ink">
          {espacio?.nombre || "Selecciona un espacio"}
        </h2>
        {espacio?.capacidad ? (
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            Hasta {espacio.capacidad} {espacio.capacidad === 1 ? "persona" : "personas"}
          </p>
        ) : null}

        <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 text-ochre" />
            <span className="capitalize text-foreground/80">
              {fecha ? formatearFechaLarga(fecha) : "Elige un día"}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 text-ochre" />
            <span className="font-mono text-foreground/80">
              {inicio && fin ? `${inicio} – ${fin} h` : "Elige una franja"}
            </span>
          </div>
        </dl>

        <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
          <span className="eyebrow">Estimado</span>
          <span className="font-mono text-xl text-ink">{precio(total)}</span>
        </div>
      </div>
    </div>
  );
}