import * as repositorioTarea from '../../repositories/tarea.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { requerirTarea } from './tarea.validaciones.js';

/**
 * Elimina una tarea.
 *
 * @param {Number} identificador
 * @returns {Boolean}
 */
export const ejecutar = async identificador => {
  checkId(identificador);
  return requerirTarea(await repositorioTarea.eliminar(identificador));
};
