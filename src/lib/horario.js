export const CONFIG_DEFECTO = {
  nombre_negocio: "Núcleo Vitoria",
  direccion: "Calle Dato 12, 2ª planta · 01005 Vitoria-Gasteiz",
  telefono: "+34 945 000 000",
  email_contacto: "hola@nucleovitoria.com",
  email_notificaciones: "hola@nucleovitoria.com",
  hora_apertura: "08:00",
  hora_cierre: "20:00",
  texto_bienvenida:
    "Coworking en el centro de Vitoria-Gasteiz. Puestos flexibles, despachos privados y salas por horas.",
};

export function normalizarFechaISO(valor) {
  if (!valor) return "";
  const str = String(valor).trim();
  // Si ya es YYYY-MM-DD exacto, lo devolvemos tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str.slice(0, 10);

  // Si es medianoche UTC (T00:00:00.000Z), usamos UTC para no restar un día;
  // si tiene hora avanzada como T23:00:00.000Z, usamos fecha local.
  const esMedianocheUTC = str.endsWith("T00:00:00.000Z") || str.endsWith("T00:00:00Z");
  const year = esMedianocheUTC ? d.getUTCFullYear() : d.getFullYear();
  const month = String((esMedianocheUTC ? d.getUTCMonth() : d.getMonth()) + 1).padStart(2, "0");
  const day = String(esMedianocheUTC ? d.getUTCDate() : d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function aMinutos(hora) {
  if (!hora) return 0;
  const str = String(hora).trim();

  // Si viene como ISO de Google Sheets (ej. "1899-12-30T13:14:44.000Z"),
  // usamos la hora local del navegador para que coincida con la hora real en Sheets
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
    const d = new Date(str);
    if (!Number.isNaN(d.getTime())) {
      const minsLocal = d.getHours() * 60 + d.getMinutes();
      // Redondear si tiene segundos de desfase histórico de Sheets (ej. 13:14 -> 13:00 si es 1899)
      if (str.startsWith("1899-12-30")) {
        return Math.round(minsLocal / 30) * 30;
      }
      return minsLocal;
    }
  }

  const match = str.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

function normalizarHora(hora) {
  const mins = aMinutos(hora);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function franjas(apertura = "08:00", cierre = "20:00") {
  const inicio = Math.floor(aMinutos(apertura) / 60);
  const fin = Math.floor(aMinutos(cierre) / 60);
  const salida = [];
  for (let h = inicio; h < fin; h += 1) {
    salida.push(`${String(h).padStart(2, "0")}:00`);
  }
  return salida;
}

export function sumarHoras(hora, cantidad) {
  const totalMins = aMinutos(hora) + Number(cantidad || 0) * 60;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function horasEntre(inicio, fin) {
  return (aMinutos(fin) - aMinutos(inicio)) / 60;
}

export function solapan(inicioA, finA, inicioB, finB) {
  const a1 = aMinutos(inicioA);
  const a2 = aMinutos(finA);
  const b1 = aMinutos(inicioB);
  const b2 = aMinutos(finB);
  return a1 < b2 && b1 < a2;
}

export function estadoEspacio(reservas, espacioId, inicio, fin) {
  let estado = "libre";
  if (!Array.isArray(reservas)) return estado;

  for (const r of reservas) {
    if (String(r.espacio_id) !== String(espacioId)) continue;

    const est = String(r.estado || "").trim().toLowerCase();
    if (est === "cancelada" || est === "rechazada") continue;

    const rInicio = normalizarHora(r.hora_inicio);
    const rFin = normalizarHora(r.hora_fin);
    if (!solapan(inicio, fin, rInicio, rFin)) continue;

    if (est === "reservada" || est === "confirmada" || est === "ocupada") {
      return "reservada";
    }
    if (est === "prerreservada" || est === "pendiente") {
      estado = "prerreservada";
    }
  }
  return estado;
}

export function formatearFechaLarga(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export function formatearFechaCorta(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function precio(valor) {
  const n = Number(valor) || 0;
  return `${n.toFixed(n % 1 === 0 ? 0 : 2)} €`;
}