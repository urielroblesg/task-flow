import * as repositorioUsuario from '../../repositories/usuario.repositorio.js';
import * as repositorioRol from '../../repositories/rol.repositorio.js';

const sinContrasena = ({ password: _contrasena, ...usuario }) => usuario;

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
