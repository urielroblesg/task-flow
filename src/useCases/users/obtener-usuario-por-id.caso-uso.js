import * as repositorioUsuario from '../../repositories/usuario.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { requerirUsuario, sinContrasena } from './usuario.validaciones.js';

export const ejecutar = async id => {
  checkId(id);
  return sinContrasena(requerirUsuario(await repositorioUsuario.buscarPorId(id)));
};
