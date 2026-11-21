import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Inicio", to: "/" },
  { label: "Espacios y reservas", to: "/espacios" },
  { label: "Contacto", to: "/contacto" },
];

function Wordmark({ light, nombre }) {
  return (
    <span className="flex items-center gap-3">
      <span
        className={cn(
          "grid h-9 w-9 place-items-center font-display text-lg leading-none transition-colors",
          light ? "bg-white text-ink" : "bg-ink text-white"
        )}
      >
        {nombre.charAt(0)}
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block text-[13px] font-medium uppercase tracking-[0.3em] transition-colors",
            light ? "text-white" : "text-ink"
          )}
        >
          {nombre.split(" ")[0]}
        </span>
        <span
          className={cn(
            "mt-1 block font-mono text-[9px] uppercase tracking-[0.3em]",
            light ? "text-white/60" : "text-muted-foreground"
          )}
        >
          Vitoria-Gasteiz
        </span>
      </span>
    </span>
  );
}

export default function SiteHeader({ overlay = false, nombre = "Núcleo Vitoria" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const light = overlay && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        light
          ? "bg-transparent"
          : "border-b border-border/70 bg-white/90 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
        <Link to="/" onClick={() => setOpen(false)} aria-label={nombre}>
          <Wordmark light={light} nombre={nombre} />
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Navegación principal">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative text-[13px] font-medium tracking-wide transition-colors",
                light ? "text-white/80 hover:text-white" : "text-foreground/70 hover:text-foreground"
              )}
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-ochre transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/espacios"
            className="hidden bg-ochre px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ochre/90 sm:block"
          >
            Reservar
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className={cn(
              "grid h-11 w-11 place-items-center transition-colors md:hidden",
              light ? "text-white" : "text-ink"
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-4" aria-label="Navegación móvil">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-4 text-sm font-medium text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/espacios"
              onClick={() => setOpen(false)}
              className="mt-5 bg-ochre px-6 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
            >
              Reservar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}