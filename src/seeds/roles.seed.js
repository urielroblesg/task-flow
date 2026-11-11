import { Rol } from '../entities/rol.entidad.js';

const roles = [
  {
    name: 'Administrador',
    description: 'Acceso administrativo al sistema',
    isActive: true,
  },
  {
    name: 'Cliente',
    description: 'Usuario estándar del sistema',
    isActive: true,
  },
];

export const sembrarRoles = () => Rol.bulkWrite(
  roles.map(rol => ({
    updateOne: {
      filter: { name: rol.name },
      update: { $setOnInsert: rol },
      upsert: true,
    },
  })),
);
