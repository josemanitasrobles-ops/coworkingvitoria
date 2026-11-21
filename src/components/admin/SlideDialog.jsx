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

const NUEVO = {
  imagen_url: "",
  kicker: "",
  titulo: "",
  subtitulo: "",
  orden: 0,
  activo: true,
};

export default function SlideDialog({ open, onOpenChange, slide, onGuardado }) {
  const [form, setForm] = useState(NUEVO);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(slide ? { ...NUEVO, ...slide } : NUEVO);
  }, [open, slide]);

  const set = (parcial) => setForm((f) => ({ ...f, ...parcial }));

  const guardar = async () => {
    if (!form.imagen_url) {
      toast.error("Añade una imagen para la diapositiva.");
      return;
    }
    const payload = {
      imagen_url: form.imagen_url,
      kicker: form.kicker,
      titulo: form.titulo,
      subtitulo: form.subtitulo,
      orden: Number(form.orden) || 0,
      activo: form.activo !== false,
    };
    setGuardando(true);
    try {
      if (slide) {
        await base44.entities.Carrusel.update(slide.id, payload);
        toast.success("Diapositiva actualizada.");
      } else {
        await base44.entities.Carrusel.create(payload);
        toast.success("Diapositiva añadida.");
      }
      onGuardado();
      onOpenChange(false);
    } catch (error) {
      toast.error("No se pudo guardar la diapositiva.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0F172A] text-white sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl font-light">
            {slide ? "Editar diapositiva" : "Nueva diapositiva"}
          </DialogTitle>
          <DialogDescription className="text-white/40">
            Imagen a pantalla completa y texto que aparece sobre ella en la portada.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <CampoAdmin label="Imagen">
            <SubirFotos
              fotos={form.imagen_url ? [form.imagen_url] : []}
              onChange={(fotos) => set({ imagen_url: fotos[fotos.length - 1] || "" })}
              max={1}
              etiqueta="Subir imagen"
            />
          </CampoAdmin>

          <CampoAdmin label="Texto superior">
            <input
              value={form.kicker}
              onChange={(e) => set({ kicker: e.target.value })}
              className={inputDark}
              placeholder="Coworking en Vitoria-Gasteiz"
            />
          </CampoAdmin>

          <CampoAdmin label="Título">
            <input
              value={form.titulo}
              onChange={(e) => set({ titulo: e.target.value })}
              className={inputDark}
              placeholder="Un lugar para trabajar mejor."
            />
          </CampoAdmin>

          <CampoAdmin label="Subtítulo">
            <textarea
              rows={3}
              value={form.subtitulo}
              onChange={(e) => set({ subtitulo: e.target.value })}
              className={areaDark}
            />
          </CampoAdmin>

          <div className="grid grid-cols-2 gap-3">
            <CampoAdmin label="Orden">
              <input
                type="number"
                value={form.orden}
                onChange={(e) => set({ orden: e.target.value })}
                className={inputDark}
              />
            </CampoAdmin>
            <label className="flex items-end gap-3 pb-2">
              <input
                type="checkbox"
                checked={form.activo !== false}
                onChange={(e) => set({ activo: e.target.checked })}
                className="h-4 w-4 accent-ochre"
              />
              <span className="text-sm text-white/70">Visible</span>
            </label>
          </div>
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