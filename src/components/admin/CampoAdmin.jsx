export const inputDark =
  "h-11 w-full border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:border-ochre focus:outline-none";

export const areaDark =
  "w-full border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-ochre focus:outline-none";

export default function CampoAdmin({ label, children, hint, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint && <span className="mt-1.5 block text-[11px] text-white/30">{hint}</span>}
    </label>
  );
}