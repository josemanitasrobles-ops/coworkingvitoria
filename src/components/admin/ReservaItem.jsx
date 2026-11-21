import { Check, RotateCcw, Trash2 } from "lucide-react";
import EstadoBadge from "@/components/admin/EstadoBadge";
import { formatearFechaCorta, precio } from "@/lib/horario";

export default function ReservaItem({ reserva, onConfirmar, onLiberar, onEliminar }) {
  const esBloqueo = reserva.origen === "bloqueo";

  return (
    <div className="grid gap-4 border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 md:grid-cols-12 md:items-center">
      <div className="md:col-span-3">
        <p className="text-sm font-medium text-white">{reserva.espacio_nombre || "Espacio"}</p>
        <p className="mt-1 font-mono text-[11px] text-white/40">
          {formatearFechaCorta(reserva.fecha)} · {reserva.hora_inicio}–{reserva.hora_fin} h
        </p>
      </div>

      <div className="md:col-span-4">
        <p className="text-sm text-white/80">
          {esBloqueo ? "Bloqueo interno" : reserva.nombre}
          {reserva.origen === "manual" && (
            <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
              manual
            </span>
          )}
        </p>
        {!esBloqueo && (
          <p className="mt-1 truncate text-[11px] text-white/40">
            {reserva.telefono} · {reserva.email}
          </p>
        )}
        {reserva.notas && <p className="mt-1 text-[11px] text-white/30">{reserva.notas}</p>}
      </div>

      <div className="md:col-span-2">
        <p className="font-mono text-sm text-white/70">
          {esBloqueo ? "—" : precio(reserva.precio_total)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:col-span-3 md:justify-end">
        <EstadoBadge estado={reserva.estado} />

        {reserva.estado === "prerreservada" && (
          <button
            type="button"
            onClick={() => onConfirmar(reserva)}
            className="flex items-center gap-1.5 border border-libre/40 bg-libre/15 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300 transition-colors hover:bg-libre/25"
          >
            <Check className="h-3 w-3" />
            Confirmar
          </button>
        )}

        {reserva.estado !== "cancelada" && (
          <button
            type="button"
            onClick={() => onLiberar(reserva)}
            className="flex items-center gap-1.5 border border-white/15 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-white hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            Liberar
          </button>
        )}

        <button
          type="button"
          onClick={() => onEliminar(reserva)}
          aria-label="Eliminar reserva"
          className="grid h-8 w-8 place-items-center border border-white/10 text-white/40 transition-colors hover:border-ocupado/50 hover:text-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}