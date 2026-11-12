import * as repositorioTarea from '../../repositories/tarea.repositorio.js';
import { validarFiltro } from './tarea.validaciones.js';

/** @param {{status?: import('../../types.js').Tarea['status']}} [consulta] @returns {Promise<import('../../types.js').Tarea[]>} */
export const ejecutar = async consulta => repositorioTarea.buscarTodas(validarFiltro(consulta));
