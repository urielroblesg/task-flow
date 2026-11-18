import * as repositorioTarea from '../../repositories/tarea.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { requerirTarea } from './tarea.validaciones.js';

/**
 * Elimina una tarea.
 *
 * @param {import('../../types.js').Id} identificador
 * @returns {Promise<import('../../types.js').Tarea>}
 */
export const ejecutar = async (identificador, propietario) => {
  checkId(identificador);
  checkId(propietario);
  return requerirTarea(await repositorioTarea.eliminar(identificador, propietario));
};
