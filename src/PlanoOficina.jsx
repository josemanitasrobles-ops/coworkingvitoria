import React from "react";

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
    nombre: "Zona Coworking (8 puestos)",
    left: "36%",
    top: "26%",
    width: "34%",
    height: "65%",
  },
];

export default function PlanoOficina({
  espacios = [],
  espacioSeleccionado,
  onSeleccionarEspacio,
  estaOcupado = () => false,
}) {
  const resolverEspacio = (zona) => {
    const encontrada = espacios.find((e) => {
      const idMatch = String(e.id || "").toLowerCase() === zona.id.toLowerCase();
      const nombreMatch = String(e.nombre || "")
        .toLowerCase()
        .includes(zona.nombre.toLowerCase().split(" ")[0]);
      return idMatch || nombreMatch;
    });

    return (
      encontrada || {
        id: zona.id,
        nombre: zona.nombre,
        disponible: true,
        activo: true,
      }
    );
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto select-none overflow-hidden bg-white"
      style={{
        borderRadius: "20px",
        boxShadow:
          "0 14px 30px -6px rgba(15, 23, 42, 0.16), 0 6px 14px -4px rgba(15, 23, 42, 0.1)",
      }}
    >
      <img
        src="/plano-oficina.png"
        alt="Plano de oficina de coworking"
        className="w-full h-auto block pointer-events-none"
      />

      {ZONAS_PLANO.map((zona) => {
        const espacio = resolverEspacio(zona);
        const ocupado = estaOcupado(espacio);
        const seleccionada =
          espacioSeleccionado &&
          String(espacioSeleccionado.id) === String(espacio.id);

        let bgColor = "rgba(34, 197, 94, 0.22)";
        let borderColor = "rgba(22, 163, 74, 0.85)";
        let badgeText = "LIBRE";

        if (ocupado) {
          bgColor = "rgba(239, 68, 68, 0.25)";
          borderColor = "rgba(220, 38, 38, 0.9)";
          badgeText = "OCUPADO";
        } else if (seleccionada) {
          bgColor = "rgba(234, 88, 12, 0.28)";
          borderColor = "rgba(194, 65, 12, 1)";
          badgeText = "ELEGIDO";
        }

        return (
          <button
            key={zona.id}
            type="button"
            disabled={ocupado}
            onClick={() => !ocupado && onSeleccionarEspacio(espacio)}
            style={{
              position: "absolute",
              left: zona.left,
              top: zona.top,
              width: zona.width,
              height: zona.height,
              backgroundColor: bgColor,
              border: `2px solid ${borderColor}`,
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              cursor: ocupado ? "not-allowed" : "pointer",
            }}
            title={`${espacio.nombre} (${badgeText})`}
          >
            <span
              className="px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-slate-900 bg-white/90"
              style={{ borderRadius: "9999px" }}
            >
              {espacio.nombre}
            </span>
            <span
              className="px-2 py-0.5 text-[10px] font-semibold text-slate-900 bg-white/85"
              style={{ borderRadius: "9999px" }}
            >
              {badgeText}
            </span>
          </button>
        );
      })}
    </div>
  );
}