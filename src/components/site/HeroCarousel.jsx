import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function HeroCarousel({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  useEffect(() => {
    if (total < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % total), 7000);
    return () => clearTimeout(timer);
  }, [index, total]);

  if (!total) return null;
  const slide = slides[index];

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.imagen_url}
            alt={slide.titulo || "Espacio de coworking"}
            fittingType="fill"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/50" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-24 md:px-10 md:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/70">
              {slide.kicker || "Coworking en Vitoria-Gasteiz"}
            </p>
            <h1 className="mt-5 font-display text-[2.6rem] font-light leading-[1.03] text-white sm:text-6xl lg:text-7xl">
              {slide.titulo}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {slide.subtitulo}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/espacios"
                className="group inline-flex items-center gap-3 bg-white px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ochre hover:text-white"
              >
                Ver espacios disponibles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center border border-white/30 px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Visítanos
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-center justify-between px-5 md:bottom-8 md:px-10">
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-[2px] transition-all duration-500",
                i === index ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
          <span className="ml-3 font-mono text-[10px] tracking-[0.2em] text-white/60">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
            aria-label="Diapositiva anterior"
            className="grid h-11 w-11 place-items-center border border-white/25 text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % total)}
            aria-label="Diapositiva siguiente"
            className="grid h-11 w-11 place-items-center border border-white/25 text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}