import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { base44 } from "@/api/sheetsClient";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PasoFechaHora from "@/components/reserva/PasoFechaHora";
import PasoContacto from "@/components/reserva/PasoContacto";
import ResumenReserva from "@/components/reserva/ResumenReserva";
import Confirmacion from "@/components/reserva/Confirmacion";
import usePublicConfig from "@/hooks/usePublicConfig";
import { crearSolicitudReserva, getDisponibilidad } from "@/lib/server-fns";
import {
  estadoEspacio,
  franjas as generarFranjas,
  hoyISO,
  horasEntre,
  sumarHoras,
} from "@/lib/horario";

export const Route = createFileRoute("/reservar")({
  component: ReservarPage,
  validateSearch: (search) => ({
    espacio: typeof search.espacio === "string" ? search.espacio : undefined,
    fecha: typeof search.fecha === "string" ? search.fecha : undefined,
    inicio: typeof search.inicio === "string" ? search.inicio : undefined,
    fin: typeof search.fin === "string" ? search.fin : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Solicitar reserva · Núcleo Vitoria" },
      {
        name: "description",
        content: "Completa tu solicitud de reserva en dos pasos y recibe la confirmación del equipo.",
      },
    ],
  }),
});

const MENSAJES = {
  ocupado:
    "Esa franja acaba de ocuparse (reservada o pendiente de confirmación). Elige otra hora u otro espacio.",
  espacio: "El espacio seleccionado ya no está disponible. Elige otro.",
  horario: "La franja elegida está fuera del horario de apertura.",
  privacidad: "Debes aceptar la política de privacidad para enviar la solicitud.",
};

function ReservarPage() {
  const search = Route.useSearch();
  const config = usePublicConfig();
  const [espacios, setEspacios] = useState([]);
  const [paso, setPaso] = useState(1);
  const [error, setError] = useState("");
  const [comprobando, setComprobando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const [valores, setValores] = useState({
    espacioId: search.espacio || "",
    fecha: search.fecha || "",
    inicio: search.inicio || "",
    duracion:
      search.inicio && search.fin
        ? Math.max(1, Math.round(horasEntre(search.inicio, search.fin)))
        : 1,
  });
  const [contacto, setContacto] = useState({
    nombre: "",
    telefono: "",
    email: "",
    privacidad: false,
  });

  const listaFranjas = useMemo(
    () => generarFranjas(config.hora_apertura, config.hora_cierre),
    [config.hora_apertura, config.hora_cierre]
  );
  const duraciones = useMemo(() => {
    const restantes = Math.max(
      1,
      Number(config.hora_cierre.split(":")[0]) - Number((valores.inicio || config.hora_apertura).split(":")[0])
    );
    return [1, 2, 3, 4].filter((d) => d <= Math.min(4, restantes));
  }, [config.hora_apertura, config.hora_cierre, valores.inicio]);

  const espacio = espacios.find((e) => String(e.id) === String(valores.espacioId));
  const fin = valores.inicio ? sumarHoras(valores.inicio, valores.duracion) : "";
  const total = espacio ? (Number(espacio.precio_hora) || 0) * valores.duracion : 0;

  useEffect(() => {
    setValores((v) => (v.fecha ? v : { ...v, fecha: hoyISO() }));
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

  const cambiar = (parcial) => {
    setError("");
    setValores((v) => ({ ...v, ...parcial }));
  };

  const comprobarYSeguir = async () => {
    setError("");
    if (!valores.espacioId) return setError("Selecciona el espacio que quieres reservar.");
    if (!valores.fecha) return setError("Selecciona el día de la reserva.");
    if (!valores.inicio) return setError("Selecciona la hora de inicio.");
    if (fin > config.hora_cierre) {
      return setError(`La reserva debe terminar antes de las ${config.hora_cierre}.`);
    }
    setComprobando(true);
    try {
      const reservas = await getDisponibilidad({ data: { fecha: valores.fecha } });
      const estado = estadoEspacio(reservas || [], valores.espacioId, valores.inicio, fin);
      if (estado !== "libre") {
        setError(MENSAJES.ocupado);
        return;
      }
      setPaso(2);
    } catch (e) {
      setError("No hemos podido comprobar la disponibilidad. Inténtalo de nuevo.");
    } finally {
      setComprobando(false);
    }
  };

  const enviar = async () => {
    setError("");
    if (!contacto.privacidad) return setError(MENSAJES.privacidad);
    setEnviando(true);
    try {
      const res = await crearSolicitudReserva({
        data: {
          espacio_id: valores.espacioId,
          espacio_nombre: espacio?.nombre || "",
          fecha: valores.fecha,
          hora_inicio: valores.inicio,
          hora_fin: fin,
          duracion: valores.duracion,
          precio_total: total,
          estado: "pendiente",
          confirmada: false,
          nombre: contacto.nombre.trim(),
          nombre_cliente: contacto.nombre.trim(),
          telefono: contacto.telefono.trim(),
          email: contacto.email.trim(),
          acepta_privacidad: contacto.privacidad,
        },
      });

      if (res && res.ok === false) {
        if (res.motivo === "ocupado") {
          setPaso(1);
          setError(MENSAJES.ocupado);
        } else {
          setError(MENSAJES[res.motivo] || res.error || "No hemos podido guardar la solicitud.");
        }
        return;
      }

      setResultado({
        espacio_nombre: res?.espacio_nombre || espacio?.nombre || "",
        fecha: valores.fecha,
        hora_inicio: valores.inicio,
        hora_fin: fin,
        precio_total: res?.precio_total ?? total,
        estado: "pendiente",
      });
      setPaso(3);
    } catch (e) {
      console.error("Error al guardar reserva:", e);
      setError("No hemos podido enviar la solicitud. Inténtalo de nuevo en unos minutos.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-silver">
      <SiteHeader nombre={config.nombre_negocio} />
      <main className="pt-[72px] md:pt-20">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
          <p className="eyebrow">Solicitud de reserva</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-tight text-ink sm:text-5xl">
            {paso === 3 ? "Solicitud recibida" : "Reserva tu espacio"}
          </h1>

          {paso < 3 && (
            <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span className={paso === 1 ? "text-ochre" : "text-muted-foreground"}>01 · Día y hora</span>
              <span className="h-px w-8 bg-border" />
              <span className={paso === 2 ? "text-ochre" : "text-muted-foreground"}>02 · Tus datos</span>
            </div>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className={paso === 3 ? "lg:col-span-8 lg:col-start-3" : "lg:col-span-7"}>
              {paso === 1 && (
                <PasoFechaHora
                  espacios={espacios}
                  valores={valores}
                  onCambio={cambiar}
                  franjas={listaFranjas}
                  duraciones={duraciones}
                  error={error}
                  comprobando={comprobando}
                  onSiguiente={comprobarYSeguir}
                />
              )}
              {paso === 2 && (
                <PasoContacto
                  valores={contacto}
                  onCambio={(p) => {
                    setError("");
                    setContacto((c) => ({ ...c, ...p }));
                  }}
                  onSubmit={enviar}
                  enviando={enviando}
                  error={error}
                  onVolver={() => {
                    setError("");
                    setPaso(1);
                  }}
                />
              )}
              {paso === 3 && resultado && <Confirmacion datos={resultado} />}
            </div>

            {paso < 3 && (
              <aside className="lg:col-span-5">
                <ResumenReserva
                  espacio={espacio}
                  fecha={valores.fecha}
                  inicio={valores.inicio}
                  fin={fin}
                  total={total}
                />
              </aside>
            )}
          </div>
        </div>
      </main>
      <SiteFooter config={config} />
    </div>
  );
}