import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import HeroCarousel from "@/components/site/HeroCarousel";
import ServicesSection from "@/components/site/ServicesSection";
import usePublicConfig from "@/hooks/usePublicConfig";
import useCarrusel from "@/hooks/useCarrusel";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Núcleo Vitoria · Coworking en el centro de Vitoria-Gasteiz" },
      {
        name: "description",
        content:
          "Puestos flexibles, despachos privados y salas de reuniones por horas en Vitoria-Gasteiz. Consulta la disponibilidad en el plano y reserva online.",
      },
    ],
  }),
});

function HomePage() {
  const config = usePublicConfig();
  const slides = useCarrusel();

  return (
    <div className="min-h-screen bg-silver">
      <SiteHeader overlay nombre={config.nombre_negocio} />
      <main>
        <HeroCarousel slides={slides} />
        <ServicesSection />

        <section className="bg-ink">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12 md:items-center md:px-10 md:py-24">
            <div className="md:col-span-8">
              <p className="eyebrow text-white/40">Disponibilidad en tiempo real</p>
              <h2 className="mt-5 font-display text-3xl font-light leading-tight text-white sm:text-4xl md:text-5xl">
                Mira el plano, elige tu franja y reserva.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
                Verde libre, rojo ocupado y amarillo pendiente de confirmación. Todo lo que ves sale
                de las reservas reales del espacio.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                to="/espacios"
                className="group inline-flex items-center gap-3 bg-ochre px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-ink"
              >
                Reservar ahora
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter config={config} />
    </div>
  );
}