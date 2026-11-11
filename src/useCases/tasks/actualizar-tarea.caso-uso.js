import * as repositorioTarea from '../../repositories/tarea.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { requerirTarea, validarEntrada } from './tarea.validaciones.js';

export const ejecutar = async (identificador, datos) => {
  checkId(identificador);
  const tarea = await repositorioTarea.actualizar(identificador, validarEntrada(datos, true));
  return requerirTarea(tarea);
};
