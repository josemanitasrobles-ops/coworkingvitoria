import { Users } from "lucide-react";
import { precio } from "@/lib/horario";
import { cn } from "@/lib/utils";

const ESTILOS = {
  libre: "border-libre/30 bg-emerald-50 hover:bg-emerald-100",
  prerreservada: "border-pendiente/40 bg-amber-50 hover:bg-amber-100",
  reservada: "border-ocupado/30 bg-red-50 hover:bg-red-100",
};

const PUNTOS = {
  libre: "bg-libre",
  prerreservada: "bg-pendiente",
  reservada: "bg-ocupado",
};

const ETIQUETAS = {
  libre: "Libre",
  prerreservada: "Pendiente",
  reservada: "Ocupado",
};

function Leyenda() {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
      {Object.keys(ESTILOS).map((estado) => (
        <span key={estado} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("h-2.5 w-2.5 rounded-full", PUNTOS[estado])} />
          {estado === "libre" && "Libre"}
          {estado === "reservada" && "Reservado / ocupado"}
          {estado === "prerreservada" && "Prerreservado (pendiente de confirmar)"}
        </span>
      ))}
    </div>
  );
}

export default function PlanoInteractivo({ espacios = [], estados = {}, onSelect }) {
  return (
    <div>
      <div
        className="relative w-full overflow-hidden border border-border bg-white"
        style={{
          aspectRatio: "4 / 3",
          backgroundImage:
            "linear-gradient(to right, #eef2f7 1px, transparent 1px), linear-gradient(to bottom, #eef2f7 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <span className="absolute left-4 top-3 font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Planta baja · acceso por Calle Dato
        </span>

        {espacios.map((espacio) => {
          const estado = estados[espacio.id] || "libre";
          return (
            <button
              key={espacio.id}
              type="button"
              onClick={() => onSelect(espacio)}
              style={{
                left: `${espacio.plano_x ?? 10}%`,
                top: `${espacio.plano_y ?? 10}%`,
                width: `${espacio.plano_ancho ?? 20}%`,
                height: `${espacio.plano_alto ?? 20}%`,
                minWidth: 44,
                minHeight: 44,
              }}
              className={cn(
                "absolute flex flex-col items-start justify-between border p-2 text-left transition-all duration-300 sm:p-3",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2",
                ESTILOS[estado]
              )}
              aria-label={`${espacio.nombre}, ${ETIQUETAS[estado]}`}
            >
              <span className="flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", PUNTOS[estado])} />
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-foreground/60 sm:text-[9px]">
                  {ETIQUETAS[estado]}
                </span>
              </span>
              <span className="w-full">
                <span className="block text-[11px] font-medium leading-tight text-ink sm:text-sm">
                  {espacio.nombre}
                </span>
                <span className="mt-0.5 hidden items-center gap-2 font-mono text-[10px] text-foreground/50 sm:flex">
                  <Users className="h-3 w-3" />
                  {espacio.capacidad || 1} · {precio(espacio.precio_hora)}/h
                </span>
              </span>
            </button>
          );
        })}

        {!espacios.length && (
          <div className="absolute inset-0 grid place-items-center">
            <p className="text-sm text-muted-foreground">Cargando plano…</p>
          </div>
        )}
      </div>
      <Leyenda />
    </div>
  );
}