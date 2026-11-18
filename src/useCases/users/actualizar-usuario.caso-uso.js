import * as repositorioRol from '../../repositories/rol.repositorio.js';
import * as repositorioUsuario from '../../repositories/usuario.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { HttpError } from '../../utils/http.error.js';
import { requerirUsuario, sinContrasena, validarEntrada } from './usuario.validaciones.js';

export const ejecutar = async (id, entrada) => {
  checkId(id);
  const datos = validarEntrada(entrada, true);
  if (datos.rol !== undefined) {
    checkId(datos.rol);
    if (!(await repositorioRol.buscarPorId(datos.rol))?.isActive) throw new HttpError(400, 'Rol inválido');
  }
  if (datos.email !== undefined) {
    const existente = await repositorioUsuario.buscarPorCorreo(datos.email);
    if (existente && existente.id !== String(id)) throw new HttpError(409, 'El correo ya está registrado');
  }
  return sinContrasena(requerirUsuario(await repositorioUsuario.actualizar(id, datos)));
};
