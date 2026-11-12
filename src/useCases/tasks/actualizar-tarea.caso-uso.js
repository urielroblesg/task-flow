import * as repositorioTarea from '../../repositories/tarea.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { requerirTarea, validarEntrada } from './tarea.validaciones.js';

/** @param {import('../../types.js').Id} identificador @param {Partial<import('../../types.js').TareaEntrada>} datos @returns {Promise<import('../../types.js').Tarea>} */
export const ejecutar = async (identificador, datos) => {
  checkId(identificador);
  const tarea = await repositorioTarea.actualizar(identificador, validarEntrada(datos, true));
  return requerirTarea(tarea);
};
