import { Rol } from '../entities/rol.entidad.js';

export const buscarPorNombre = name => Rol.findOne({ name });
