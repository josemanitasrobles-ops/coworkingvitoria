import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Ban, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/sheetsClient";
import ReservaItem from "@/components/admin/ReservaItem";
import ReservaDialog from "@/components/admin/ReservaDialog";
import { inputDark } from "@/components/admin/CampoAdmin";
import { franjas as generarFranjas } from "@/lib/horario";

export const Route = createFileRoute("/_authed/admin/")({
  component: AdminReservas,
});

function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [filtros, setFiltros] = useState({ estado: "", fecha: "", espacio: "" });
  const [cargando, setCargando] = useState(true);
  const [contadores, setContadores] = useState({ pendientes: 0, confirmadas: 0, liberadas: 0 });
  const [dialogo, setDialogo] = useState(null);

  const listaFranjas = useMemo(() => generarFranjas("08:00", "20:00"), []);

  const cargar = useCallback(async () => {
    setCargando(true);
    const consulta = {};
    if (filtros.estado) consulta.estado = filtros.estado;
    if (filtros.fecha) consulta.fecha = filtros.fecha;
    if (filtros.espacio) consulta.espacio_id = filtros.espacio;
    try {
      const page = await base44.entities.Reserva.filter(consulta, {
        sort: "-created_date",
        limit: 200,
      });
      setReservas(page?.items ?? []);
    } catch (error) {
      toast.error("No se pudieron cargar las reservas.");
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    base44.entities.Espacio.list({ sort: "orden", limit: 100 })
      .then((page) => setEspacios(page?.items ?? []))
      .catch(() => {});
  }, []);

  const cargarContadores = useCallback(async () => {
    const res = await base44.entities.Reserva.aggregate({ groupBy: "estado" });
    const filas = res?.rows ?? [];
    const porEstado = Object.fromEntries(filas.map((f) => [f.estado, f.count]));
    setContadores({
      pendientes: porEstado.prerreservada || 0,
      confirmadas: porEstado.reservada || 0,
      liberadas: porEstado.cancelada || 0,
    });
  }, []);

  useEffect(() => {
    cargarContadores().catch(() => {});
  }, [cargarContadores]);

  const refrescar = () => {
    cargar();
    cargarContadores().catch(() => {});
  };

  const confirmar = async (reserva) => {
    await base44.entities.Reserva.update(reserva.id, { estado: "reservada" });
    toast.success(`Reserva de ${reserva.nombre} confirmada.`);
    refrescar();
  };

  const liberar = async (reserva) => {
    await base44.entities.Reserva.update(reserva.id, { estado: "cancelada" });
    toast.success("Franja liberada.");
    refrescar();
  };

  const eliminar = async (reserva) => {
    await base44.entities.Reserva.delete(reserva.id);
    toast.success("Reserva eliminada.");
    refrescar();
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ochre">Reservas</p>
          <h1 className="mt-3 font-display text-3xl font-light text-white md:text-4xl">
            Gestión de reservas
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Confirma o libera solicitudes y bloquea franjas cuando lo necesites.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDialogo("bloqueo")}
            className="flex items-center gap-2 border border-white/15 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white hover:text-white"
          >
            <Ban className="h-3.5 w-3.5" />
            Bloquear franja
          </button>
          <button
            type="button"
            onClick={() => setDialogo("reserva")}
            className="flex items-center gap-2 bg-ochre px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva reserva
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Pendientes", valor: contadores.pendientes, color: "text-amber-300" },
          { label: "Confirmadas", valor: contadores.confirmadas, color: "text-red-300" },
          { label: "Liberadas", valor: contadores.liberadas, color: "text-white/50" },
        ].map((c) => (
          <div key={c.label} className="border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{c.label}</p>
            <p className={`mt-2 font-display text-3xl font-light ${c.color}`}>{c.valor}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-3">
        <select
          value={filtros.estado}
          onChange={(e) => setFiltros((f) => ({ ...f, estado: e.target.value }))}
          className={inputDark}
        >
          <option value="">Todos los estados</option>
          <option value="prerreservada">Pendientes</option>
          <option value="reservada">Confirmadas</option>
          <option value="cancelada">Liberadas</option>
        </select>
        <input
          type="date"
          value={filtros.fecha}
          onChange={(e) => setFiltros((f) => ({ ...f, fecha: e.target.value }))}
          className={inputDark}
          style={{ colorScheme: "dark" }}
        />
        <select
          value={filtros.espacio}
          onChange={(e) => setFiltros((f) => ({ ...f, espacio: e.target.value }))}
          className={inputDark}
        >
          <option value="">Todos los espacios</option>
          {espacios.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-2">
        {cargando && (
          <div className="flex items-center gap-2 py-10 text-sm text-white/40">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando reservas…
          </div>
        )}
        {!cargando && !reservas.length && (
          <p className="border border-dashed border-white/10 py-12 text-center text-sm text-white/40">
            No hay reservas con estos filtros.
          </p>
        )}
        {!cargando &&
          reservas.map((reserva) => (
            <ReservaItem
              key={reserva.id}
              reserva={reserva}
              onConfirmar={confirmar}
              onLiberar={liberar}
              onEliminar={eliminar}
            />
          ))}
      </div>

      <ReservaDialog
        open={Boolean(dialogo)}
        onOpenChange={(v) => !v && setDialogo(null)}
        espacios={espacios}
        franjas={listaFranjas}
        modo={dialogo || "reserva"}
        onGuardada={refrescar}
      />
    </div>
  );
}