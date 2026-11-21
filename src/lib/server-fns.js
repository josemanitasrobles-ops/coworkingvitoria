import { obtenerDatos, guardarDato } from '@/api/sheetsClient';

// 1. Para src/hooks/usePublicConfig.js
export async function getConfigPublica() {
  const filas = await obtenerDatos('Configuracion');
  const config = {};
  if (Array.isArray(filas)) {
    filas.forEach((fila) => {
      if (fila.clave) config[fila.clave] = fila.valor;
    });
  }
  return config;
}

// 2. Para src/routes/espacios.jsx y src/routes/reservar.jsx
export async function getDisponibilidad({ data } = {}) {
  const reservas = await obtenerDatos('Reservas');
  if (!Array.isArray(reservas)) return [];
  if (!data?.fecha) return reservas;

  return reservas.filter((r) => {
    const fechaFila = String(r.fecha || "").slice(0, 10);
    return fechaFila === String(data.fecha).slice(0, 10);
  });
}

// 3. Para src/routes/reservar.jsx
export async function crearSolicitudReserva({ data }) {
  const nuevaReserva = {
    id: crypto.randomUUID(),
    ...data,
    estado: data?.estado || 'pendiente',
  };
  return await guardarDato('Reservas', nuevaReserva);
}