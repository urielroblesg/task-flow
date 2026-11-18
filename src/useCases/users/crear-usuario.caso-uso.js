import * as repositorioRol from '../../repositories/rol.repositorio.js';
import * as repositorioUsuario from '../../repositories/usuario.repositorio.js';
import { checkId } from '../../utils/check.id.js';
import { HttpError } from '../../utils/http.error.js';
import { sinContrasena, validarEntrada } from './usuario.validaciones.js';

export const ejecutar = async entrada => {
  const datos = validarEntrada(entrada);
  checkId(datos.rol);
  if (await repositorioUsuario.buscarPorCorreo(datos.email)) throw new HttpError(409, 'El correo ya está registrado');
  const rol = await repositorioRol.buscarPorId(datos.rol);
  if (!rol?.isActive) throw new HttpError(400, 'Rol inválido');
  return sinContrasena(await repositorioUsuario.crear(datos));
};
