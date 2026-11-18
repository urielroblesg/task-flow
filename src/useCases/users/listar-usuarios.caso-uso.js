import * as repositorioUsuario from '../../repositories/usuario.repositorio.js';
import { sinContrasena } from './usuario.validaciones.js';

/** @returns {Promise<import('../../types.js').UsuarioPublico[]>} */
export const ejecutar = async () => (await repositorioUsuario.buscarTodos()).map(sinContrasena);
