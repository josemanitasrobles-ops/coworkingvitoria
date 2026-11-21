import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { formatearFechaLarga, precio } from "@/lib/horario";

export default function Confirmacion({ datos }) {
  return (
    <div className="border border-border bg-white p-8 text-center md:p-12">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-7 w-7 text-libre" />
      </div>
      <h2 className="mt-6 font-display text-3xl font-light text-ink">Solicitud enviada</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Hemos recibido tu solicitud y el espacio queda <strong className="text-ink">prerreservado</strong>{" "}
        (pendiente de confirmación). El equipo la revisará y te confirmará por correo o teléfono.
      </p>

      <dl className="mx-auto mt-8 max-w-sm divide-y divide-border border-y border-border text-left text-sm">
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted-foreground">Espacio</dt>
          <dd className="text-right font-medium text-ink">{datos.espacio_nombre}</dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted-foreground">Día</dt>
          <dd className="text-right capitalize text-ink">{formatearFechaLarga(datos.fecha)}</dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted-foreground">Horario</dt>
          <dd className="text-right font-mono text-ink">
            {datos.hora_inicio} – {datos.hora_fin} h
          </dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted-foreground">Precio estimado</dt>
          <dd className="text-right font-mono text-ink">{precio(datos.precio_total)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="bg-ink px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-ochre"
        >
          Volver al inicio
        </Link>
        <Link
          to="/espacios"
          className="border border-border px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink"
        >
          Ver el plano
        </Link>
      </div>
    </div>
  );
}