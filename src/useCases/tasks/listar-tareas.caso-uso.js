import * as repositorioTarea from '../../repositories/tarea.repositorio.js';
import { validarFiltro } from './tarea.validaciones.js';

export const ejecutar = async consulta => repositorioTarea.buscarTodas(validarFiltro(consulta));
