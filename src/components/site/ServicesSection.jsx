import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const VENTAJAS = [
  {
    n: "01",
    titulo: "Puestos flexibles",
    texto: "Elige mesa cada día en la sala común. Sin permanencia, sin letra pequeña.",
  },
  {
    n: "02",
    titulo: "Despachos privados",
    texto: "Oficinas cerradas para equipos de 2 a 6 personas, con llave y almacenaje propio.",
  },
  {
    n: "03",
    titulo: "Salas de reuniones",
    texto: "Reserva por horas con pantalla, pizarra y videollamada lista para empezar.",
  },
  {
    n: "04",
    titulo: "Fibra simétrica",
    texto: "1 Gb de subida y bajada, red wifi en todo el edificio y salas insonorizadas.",
  },
  {
    n: "05",
    titulo: "Café de origen",
    texto: "Café de tostador local, té e infusiones incluidas durante toda tu jornada.",
  },
  {
    n: "06",
    titulo: "Comunidad local",
    texto: "Encuentros mensuales con profesionales de Álava. Menos ruido, más ideas.",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-silver">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-32">
        <div className="grid gap-8 border-b border-border pb-14 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">El espacio</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.08] text-ink sm:text-5xl">
              Todo lo que necesitas,
              <br />
              nada que sobre.
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base leading-relaxed text-muted-foreground">
              320 m² reformados junto al centro de Vitoria-Gasteiz. Luz natural, materiales
              nobles y la infraestructura resuelta para que solo tengas que pensar en tu
              trabajo.
            </p>
            <Link
              to="/espacios"
              className="group mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:border-ochre hover:text-ochre"
            >
              Ver espacios disponibles
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {VENTAJAS.map((v) => (
            <div
              key={v.n}
              className="group border-b border-border py-8 sm:px-8 sm:odd:pl-0 lg:border-r lg:last:border-r-0 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:pr-0"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-ochre">{v.n}</span>
              <h3 className="mt-4 text-lg font-medium text-ink">{v.titulo}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {v.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}