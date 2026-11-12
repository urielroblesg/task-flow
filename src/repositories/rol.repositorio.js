import { Rol } from '../entities/rol.entidad.js';

/** @param {string} name @returns {import('mongoose').Query<import('mongoose').HydratedDocument<import('../types.js').Rol> | null, import('mongoose').HydratedDocument<import('../types.js').Rol>>} */
export const buscarPorNombre = name => Rol.findOne({ name });

/** @param {import('../types.js').Id} id @returns {import('mongoose').Query<import('mongoose').HydratedDocument<import('../types.js').Rol> | null, import('mongoose').HydratedDocument<import('../types.js').Rol>>} */
export const buscarPorId = id => Rol.findById(id);
