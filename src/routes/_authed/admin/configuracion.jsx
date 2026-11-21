import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/sheetsClient";
import CampoAdmin, { inputDark, areaDark } from "@/components/admin/CampoAdmin";
import { CONFIG_DEFECTO } from "@/lib/horario";

export const Route = createFileRoute("/_authed/admin/configuracion")({
  component: AdminConfiguracion,
});

function AdminConfiguracion() {
  const [registro, setRegistro] = useState(null);
  const [form, setForm] = useState(CONFIG_DEFECTO);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    base44.entities.Configuracion.list({ sort: "-created_date", limit: 1 })
      .then((page) => {
        const item = (page?.items ?? [])[0];
        if (item) {
          setRegistro(item);
          setForm({ ...CONFIG_DEFECTO, ...item });
        }
      })
      .catch(() => toast.error("No se pudo cargar la configuración."))
      .finally(() => setCargando(false));
  }, []);

  const set = (parcial) => setForm((f) => ({ ...f, ...parcial }));

  const guardar = async () => {
    setGuardando(true);
    const payload = {
      nombre_negocio: form.nombre_negocio,
      direccion: form.direccion,
      telefono: form.telefono,
      email_contacto: form.email_contacto,
      email_notificaciones: form.email_notificaciones,
      hora_apertura: form.hora_apertura,
      hora_cierre: form.hora_cierre,
      texto_bienvenida: form.texto_bienvenida,
    };
    try {
      if (registro) {
        await base44.entities.Configuracion.update(registro.id, payload);
      } else {
        const creado = await base44.entities.Configuracion.create(payload);
        setRegistro(creado);
      }
      toast.success("Configuración guardada.");
    } catch (error) {
      toast.error("No se pudo guardar la configuración.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center gap-2 text-sm text-white/40">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando configuración…
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ochre">Configuración</p>
      <h1 className="mt-3 font-display text-3xl font-light text-white md:text-4xl">
        Ajustes del negocio
      </h1>
      <p className="mt-2 text-sm text-white/40">
        Estos datos se muestran en la web y determinan el horario de las franjas reservables.
      </p>

      <div className="mt-8 grid gap-5 border border-white/10 bg-white/[0.02] p-6 sm:grid-cols-2">
        <CampoAdmin label="Nombre del negocio" className="sm:col-span-2">
          <input
            value={form.nombre_negocio || ""}
            onChange={(e) => set({ nombre_negocio: e.target.value })}
            className={inputDark}
          />
        </CampoAdmin>

        <CampoAdmin label="Dirección" className="sm:col-span-2">
          <input
            value={form.direccion || ""}
            onChange={(e) => set({ direccion: e.target.value })}
            className={inputDark}
          />
        </CampoAdmin>

        <CampoAdmin label="Teléfono">
          <input
            value={form.telefono || ""}
            onChange={(e) => set({ telefono: e.target.value })}
            className={inputDark}
          />
        </CampoAdmin>

        <CampoAdmin label="Email de contacto">
          <input
            type="email"
            value={form.email_contacto || ""}
            onChange={(e) => set({ email_contacto: e.target.value })}
            className={inputDark}
          />
        </CampoAdmin>

        <CampoAdmin
          label="Email de notificaciones"
          hint="Recibe un aviso por cada nueva solicitud de reserva."
          className="sm:col-span-2"
        >
          <input
            type="email"
            value={form.email_notificaciones || ""}
            onChange={(e) => set({ email_notificaciones: e.target.value })}
            className={inputDark}
          />
        </CampoAdmin>

        <CampoAdmin label="Hora de apertura">
          <input
            type="time"
            value={form.hora_apertura || "08:00"}
            onChange={(e) => set({ hora_apertura: e.target.value })}
            className={inputDark}
            style={{ colorScheme: "dark" }}
          />
        </CampoAdmin>

        <CampoAdmin label="Hora de cierre">
          <input
            type="time"
            value={form.hora_cierre || "20:00"}
            onChange={(e) => set({ hora_cierre: e.target.value })}
            className={inputDark}
            style={{ colorScheme: "dark" }}
          />
        </CampoAdmin>

        <CampoAdmin label="Texto de bienvenida" className="sm:col-span-2">
          <textarea
            rows={3}
            value={form.texto_bienvenida || ""}
            onChange={(e) => set({ texto_bienvenida: e.target.value })}
            className={areaDark}
          />
        </CampoAdmin>
      </div>

      <button
        type="button"
        onClick={guardar}
        disabled={guardando}
        className="mt-6 flex items-center gap-2 bg-ochre px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-ink disabled:opacity-60"
      >
        {guardando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Guardar cambios
      </button>
    </div>
  );
}