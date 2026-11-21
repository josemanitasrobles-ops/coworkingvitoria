import { useEffect, useState } from "react";

const STORAGE_KEY = "coworking_cookies_consent_v1";

export default function CookieBanner({ onOpenPrivacy }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "accepted" || saved === "rejected") {
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDecision = (decision) => {
    localStorage.setItem(STORAGE_KEY, decision);
    setVisible(false);

    // Aquí puedes activar o bloquear scripts opcionales según la elección:
    // if (decision === "accepted") { ... }
    // if (decision === "rejected") { ... }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        maxWidth: "380px",
        width: "calc(100% - 40px)",
        backgroundColor: "#ffffff",
        color: "#111827",
        borderRadius: "18px",
        padding: "18px 20px",
        boxShadow: "0 14px 35px rgba(0, 0, 0, 0.16)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        zIndex: 9999,
      }}
    >
      <p style={{ margin: "0 0 6px 0", fontWeight: 700, fontSize: "15px" }}>
        Uso de cookies
      </p>

      <p
        style={{
          margin: "0 0 14px 0",
          fontSize: "13.5px",
          lineHeight: 1.45,
          color: "#4b5563",
        }}
      >
        Utilizamos cookies técnicas necesarias para el funcionamiento de la web y,
        si lo aceptas, cookies opcionales para mejorar tu experiencia.
        {onOpenPrivacy && (
          <>
            {" "}
            <button
              type="button"
              onClick={onOpenPrivacy}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "#111827",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Política de privacidad
            </button>
          </>
        )}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => handleDecision("rejected")}
          style={{
            borderRadius: "9999px",
            padding: "9px 16px",
            fontSize: "13.5px",
            fontWeight: 600,
            backgroundColor: "#f3f4f6",
            color: "#111827",
            border: "1px solid #d1d5db",
            cursor: "pointer",
            transition: "transform 0.15s ease, background-color 0.15s ease",
          }}
        >
          No aceptar
        </button>

        <button
          type="button"
          onClick={() => handleDecision("accepted")}
          style={{
            borderRadius: "9999px",
            padding: "9px 18px",
            fontSize: "13.5px",
            fontWeight: 600,
            backgroundColor: "#111827",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(17, 24, 39, 0.22)",
            transition: "transform 0.15s ease, opacity 0.15s ease",
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}