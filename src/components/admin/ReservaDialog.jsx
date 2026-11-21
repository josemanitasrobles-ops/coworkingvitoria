import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/sheetsClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CampoAdmin, { inputDark, areaDark } from "@/components/admin/CampoAdmin";
import { hoyISO, sumarHoras } from "@/lib/horario";

const INICIAL = {
  espacio_id: "",
  fecha: "",
  inicio: "09:00",
  duracion: 1,
  nombre: "",
  telefono: "",
  email: "",
  estado: "reservada",
  notas: "",
};

export default function ReservaDialog({ open, onOpenChange, espacios, franjas, modo, onGuardada }) {
  const [form, setForm] = useState(INICIAL);
  const [guardando, setGuardando] = useState(false);
  const esBloqueo = modo === "bloqueo";

  useEffect(() => {
    if (open) setForm({ ...INICIAL, fecha: hoyISO(), inicio: franjas?.[0] || "09:00" });
  }, [open, franjas]);

  const set = (parcial) => setForm((f) => ({ ...f, ...parcial }));

  const guardar = async () => {
    if (!form.espacio_id || !form.fecha || !form.inicio) {
      toast.error("Completa el espacio, el día y la hora de inicio.");
      return;
    }
    if (!esBloqueo && (!form.nombre || !form.email)) {
      toast.error("Añade al menos el nombre y el email del cliente.");
      return;
    }
    const espacio = espacios.find((e) => e.id === form.espacio_id);
    const fin = sumarHoras(form.inicio, Number(form.duracion));
    setGuardando(true);
    try {
      await base44.entities.Reserva.create({
        espacio_id: form.espacio_id,
        espacio_nombre: espacio?.nombre || "",
        fecha: form.fecha,
        hora_inicio: form.inicio,
        hora_fin: fin,
        nombre: esBloqueo ? "Bloqueo interno" : form.nombre,
        telefono: esBloqueo ? "" : form.telefono,
        email: esBloqueo ? "" : form.email,
        estado: esBloqueo ? "reservada" : form.estado,
        origen: esBloqueo ? "bloqueo" : "manual",
        precio_total: esBloqueo ? 0 : (Number(espacio?.precio_hora) || 0) * Number(form.duracion),
        notas: form.notas,
      });
      toast.success(esBloqueo ? "Franja bloqueada." : "Reserva creada.");
      onGuardada();
      onOpenChange(false);
    } catch (error) {
      toast.error("No se pudo guardar. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0F172A] text-white sm:max-w-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl font-light">
            {esBloqueo ? "Bloquear franja" : "Nueva reserva"}
          </DialogTitle>
          <DialogDescription className="text-white/40">
            {esBloqueo
              ? "La franja quedará ocupada en el plano y no podrá solicitarse."
              : "Crea una reserva manual para un cliente que haya contactado por otra vía."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <CampoAdmin label="Espacio" className="sm:col-span-2">
            <select
              value={form.espacio_id}
              onChange={(e) => set({ espacio_id: e.target.value })}
              className={inputDark}
            >
              <option value="">Selecciona un espacio</option>
              {espacios.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </CampoAdmin>

          <CampoAdmin label="Día">
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => set({ fecha: e.target.value })}
              className={inputDark}
              style={{ colorScheme: "dark" }}
            />
          </CampoAdmin>

          <CampoAdmin label="Hora de inicio">
            <select
              value={form.inicio}
              onChange={(e) => set({ inicio: e.target.value })}
              className={inputDark}
            >
              {franjas.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </CampoAdmin>

          <CampoAdmin label="Duración">
            <select
              value={form.duracion}
              onChange={(e) => set({ duracion: Number(e.target.value) })}
              className={inputDark}
            >
              {[1, 2, 3, 4, 5, 6, 8].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "hora" : "horas"}
                </option>
              ))}
            </select>
          </CampoAdmin>

          {!esBloqueo && (
            <CampoAdmin label="Estado">
              <select
                value={form.estado}
                onChange={(e) => set({ estado: e.target.value })}
                className={inputDark}
              >
                <option value="reservada">Confirmada</option>
                <option value="prerreservada">Pendiente</option>
              </select>
            </CampoAdmin>
          )}

          {!esBloqueo && (
            <>
              <CampoAdmin label="Nombre" className="sm:col-span-2">
                <input
                  value={form.nombre}
                  onChange={(e) => set({ nombre: e.target.value })}
                  className={inputDark}
                  placeholder="Nombre y apellidos"
                />
              </CampoAdmin>
              <CampoAdmin label="Teléfono">
                <input
                  value={form.telefono}
                  onChange={(e) => set({ telefono: e.target.value })}
                  className={inputDark}
                  placeholder="600 000 000"
                />
              </CampoAdmin>
              <CampoAdmin label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set({ email: e.target.value })}
                  className={inputDark}
                  placeholder="cliente@email.com"
                />
              </CampoAdmin>
            </>
          )}

          <CampoAdmin label="Notas" className="sm:col-span-2">
            <textarea
              value={form.notas}
              onChange={(e) => set({ notas: e.target.value })}
              rows={2}
              className={areaDark}
              placeholder="Mantenimiento, evento interno, petición especial…"
            />
          </CampoAdmin>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="border border-white/15 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:border-white hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
            className="flex items-center gap-2 bg-ochre px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-ink disabled:opacity-60"
          >
            {guardando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {esBloqueo ? "Bloquear" : "Crear reserva"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}