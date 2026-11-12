import * as repositorioTarea from '../../repositories/tarea.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { requerirTarea } from './tarea.validaciones.js';

/** @param {import('../../types.js').Id} identificador @returns {Promise<import('../../types.js').Tarea>} */
export const ejecutar = async identificador => {
  checkId(identificador);
  return requerirTarea(await repositorioTarea.buscarPorId(identificador));
};
