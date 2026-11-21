import { useEffect, useState } from "react";
import { base44 } from "@/api/sheetsClient";

const DEFECTO = [
  {
    imagen_url: "https://media.base44.com/images/public/6b01459b6d6601974de93ddc/905e84a95_generated_5f7023cc.png",
    kicker: "Coworking en Vitoria-Gasteiz",
    titulo: "Un lugar para trabajar mejor.",
    subtitulo:
      "Espacios flexibles, luz natural y una comunidad que empuja. En el centro de Vitoria, a un paso de todo.",
  },
  {
    imagen_url: "https://media.base44.com/images/public/6b01459b6d6601974de93ddc/e59c9a277_generated_e4ece081.png",
    kicker: "Salas por horas",
    titulo: "Salas que se adaptan a tu equipo.",
    subtitulo:
      "Reuniones, entrevistas o formaciones. Reserva la sala que necesitas por horas y llega con todo listo.",
  },
  {
    imagen_url: "https://media.base44.com/images/public/6b01459b6d6601974de93ddc/dc0a49d49_generated_8f8beafb.png",
    kicker: "Despachos privados",
    titulo: "Tu despacho, sin ataduras.",
    subtitulo:
      "Oficinas cerradas para equipos pequeños, con contrato flexible y servicios incluidos desde el primer día.",
  },
];

export default function useCarrusel() {
  const [slides, setSlides] = useState(DEFECTO);

  useEffect(() => {
    let activo = true;
    base44.entities.Carrusel.filter({ activo: true }, { sort: "orden", limit: 20 })
      .then((page) => {
        const items = (page?.items ?? []).filter((s) => s.imagen_url);
        if (activo && items.length) setSlides(items);
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, []);

  return slides;
}