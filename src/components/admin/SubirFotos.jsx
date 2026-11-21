import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/sheetsClient";
import { Image } from "@/components/ui/image";

export default function SubirFotos({ fotos = [], onChange, max = 6, etiqueta = "Subir fotos" }) {
  const [subiendo, setSubiendo] = useState(false);
  const inputRef = useRef(null);

  const subir = async (event) => {
    const archivos = Array.from(event.target.files || []);
    if (!archivos.length) return;
    setSubiendo(true);
    try {
      const nuevas = [];
      for (const file of archivos.slice(0, max - fotos.length)) {
        const res = await base44.integrations.Core.UploadPublicFile({ file });
        if (res?.file_url) nuevas.push(res.file_url);
      }
      if (nuevas.length) {
        onChange([...fotos, ...nuevas]);
        toast.success("Fotos añadidas.");
      }
    } catch (error) {
      toast.error("No se pudieron subir las fotos.");
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {fotos.map((foto) => (
          <div key={foto} className="group relative aspect-[4/3] overflow-hidden border border-white/10">
            <Image src={foto} alt="" fittingType="fill" className="h-full w-full" />
            <button
              type="button"
              onClick={() => onChange(fotos.filter((f) => f !== foto))}
              aria-label="Quitar foto"
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center bg-ink/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {fotos.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
            className="grid aspect-[4/3] place-items-center border border-dashed border-white/20 text-white/40 transition-colors hover:border-ochre hover:text-ochre disabled:opacity-60"
          >
            {subiendo ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.12em]">
                <ImagePlus className="h-4 w-4" />
                {etiqueta}
              </span>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={max > 1}
        onChange={subir}
        className="hidden"
      />
    </div>
  );
}