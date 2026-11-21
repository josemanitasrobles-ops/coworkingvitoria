const ESTILOS = {
  prerreservada: "border-pendiente/40 bg-pendiente/15 text-amber-300",
  reservada: "border-ocupado/40 bg-ocupado/15 text-red-300",
  cancelada: "border-white/15 bg-white/5 text-white/50",
};

const TEXTOS = {
  prerreservada: "Pendiente",
  reservada: "Confirmada",
  cancelada: "Liberada",
};

export default function EstadoBadge({ estado }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${
        ESTILOS[estado] || ESTILOS.cancelada
      }`}
    >
      {TEXTOS[estado] || estado}
    </span>
  );
}