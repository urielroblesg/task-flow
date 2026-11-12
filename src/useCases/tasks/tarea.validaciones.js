import { HttpError } from '../../utils/http.error.js';

const CAMPOS_PERMITIDOS = ['title', 'description', 'status', 'priority'];
const ESTADOS = ['pending', 'in_progress', 'done'];

/** @param {unknown} datos @param {boolean} [parcial] @returns {Partial<import('../../types.js').TareaEntrada>} @throws {HttpError} */
export const validarEntrada = (datos, parcial = false) => {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw new HttpError(400, 'Se requiere un objeto JSON');
  }

  const campos = Object.keys(datos);
  if (campos.some(campo => !CAMPOS_PERMITIDOS.includes(campo))) {
    throw new HttpError(400, 'Campo no permitido');
  }
  if (campos.some(campo => typeof datos[campo] !== 'string')) {
    throw new HttpError(400, 'Los campos deben ser texto');
  }
  if (parcial && campos.length === 0) {
    throw new HttpError(400, 'Actualización vacía');
  }

  return Object.fromEntries(campos.map(campo => [campo, datos[campo]]));
};

/** @param {{status?: string}} [consulta] @returns {Partial<import('../../types.js').TareaEntrada>} @throws {HttpError} */
export const validarFiltro = (consulta = {}) => {
  if (Object.keys(consulta).some(campo => campo !== 'status')) {
    throw new HttpError(400, 'Filtro no permitido');
  }
  if (consulta.status !== undefined && !ESTADOS.includes(consulta.status)) {
    throw new HttpError(400, 'Estado inválido');
  }
  return consulta.status ? { status: consulta.status } : {};
};

/** @param {import('../../types.js').Tarea | null} tarea @returns {import('../../types.js').Tarea} @throws {HttpError} */
export const requerirTarea = tarea => {
  if (!tarea) throw new HttpError(404, 'Tarea no encontrada');
  return tarea;
};
