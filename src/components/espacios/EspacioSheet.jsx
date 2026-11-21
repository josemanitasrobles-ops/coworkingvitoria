import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Users, ArrowRight, ImageOff } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Image } from "@/components/ui/image";
import { formatearFechaLarga, precio } from "@/lib/horario";
import { cn } from "@/lib/utils";

const MENSAJES = {
  libre: {
    titulo: "Disponible en esta franja",
    texto: "Puedes enviar tu solicitud ahora mismo. La plaza se bloquea en cuanto la recibimos.",
    clase: "border-libre/30 bg-emerald-50 text-emerald-900",
  },
  prerreservada: {
    titulo: "Pendiente de confirmación",
    texto:
      "Otra persona ha solicitado este espacio en la franja elegida y está a la espera de confirmación. Prueba otra hora o elige otro espacio.",
    clase: "border-pendiente/40 bg-amber-50 text-amber-900",
  },
  reservada: {
    titulo: "Ocupado",
    texto: "Este espacio ya está reservado en la franja elegida. Elige otra hora u otro espacio.",
    clase: "border-ocupado/30 bg-red-50 text-red-900",
  },
};

export default function EspacioSheet({ espacio, estado = "libre", fecha, hora, fin, onClose }) {
  const [fotoActiva, setFotoActiva] = useState(0);

  useEffect(() => {
    setFotoActiva(0);
  }, [espacio?.id]);

  const abierto = Boolean(espacio);
  const fotos = espacio?.fotos?.filter(Boolean) || [];
  const info = MENSAJES[estado];

  return (
    <Sheet open={abierto} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto border-l border-border bg-white p-0 sm:max-w-[480px]">
        {espacio && (
          <div>
            <div className="relative aspect-[4/3] w-full bg-secondary">
              {fotos.length ? (
                <Image
                  src={fotos[fotoActiva]}
                  alt={espacio.nombre}
                  fittingType="fill"
                  className="h-full w-full"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground">
                  <ImageOff className="h-6 w-6" />
                </div>
              )}
            </div>

            {fotos.length > 1 && (
              <div className="flex gap-2 px-6 pt-4">
                {fotos.map((foto, i) => (
                  <button
                    key={foto + i}
                    type="button"
                    onClick={() => setFotoActiva(i)}
                    className={cn(
                      "h-14 w-20 overflow-hidden border transition-opacity",
                      i === fotoActiva ? "border-ochre" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    aria-label={`Foto ${i + 1}`}
                  >
                    <Image src={foto} alt="" fittingType="fill" className="h-full w-full" />
                  </button>
                ))}
              </div>
            )}

            <div className="px-6 pb-8 pt-5">
              <SheetHeader className="space-y-2 text-left">
                <p className="eyebrow">{espacio.tipo || "Espacio"}</p>
                <SheetTitle className="font-display text-3xl font-light leading-tight text-ink">
                  {espacio.nombre}
                </SheetTitle>
                <SheetDescription className="text-sm leading-relaxed text-muted-foreground">
                  {espacio.descripcion}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 grid grid-cols-2 gap-px border border-border bg-border">
                <div className="bg-white p-4">
                  <p className="eyebrow">Capacidad</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink">
                    <Users className="h-4 w-4 text-ochre" />
                    {espacio.capacidad || 1} {(espacio.capacidad || 1) === 1 ? "persona" : "personas"}
                  </p>
                </div>
                <div className="bg-white p-4">
                  <p className="eyebrow">Precio</p>
                  <p className="mt-2 font-mono text-sm text-ink">{precio(espacio.precio_hora)} / hora</p>
                </div>
              </div>

              {espacio.servicios?.length > 0 && (
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {espacio.servicios.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground/75">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ochre" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              <div className={cn("mt-6 border p-4", info.clase)}>
                <p className="text-sm font-medium">{info.titulo}</p>
                <p className="mt-1 text-xs leading-relaxed opacity-80">{info.texto}</p>
              </div>

              <div className="mt-6">
                <p className="eyebrow">Franja seleccionada</p>
                <p className="mt-2 text-sm capitalize text-ink">
                  {formatearFechaLarga(fecha)} · {hora} – {fin} h
                </p>
              </div>

              {estado === "libre" ? (
                <Link
                  to="/reservar"
                  search={{
                    espacio: espacio.id,
                    fecha,
                    inicio: hora,
                    fin,
                  }}
                  className="group mt-7 flex w-full items-center justify-center gap-3 bg-ochre px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-ink"
                >
                  Reservar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <div className="mt-7">
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed bg-secondary px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Reservar
                  </button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    {estado === "reservada"
                      ? "No disponible: el espacio está ocupado en esta franja."
                      : "No disponible: hay una solicitud pendiente de confirmación."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}