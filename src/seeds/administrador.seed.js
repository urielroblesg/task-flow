import { Rol } from '../entities/rol.entidad.js';
import { Usuario } from '../entities/usuario.entidad.js';

/** @returns {Promise<import('mongoose').HydratedDocument<import('../types.js').Usuario> | null>} */
export const sembrarAdministrador = async () => {
  const { ADMIN_NAME: name, ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;
  if (!name || !email || !password) return null;

  const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase().trim() });
  if (usuarioExistente) return usuarioExistente;

  const rolAdministrador = await Rol.findOne({ name: 'Administrador' });
  if (!rolAdministrador) throw new Error('No existe el rol Administrador');

  return Usuario.create({
    name,
    email,
    password,
    rol: rolAdministrador._id,
  });
};
