import * as repositorioTarea from '../../repositories/tarea.repositorio.js';
import { validarEntrada } from './tarea.validaciones.js';

export const ejecutar = async datos => repositorioTarea.crear(validarEntrada(datos));
