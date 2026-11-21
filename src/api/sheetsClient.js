const API_URL = '/api-sheets';

export async function obtenerDatos(tabla) {
  try {
    const res = await fetch(`${API_URL}?tabla=${encodeURIComponent(tabla)}`, {
      method: 'GET',
      redirect: 'follow',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`Error cargando tabla "${tabla}" desde Google Sheets:`, err);
    return [];
  }
}

export async function guardarDato(tabla, datos) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      body: JSON.stringify({ tabla, datos }),
    });
    if (!res.ok) {
      return { ok: false, status: 'error', error: `HTTP ${res.status}` };
    }
    const json = await res.json();
    if (json?.status === 'error' || json?.ok === false) {
      return { ok: false, ...json };
    }
    return { ok: true, ...json };
  } catch (err) {
    console.warn(`Error guardando en tabla "${tabla}":`, err);
    return { ok: false, status: 'error', error: err.message };
  }
}

function crearEntidadSheet(nombrePestana) {
  return {
    list: async () => await obtenerDatos(nombrePestana),
    filter: async (filtros = {}) => {
      const datos = await obtenerDatos(nombrePestana);
      return datos.filter((item) =>
        Object.entries(filtros).every(([k, v]) => item[k] === v)
      );
    },
    create: async (datos) => {
      const nuevo = { id: crypto.randomUUID(), ...datos };
      await guardarDato(nombrePestana, nuevo);
      return nuevo;
    },
    update: async (id, datos) => ({ id, ...datos }),
    delete: async () => ({ ok: true }),
  };
}

export const base44 = {
  entities: {
    Carrusel: crearEntidadSheet('Carrusel'),
    Configuracion: crearEntidadSheet('Configuracion'),
    Espacio: crearEntidadSheet('Espacio'),
    Reserva: crearEntidadSheet('Reservas'),
    User: crearEntidadSheet('User'),
  },
  auth: {
    me: async () => {
      const saved = localStorage.getItem('coworking_user');
      return saved ? JSON.parse(saved) : null;
    },
    login: async (email) => {
      const user = { id: 'admin-1', email, role: 'admin', full_name: 'Administrador' };
      localStorage.setItem('coworking_user', JSON.stringify(user));
      return user;
    },
    logout: async () => {
      localStorage.removeItem('coworking_user');
    },
  },
};