import * as repositorioUsuario from '../../repositories/usuario.repositorio.js';
import * as repositorioRol from '../../repositories/rol.repositorio.js';

/** @param {import('../../types.js').Usuario} usuario @returns {import('../../types.js').UsuarioPublico} */
const sinContrasena = ({ password: _contrasena, ...usuario }) => usuario;

/** @param {import('../../types.js').UsuarioEntrada} datos @returns {Promise<import('../../types.js').UsuarioPublico | null>} */
export const ejecutar = async datos => {
  const usuarioExistente = await repositorioUsuario.buscarPorCorreo(datos.email);
  if (usuarioExistente) {
    return null;
  }
  const rolCliente = await repositorioRol.buscarPorNombre('Cliente');
  if (!rolCliente) throw new Error('No existe el rol Cliente');

  const usuarioCreado = await repositorioUsuario.crear({
    ...datos,
    rol: rolCliente._id ?? rolCliente.id,
  });
  return sinContrasena(usuarioCreado);
};
