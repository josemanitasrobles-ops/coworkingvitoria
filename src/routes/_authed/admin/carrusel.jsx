import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/sheetsClient";
import { Image } from "@/components/ui/image";
import SlideDialog from "@/components/admin/SlideDialog";

export const Route = createFileRoute("/_authed/admin/carrusel")({
  component: AdminCarrusel,
});

function AdminCarrusel() {
  const [slides, setSlides] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogo, setDialogo] = useState(false);
  const [editando, setEditando] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const page = await base44.entities.Carrusel.list({ sort: "orden", limit: 30 });
      setSlides(page?.items ?? []);
    } catch (error) {
      toast.error("No se pudieron cargar las diapositivas.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const eliminar = async (slide) => {
    await base44.entities.Carrusel.delete(slide.id);
    toast.success("Diapositiva eliminada.");
    cargar();
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ochre">Portada</p>
          <h1 className="mt-3 font-display text-3xl font-light text-white md:text-4xl">
            Carrusel de la home
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Las diapositivas se muestran a pantalla completa, en el orden indicado.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditando(null);
            setDialogo(true);
          }}
          className="flex items-center gap-2 bg-ochre px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-ink"
        >
          <Plus className="h-3.5 w-3.5" />
          Añadir diapositiva
        </button>
      </div>

      {cargando && (
        <div className="mt-8 flex items-center gap-2 text-sm text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando…
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {slides.map((slide) => (
          <div key={slide.id} className="border border-white/10 bg-white/[0.03]">
            <div className="aspect-[16/9] w-full bg-white/5">
              {slide.imagen_url ? (
                <Image
                  src={slide.imagen_url}
                  alt={slide.titulo || "Diapositiva"}
                  fittingType="fill"
                  className="h-full w-full"
                />
              ) : (
                <div className="grid h-full w-full place-items-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                Orden {slide.orden ?? 0} {slide.activo === false && "· oculta"}
              </p>
              <h2 className="mt-1 text-sm font-medium text-white">{slide.titulo || "Sin título"}</h2>
              <p className="mt-1 line-clamp-2 text-[11px] text-white/40">{slide.subtitulo}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditando(slide);
                    setDialogo(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 border border-white/15 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-white hover:text-white"
                >
                  <Pencil className="h-3 w-3" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => eliminar(slide)}
                  aria-label="Eliminar diapositiva"
                  className="grid h-8 w-9 place-items-center border border-white/10 text-white/40 transition-colors hover:border-ocupado/50 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!cargando && !slides.length && (
          <p className="border border-dashed border-white/10 p-10 text-center text-sm text-white/40 md:col-span-2 xl:col-span-3">
            No hay diapositivas propias: la portada usa las imágenes por defecto.
          </p>
        )}
      </div>

      <SlideDialog
        open={dialogo}
        onOpenChange={setDialogo}
        slide={editando}
        onGuardado={cargar}
      />
    </div>
  );
}