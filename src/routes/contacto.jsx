import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import usePublicConfig from "@/hooks/usePublicConfig";

export const Route = createFileRoute("/contacto")({
  component: ContactoPage,
  head: () => ({
    meta: [
      { title: "Contacto · Núcleo Vitoria" },
      {
        name: "description",
        content:
          "Escríbenos o visítanos: coworking en el centro de Vitoria-Gasteiz. Dirección, teléfono y correo de contacto.",
      },
    ],
  }),
});

function ContactoPage() {
  const config = usePublicConfig();

  return (
    <div className="min-h-screen bg-silver">
      <SiteHeader nombre={config.nombre_negocio} />
      <main className="pt-[72px] md:pt-20">
        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
            <p className="eyebrow">Contacto</p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-[1.05] text-ink sm:text-5xl">
              Hablemos de tu espacio de trabajo.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              ¿Quieres ver el espacio antes de reservar o necesitas algo a medida para tu equipo?
              Escríbenos y te respondemos en menos de un día laborable.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ul className="divide-y divide-border border-y border-border">
                <li className="flex gap-4 py-6">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-ochre" />
                  <div>
                    <p className="eyebrow">Dónde estamos</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{config.direccion}</p>
                  </div>
                </li>
                <li className="flex gap-4 py-6">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-ochre" />
                  <div>
                    <p className="eyebrow">Teléfono</p>
                    <a
                      href={`tel:${config.telefono.replace(/\s/g, "")}`}
                      className="mt-2 block text-sm text-ink hover:text-ochre"
                    >
                      {config.telefono}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 py-6">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-ochre" />
                  <div>
                    <p className="eyebrow">Email</p>
                    <a
                      href={`mailto:${config.email_contacto}`}
                      className="mt-2 block text-sm text-ink hover:text-ochre"
                    >
                      {config.email_contacto}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 py-6">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-ochre" />
                  <div>
                    <p className="eyebrow">Horario</p>
                    <p className="mt-2 font-mono text-sm text-ink">
                      Lunes a viernes · {config.hora_apertura} – {config.hora_cierre} h
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="border border-border bg-white p-8 md:p-12">
                <p className="eyebrow">Reservas</p>
                <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink">
                  Consulta la disponibilidad en el plano.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Elige día y hora, revisa qué espacios están libres y envía tu solicitud en dos
                  minutos. El equipo confirma cada reserva manualmente.
                </p>
                <Link
                  to="/espacios"
                  className="group mt-7 inline-flex items-center gap-3 bg-ink px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ochre"
                >
                  Ver espacios
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <div className="mt-10 border-t border-border pt-6">
                  <p className="eyebrow">Cómo llegar</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Estamos en pleno centro de Vitoria-Gasteiz, a cinco minutos andando de la
                    plaza de la Virgen Blanca y con paradas de tranvía y autobús a menos de 200
                    metros. Aparcamiento público en la misma calle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter config={config} />
    </div>
  );
}