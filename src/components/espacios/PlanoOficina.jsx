const ZONAS_PLANO = [
  {
    id: "sala-juntas",
    nombre: "Sala de Juntas",
    left: "72%",
    top: "2%",
    width: "27%",
    height: "45%",
  },
  {
    id: "sala-reunion-1",
    nombre: "Sala Reunión A",
    left: "72%",
    top: "48%",
    width: "27%",
    height: "25%",
  },
  {
    id: "sala-reunion-2",
    nombre: "Sala Reunión B",
    left: "72%",
    top: "74%",
    width: "27%",
    height: "24%",
  },
  {
    id: "despacho-1",
    nombre: "Despacho Privado 1",
    left: "1%",
    top: "57%",
    width: "33%",
    height: "20%",
  },
  {
    id: "despacho-2",
    nombre: "Despacho Privado 2",
    left: "1%",
    top: "78%",
    width: "33%",
    height: "20%",
  },
  {
    id: "coworking-general",
    nombre: "Zona Coworking",
    left: "36%",
    top: "26%",
    width: "34%",
    height: "65%",
  },
];

const ESTILOS_ESTADO = {
  libre: {
    bg: "rgba(34, 197, 94, 0.22)",
    border: "rgba(22, 163, 74, 0.85)",
    etiqueta: "Libre",
  },
  prerreservada: {
    bg: "rgba(234, 179, 8, 0.28)",
    border: "rgba(202, 138, 4, 0.95)",
    etiqueta: "Pendiente",
  },
  reservada: {
    bg: "rgba(239, 68, 68, 0.26)",
    border: "rgba(220, 38, 38, 0.95)",
    etiqueta: "Ocupado",
  },
};

export default function PlanoOficina({ espacios = [], estados = {}, onSelect }) {
  const resolverEspacio = (zona) => {
    const match = espacios.find((e) => {
      const idIguales = String(e.id || "").toLowerCase() === zona.id.toLowerCase();
      const primeraPalabra = zona.nombre.toLowerCase().split(" ")[0];
      const nombreCoincide = String(e.nombre || "").toLowerCase().includes(primeraPalabra);
      return idIguales || nombreCoincide;
    });

    return (
      match || {
        id: zona.id,
        nombre: zona.nombre,
        capacidad: 1,
        precio_hora: 0,
      }
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-white"
      style={{
        borderRadius: "20px",
        boxShadow:
          "0 14px 30px -6px rgba(15, 23, 42, 0.16), 0 6px 14px -4px rgba(15, 23, 42, 0.1)",
      }}
    >
      <img
        src="/plano-oficina.png"
        alt="Plano de espacios del coworking"
        className="block h-auto w-full select-none pointer-events-none"
      />

      {ZONAS_PLANO.map((zona) => {
        const espacio = resolverEspacio(zona);
        const estado = estados[espacio.id] || "libre";
        const visual = ESTILOS_ESTADO[estado] || ESTILOS_ESTADO.libre;

        return (
          <button
            key={zona.id}
            type="button"
            className="zona-plano"
            onClick={() => onSelect && onSelect(espacio)}
            style={{
              position: "absolute",
              left: zona.left,
              top: zona.top,
              width: zona.width,
              height: zona.height,
              backgroundColor: visual.bg,
              border: `2px solid ${visual.border}`,
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "6px",
            }}
          
          >
            <span
              className="bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-slate-900"
              style={{ borderRadius: "9999px" }}
            >
              {espacio.nombre}
            </span>
            <span
              className="bg-white/90 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-900"
              style={{ borderRadius: "9999px" }}
            >
              {visual.etiqueta}
            </span>
          </button>
        );
      })}
    </div>
  );
}