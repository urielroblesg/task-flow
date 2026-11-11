import { Usuario } from '../entities/usuario.entidad.js';

const toDto = doc => {
  if (!doc) return null;
  const value = doc.toObject();
  value.id = String(value._id);
  delete value._id;
  delete value.__v;
  delete value.createdAt;
  return value;
};

export const buscarPorCorreo = async email => toDto(await Usuario.findOne({ email }));

export const crear = async datos => {
  const usuario = await Usuario.create(datos);
  return toDto(usuario);
};
