import { Usuario } from '../entities/usuario.entidad.js';

/**
 * @param {{toObject: () => any} | null} doc
 * @returns {import('../types.js').Usuario | null}
 */
const toDto = doc => {
  if (!doc) return null;
  const value = doc.toObject();
  value.id = String(value._id);
  delete value._id;
  delete value.__v;
  delete value.createdAt;
  return /** @type {import('../types.js').Usuario} */ (value);
};

/** @param {string} email @returns {Promise<import('../types.js').Usuario | null>} */
export const buscarPorCorreo = async email => toDto(await Usuario.findOne({ email }));

/** @param {import('../types.js').UsuarioEntrada} datos @returns {Promise<import('../types.js').Usuario>} */
export const crear = async datos => {
  const usuario = await Usuario.create(datos);
  return toDto(usuario);
};

/** @param {import('../types.js').Id} id @returns {Promise<import('../types.js').Usuario | null>} */
export const buscarPorId = async id => toDto(await Usuario.findById(id));
