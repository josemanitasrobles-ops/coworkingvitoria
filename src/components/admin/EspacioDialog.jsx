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
import SubirFotos from "@/components/admin/SubirFotos";

const TIPOS = ["Puesto", "Despacho", "Sala de reuniones", "Sala de formación"];

const NUEVO = {
  nombre: "",
  tipo: "Puesto",
  descripcion: "",
  capacidad: 1,
  precio_hora: 10,
  servicios: "",
  fotos: [],
  plano_x: 10,
  plano_y: 10,
  plano_ancho: 22,
  plano_alto: 24,
  orden: 0,
  activo: true,
};

export default function EspacioDialog({ open, onOpenChange, espacio, onGuardado }) {
  const [form, setForm] = useState(NUEVO);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (espacio) {
      setForm({
        ...NUEVO,
        ...espacio,
        servicios: (espacio.servicios || []).join(", "),
        fotos: espacio.fotos || [],
      });
    } else {
      setForm(NUEVO);
    }
  }, [open, espacio]);

  const set = (parcial) => setForm((f) => ({ ...f, ...parcial }));

  const guardar = async () => {
    if (!form.nombre.trim()) {
      toast.error("El espacio necesita un nombre.");
      return;
    }
    const payload = {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      descripcion: form.descripcion,
      capacidad: Number(form.capacidad) || 1,
      precio_hora: Number(form.precio_hora) || 0,
      servicios: String(form.servicios)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      fotos: form.fotos,
      plano_x: Number(form.plano_x) || 0,
      plano_y: Number(form.plano_y) || 0,
      plano_ancho: Number(form.plano_ancho) || 20,
      plano_alto: Number(form.plano_alto) || 20,
      orden: Number(form.orden) || 0,
      activo: form.activo !== false,
    };
    setGuardando(true);
    try {
      if (espacio) {
        await base44.entities.Espacio.update(espacio.id, payload);
        toast.success("Espacio actualizado.");
      } else {
        await base44.entities.Espacio.create(payload);
        toast.success("Espacio creado.");
      }
      onGuardado();
      onOpenChange(false);
    } catch (error) {
      toast.error("No se pudo guardar el espacio.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0F172A] text-white sm:max-w-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl font-light">
            {espacio ? "Editar espacio" : "Nuevo espacio"}
          </DialogTitle>
          <DialogDescription className="text-white/40">
            Define los datos, las fotos y la posición del espacio en el plano.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <CampoAdmin label="Nombre" className="sm:col-span-2">
            <input
              value={form.nombre}
              onChange={(e) => set({ nombre: e.target.value })}
              className={inputDark}
              placeholder="Sala Araba"
            />
          </CampoAdmin>

          <CampoAdmin label="Tipo">
            <select value={form.tipo} onChange={(e) => set({ tipo: e.target.value })} className={inputDark}>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </CampoAdmin>

          <CampoAdmin label="Capacidad (personas)">
            <input
              type="number"
              min="1"
              value={form.capacidad}
              onChange={(e) => set({ capacidad: e.target.value })}
              className={inputDark}
            />
          </CampoAdmin>

          <CampoAdmin label="Precio por hora (€)">
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.precio_hora}
              onChange={(e) => set({ precio_hora: e.target.value })}
              className={inputDark}
            />
          </CampoAdmin>

          <CampoAdmin label="Orden en el listado">
            <input
              type="number"
              value={form.orden}
              onChange={(e) => set({ orden: e.target.value })}
              className={inputDark}
            />
          </CampoAdmin>

          <CampoAdmin label="Descripción" className="sm:col-span-2">
            <textarea
              rows={3}
              value={form.descripcion}
              onChange={(e) => set({ descripcion: e.target.value })}
              className={areaDark}
              placeholder="Luz natural, mesa para seis personas, pantalla de 55”…"
            />
          </CampoAdmin>

          <CampoAdmin
            label="Servicios incluidos"
            hint="Sepáralos con comas: pantalla, pizarra, videollamada…"
            className="sm:col-span-2"
          >
            <textarea
              rows={2}
              value={form.servicios}
              onChange={(e) => set({ servicios: e.target.value })}
              className={areaDark}
            />
          </CampoAdmin>

          <CampoAdmin label="Fotos" className="sm:col-span-2">
            <SubirFotos fotos={form.fotos} onChange={(fotos) => set({ fotos })} />
          </CampoAdmin>

          <div className="sm:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Posición en el plano (%)
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <CampoAdmin label="X">
                <input
                  type="number"
                  min="0"
                  max="95"
                  value={form.plano_x}
                  onChange={(e) => set({ plano_x: e.target.value })}
                  className={inputDark}
                />
              </CampoAdmin>
              <CampoAdmin label="Y">
                <input
                  type="number"
                  min="0"
                  max="95"
                  value={form.plano_y}
                  onChange={(e) => set({ plano_y: e.target.value })}
                  className={inputDark}
                />
              </CampoAdmin>
              <CampoAdmin label="Ancho">
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={form.plano_ancho}
                  onChange={(e) => set({ plano_ancho: e.target.value })}
                  className={inputDark}
                />
              </CampoAdmin>
              <CampoAdmin label="Alto">
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={form.plano_alto}
                  onChange={(e) => set({ plano_alto: e.target.value })}
                  className={inputDark}
                />
              </CampoAdmin>
            </div>
          </div>

          <label className="flex items-center gap-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.activo !== false}
              onChange={(e) => set({ activo: e.target.checked })}
              className="h-4 w-4 accent-ochre"
            />
            <span className="text-sm text-white/70">Visible en la web</span>
          </label>
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
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}