import { buscarPorId } from '../repositories/rol.repositorio.js';

/** @type {import('express').RequestHandler} */
export const isAdministrador = async (solicitud, respuesta, siguiente) => {
  try {
    const rol = await buscarPorId(solicitud.usuario?.rol);
    if (!rol?.isActive || rol.name !== 'Administrador') {
      return respuesta.status(403).json({ message: 'Acceso exclusivo para administradores' });
    }
    siguiente();
  } catch (error) {
    siguiente(error);
  }
};
