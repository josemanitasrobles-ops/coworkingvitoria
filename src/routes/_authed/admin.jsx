import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { CalendarDays, Building2, Images, Settings, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Reservas", icon: CalendarDays, exact: true },
  { to: "/admin/espacios", label: "Espacios", icon: Building2 },
  { to: "/admin/carrusel", label: "Carrusel", icon: Images },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings },
];

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const { logout } = useAuth();

  if (user && user.role !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0B1220] px-6 text-center">
        <div className="max-w-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ochre">Acceso restringido</p>
          <h1 className="mt-4 font-display text-3xl font-light text-white">
            Esta cuenta no tiene permisos de administración
          </h1>
          <p className="mt-3 text-sm text-white/50">
            Pide a una persona administradora que te asigne el rol correspondiente.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white hover:border-white"
          >
            Volver a la web
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center bg-ochre font-display text-lg leading-none text-white">
              N
            </span>
            <div className="leading-none">
              <p className="text-[12px] font-medium uppercase tracking-[0.28em]">Núcleo</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">
                Panel de administración
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] text-white/40 sm:block">{user?.email}</span>
            <Link
              to="/"
              className="grid h-9 w-9 place-items-center border border-white/15 text-white/60 transition-colors hover:border-white hover:text-white"
              aria-label="Ver la web"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="flex h-9 items-center gap-2 border border-white/15 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:border-white hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Salir
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 md:px-8">
          {NAV.map((item) => {
            const Icono = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className={cn(
                  "flex shrink-0 items-center gap-2 border-b-2 border-transparent px-3 py-3 text-[12px] font-medium text-white/50 transition-colors hover:text-white"
                )}
                activeProps={{ className: "border-ochre text-white" }}
              >
                <Icono className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}