import * as actualizarUsuario from '../useCases/users/actualizar-usuario.caso-uso.js';
import * as crearUsuario from '../useCases/users/crear-usuario.caso-uso.js';
import * as eliminarUsuario from '../useCases/users/eliminar-usuario.caso-uso.js';
import * as listarUsuarios from '../useCases/users/listar-usuarios.caso-uso.js';
import * as obtenerUsuario from '../useCases/users/obtener-usuario-por-id.caso-uso.js';

export const listar = async (_solicitud, respuesta, siguiente) => {
  try { return respuesta.json(await listarUsuarios.ejecutar()); } catch (error) { siguiente(error); }
};
export const obtenerPorId = async (solicitud, respuesta, siguiente) => {
  try { return respuesta.json(await obtenerUsuario.ejecutar(solicitud.params.id)); } catch (error) { siguiente(error); }
};
export const crear = async (solicitud, respuesta, siguiente) => {
  try { return respuesta.status(201).json(await crearUsuario.ejecutar(solicitud.body)); } catch (error) { siguiente(error); }
};
export const actualizar = async (solicitud, respuesta, siguiente) => {
  try { return respuesta.json(await actualizarUsuario.ejecutar(solicitud.params.id, solicitud.body)); } catch (error) { siguiente(error); }
};
export const eliminar = async (solicitud, respuesta, siguiente) => {
  try { await eliminarUsuario.ejecutar(solicitud.params.id); return respuesta.status(204).send(); } catch (error) { siguiente(error); }
};
