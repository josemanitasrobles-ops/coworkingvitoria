import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import usePublicConfig from "@/hooks/usePublicConfig";

export const Route = createFileRoute("/privacidad")({
  component: PrivacidadPage,
  head: () => ({
    meta: [
      { title: "Política de privacidad · Núcleo Vitoria" },
      {
        name: "description",
        content: "Cómo tratamos los datos personales que nos facilitas al solicitar una reserva.",
      },
    ],
  }),
});

const BLOQUES = [
  {
    titulo: "Responsable del tratamiento",
    texto:
      "Los datos que nos facilitas a través del formulario de reserva son tratados por el equipo del coworking, con domicilio en la dirección indicada en esta web.",
  },
  {
    titulo: "Qué datos recogemos",
    texto:
      "Nombre y apellidos, teléfono y correo electrónico, junto con el espacio, la fecha y la franja horaria solicitada.",
  },
  {
    titulo: "Para qué los usamos",
    texto:
      "Únicamente para gestionar tu solicitud de reserva: comprobar disponibilidad, confirmarte la reserva y contactarte si necesitamos aclarar algún detalle.",
  },
  {
    titulo: "Base jurídica",
    texto:
      "El consentimiento que otorgas al aceptar esta política y el interés legítimo en gestionar la relación con las personas que reservan nuestros espacios.",
  },
  {
    titulo: "Conservación",
    texto:
      "Conservamos los datos durante el tiempo necesario para gestionar la reserva y, después, durante los plazos legales aplicables.",
  },
  {
    titulo: "Tus derechos",
    texto:
      "Puedes solicitar el acceso, la rectificación, la supresión, la limitación o la portabilidad de tus datos, así como oponerte a su tratamiento, escribiendo al correo de contacto de esta web.",
  },
];

function PrivacidadPage() {
  const config = usePublicConfig();

  return (
    <div className="min-h-screen bg-silver">
      <SiteHeader nombre={config.nombre_negocio} />
      <main className="pt-[72px] md:pt-20">
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-10 md:py-20">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-tight text-ink sm:text-5xl">
            Política de privacidad
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Esta política explica cómo tratamos los datos personales que nos facilitas al solicitar
            una reserva o al contactar con nosotros.
          </p>

          <div className="mt-10 space-y-8 border-t border-border pt-10">
            {BLOQUES.map((b) => (
              <section key={b.titulo}>
                <h2 className="text-lg font-medium text-ink">{b.titulo}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.texto}</p>
              </section>
            ))}
          </div>

          <div className="mt-12 border border-border bg-white p-6">
            <p className="text-sm text-ink">
              Para cualquier consulta sobre privacidad puedes escribirnos a{" "}
              <a href={`mailto:${config.email_contacto}`} className="text-ochre underline">
                {config.email_contacto}
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <SiteFooter config={config} />
    </div>
  );
}