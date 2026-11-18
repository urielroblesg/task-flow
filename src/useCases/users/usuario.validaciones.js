import { HttpError } from '../../utils/http.error.js';

const CAMPOS_PERMITIDOS = ['name', 'email', 'password', 'rol', 'isActive'];

/** @param {unknown} datos @param {boolean} [parcial] @returns {Partial<import('../../types.js').UsuarioEntrada & {isActive: boolean}>} */
export const validarEntrada = (datos, parcial = false) => {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) throw new HttpError(400, 'Se requiere un objeto JSON');
  const campos = Object.keys(datos);
  if (campos.some(campo => !CAMPOS_PERMITIDOS.includes(campo))) throw new HttpError(400, 'Campo no permitido');
  if (parcial && campos.length === 0) throw new HttpError(400, 'Actualización vacía');
  if (!parcial && ['name', 'email', 'password', 'rol'].some(campo => !campos.includes(campo))) {
    throw new HttpError(400, 'Nombre, correo, contraseña y rol son obligatorios');
  }
  return Object.fromEntries(campos.map(campo => [campo, datos[campo]]));
};

/** @param {import('../../types.js').Usuario | null} usuario */
export const requerirUsuario = usuario => {
  if (!usuario) throw new HttpError(404, 'Usuario no encontrado');
  return usuario;
};

/** @param {import('../../types.js').Usuario} usuario @returns {import('../../types.js').UsuarioPublico} */
export const sinContrasena = ({ password: _password, ...usuario }) => usuario;
