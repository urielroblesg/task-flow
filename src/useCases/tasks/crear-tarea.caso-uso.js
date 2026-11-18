import * as repositorioTarea from '../../repositories/tarea.repositorio.js';
import { validarEntrada } from './tarea.validaciones.js';

/** @param {import('../../types.js').TareaEntrada} datos @returns {Promise<import('../../types.js').Tarea>} */
export const ejecutar = async (datos, propietario) => await repositorioTarea.crear({ ...validarEntrada(datos), propietario });
