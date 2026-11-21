import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { base44, obtenerDatos } from "@/api/sheetsClient";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import SelectorFechaHora from "@/components/espacios/SelectorFechaHora";
import EspacioSheet from "@/components/espacios/EspacioSheet";
import usePublicConfig from "@/hooks/usePublicConfig";
import PlanoOficina from "@/components/espacios/PlanoOficina";
import {
  estadoEspacio,
  franjas as generarFranjas,
  hoyISO,
  normalizarFechaISO,
  precio,
  sumarHoras,
} from "@/lib/horario";
import { Users } from "lucide-react";

export const Route = createFileRoute("/espacios")({
  component: EspaciosPage,
  head: () => ({
    meta: [
      { title: "Espacios y reservas · Núcleo Vitoria" },
      {
        name: "description",
        content:
          "Consulta el plano del coworking, elige día y hora y reserva el espacio que necesitas en Vitoria-Gasteiz.",
      },
    ],
  }),
});

const PUNTOS = { libre: "bg-libre", prerreservada: "bg-pendiente", reservada: "bg-ocupado" };
const TEXTOS = { libre: "Libre", prerreservada: "Pendiente", reservada: "Ocupado" };

function EspaciosPage() {
  const config = usePublicConfig();
  const [espacios, setEspacios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);

  const listaFranjas = useMemo(
    () => generarFranjas(config.hora_apertura, config.hora_cierre),
    [config.hora_apertura, config.hora_cierre]
  );
  const horaActiva = hora || listaFranjas[0] || "09:00";
  const fin = sumarHoras(horaActiva, 1);

  useEffect(() => {
    setFecha(hoyISO());
  }, []);

  useEffect(() => {
    base44.entities.Espacio.list()
      .then((data) => {
        const lista = Array.isArray(data) ? data : data?.items ?? [];
        const visibles = lista.filter((item) =>
          item.activo !== undefined ? Boolean(item.activo) : item.disponible !== false
        );
        setEspacios(visibles);
      })
      .catch(() => setEspacios([]));
  }, []);

  useEffect(() => {
    if (!fecha) return;
    const fechaObjetivo = normalizarFechaISO(fecha);

    obtenerDatos("Reservas")
      .then((data) => {
        const lista = Array.isArray(data) ? data : data?.items ?? data?.reservas ?? [];
        const filtradas = lista.filter((r) => normalizarFechaISO(r.fecha) === fechaObjetivo);
        setReservas(filtradas);
      })
      .catch(() => setReservas([]));
  }, [fecha]);

  const estados = useMemo(() => {
    const mapa = {};
    for (const espacio of espacios) {
      mapa[espacio.id] = estadoEspacio(reservas, espacio.id, horaActiva, fin);
    }
    return mapa;
  }, [espacios, reservas, horaActiva, fin]);

  return (
    <div className="min-h-screen bg-silver">
      <SiteHeader nombre={config.nombre_negocio} />
      <main className="pt-[72px] md:pt-20">
        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
            <p className="eyebrow">Espacios y reservas</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-light leading-[1.05] text-ink sm:text-5xl">
              Elige dónde quieres trabajar.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Selecciona día y hora para ver la disponibilidad real de cada espacio. Los colores
              del plano se calculan al instante a partir de las reservas guardadas.
            </p>
            <SelectorFechaHora
              className="mt-9"
              fecha={fecha}
              onFecha={setFecha}
              hora={horaActiva}
              onHora={setHora}
              franjas={listaFranjas}
            />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <PlanoOficina espacios={espacios} estados={estados} onSelect={setSeleccionado} />
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Toca cualquier zona del plano para ver las fotos, los servicios y reservar. La
                franja mostrada es de una hora; podrás ampliarla en el formulario.
              </p>
            </div>

            <aside className="lg:col-span-4">
              <p className="eyebrow">Listado</p>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {espacios.map((espacio) => {
                  const estado = estados[espacio.id] || "libre";
                  return (
                    <li key={espacio.id}>
                      <button
                        type="button"
                        onClick={() => setSeleccionado(espacio)}
                        className="group flex w-full items-start justify-between gap-4 py-4 text-left"
                      >
                        <span>
                          <span className="block text-sm font-medium text-ink group-hover:text-ochre">
                            {espacio.nombre}
                          </span>
                          <span className="mt-1 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {espacio.capacidad || 1} · {precio(espacio.precio_hora)}/h
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2 pt-1">
                          <span className={`h-2 w-2 rounded-full ${PUNTOS[estado]}`} />
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                            {TEXTOS[estado]}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                {!espacios.length && (
                  <li className="py-6 text-sm text-muted-foreground">Cargando espacios…</li>
                )}
              </ul>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter config={config} />

      <EspacioSheet
        espacio={seleccionado}
        estado={seleccionado ? estados[seleccionado.id] || "libre" : "libre"}
        fecha={fecha}
        hora={horaActiva}
        fin={fin}
        onClose={() => setSeleccionado(null)}
      />
    </div>
  );
}