import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail } from "lucide-react";

export default function SiteFooter({ config = {} }) {
  const nombre = config.nombre_negocio || "Núcleo Vitoria";
  const direccion = config.direccion || "Calle Dato 12, 2ª planta · 01005 Vitoria-Gasteiz";
  const telefono = config.telefono || "+34 945 000 000";
  const email = config.email_contacto || "hola@nucleovitoria.com";

  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-light leading-tight md:text-4xl">
              {nombre}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Espacio de trabajo flexible en el centro de Vitoria-Gasteiz. Puestos, despachos
              y salas por horas para equipos que crecen a su ritmo.
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow text-white/40">Contacto</p>
            <ul className="mt-5 space-y-4 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
                <span>{direccion}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
                <a href={`tel:${telefono.replace(/\s/g, "")}`} className="hover:text-white">
                  {telefono}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-white/40">Navegación</p>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <li>
                <Link to="/" className="hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/espacios" className="hover:text-white">
                  Espacios y reservas
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-white">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/50 hover:text-white">
                  Acceso equipo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {nombre}. Todos los derechos reservados.
          </p>
          <p className="font-mono uppercase tracking-[0.2em]">Vitoria-Gasteiz · Álava</p>
        </div>
      </div>
    </footer>
  );
}