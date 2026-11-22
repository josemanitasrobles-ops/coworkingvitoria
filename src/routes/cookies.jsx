import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
});

function CookiesPage() {
    const router = useRouter();

const handleVolver = () => {
  if (router.history.canGoBack()) {
    router.history.back();
  } else {
    router.navigate({ to: "/" });
  }
};
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24 text-ink">
        <button
  type="button"
  onClick={handleVolver}
  className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-black/5"
>
  <ArrowLeft className="h-3.5 w-3.5" />
  Volver atrás
</button>
      <p className="eyebrow text-ink/50">Información legal</p>
      <h1 className="mt-2 font-display text-3xl font-light md:text-5xl">
        Política de cookies
      </h1>
      <p className="mt-4 text-sm text-ink/60">
        Última actualización: noviembre de 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink/80">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">
            ¿Qué son las cookies?
          </h2>
          <p>
            Las cookies y tecnologías similares (como el almacenamiento local del
            navegador) son pequeños archivos o registros que se guardan en tu
            dispositivo cuando visitas un sitio web para garantizar su correcto
            funcionamiento y recordar tus preferencias.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">
            Tipos de cookies que utilizamos
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Cookies técnicas o necesarias:</strong> imprescindibles
              para que la web cargue correctamente, gestionar la navegación y
              recordar tu elección sobre el aviso de cookies. No requieren
              consentimiento previo.
            </li>
            <li>
              <strong>Cookies de preferencias o funcionales (opcionales):</strong>{" "}
              permiten mejorar la experiencia de uso y recordar ajustes de
              sesión cuando las aceptas expresamente.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">
            ¿Cómo puedes gestionar o desactivar las cookies?
          </h2>
          <p>
            Puedes aceptar o rechazar las cookies opcionales desde el aviso
            inicial de la web. Además, puedes permitir, bloquear o eliminar las
            cookies instaladas en tu equipo mediante la configuración de tu
            navegador (Chrome, Safari, Firefox o Edge) o borrando los datos de
            navegación del sitio.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">
            Contacto
          </h2>
          <p>
            Si tienes cualquier duda sobre nuestra Política de cookies, puedes
            escribirnos a{" "}
            <a
              href="mailto:hola@nucleovitoria.com"
              className="underline hover:text-ink"
            >
              hola@nucleovitoria.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}