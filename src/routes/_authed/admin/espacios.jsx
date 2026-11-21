import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/sheetsClient";
import { Image } from "@/components/ui/image";
import EspacioDialog from "@/components/admin/EspacioDialog";
import { precio } from "@/lib/horario";

export const Route = createFileRoute("/_authed/admin/espacios")({
  component: AdminEspacios,
});

function AdminEspacios() {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogo, setDialogo] = useState(false);
  const [editando, setEditando] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const page = await base44.entities.Espacio.list({ sort: "orden", limit: 100 });
      setEspacios(page?.items ?? []);
    } catch (error) {
      toast.error("No se pudieron cargar los espacios.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const eliminar = async (espacio) => {
    await base44.entities.Espacio.delete(espacio.id);
    toast.success("Espacio eliminado.");
    cargar();
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ochre">Espacios</p>
          <h1 className="mt-3 font-display text-3xl font-light text-white md:text-4xl">
            Espacios del coworking
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Nombre, precio, fotos y posición en el plano de cada espacio.
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
          Nuevo espacio
        </button>
      </div>

      {cargando && (
        <div className="mt-8 flex items-center gap-2 text-sm text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando espacios…
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {espacios.map((espacio) => (
          <div key={espacio.id} className="border border-white/10 bg-white/[0.03]">
            <div className="aspect-[4/3] w-full bg-white/5">
              {espacio.fotos?.[0] ? (
                <Image
                  src={espacio.fotos[0]}
                  alt={espacio.nombre}
                  fittingType="fill"
                  className="h-full w-full"
                />
              ) : (
                <div className="grid h-full w-full place-items-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Sin foto
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                    {espacio.tipo || "Espacio"}
                  </p>
                  <h2 className="mt-1 text-base font-medium text-white">{espacio.nombre}</h2>
                </div>
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    espacio.activo === false ? "bg-white/20" : "bg-libre"
                  }`}
                  title={espacio.activo === false ? "Oculto" : "Visible"}
                />
              </div>
              <p className="mt-2 text-[11px] text-white/40">
                {espacio.capacidad || 1} personas · {precio(espacio.precio_hora)}/h
              </p>
              <p className="mt-1 font-mono text-[10px] text-white/30">
                Plano: {espacio.plano_x}% / {espacio.plano_y}% · {espacio.plano_ancho}% ×{" "}
                {espacio.plano_alto}%
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditando(espacio);
                    setDialogo(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 border border-white/15 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-white hover:text-white"
                >
                  <Pencil className="h-3 w-3" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => eliminar(espacio)}
                  aria-label="Eliminar espacio"
                  className="grid h-8 w-9 place-items-center border border-white/10 text-white/40 transition-colors hover:border-ocupado/50 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!cargando && !espacios.length && (
          <p className="border border-dashed border-white/10 p-10 text-center text-sm text-white/40 md:col-span-2 xl:col-span-3">
            Todavía no hay espacios. Crea el primero para que aparezca en el plano.
          </p>
        )}
      </div>

      <EspacioDialog
        open={dialogo}
        onOpenChange={setDialogo}
        espacio={editando}
        onGuardado={cargar}
      />
    </div>
  );
}