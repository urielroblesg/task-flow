import { request, response } from 'express';

import { validarToken } from '../utils/jtw.gen.js';
import * as usuarioRepositoy from '../repositories/usuario.repositorio.js';
import * as rolRepository from '../repositories/rol.repositorio.js';
import { checkId } from '../utils/check.id.js';

/** @type {import('express').RequestHandler} */
export const autenticarJwt = async (req = request, res = response, next) => {
  /** @returns {import('express').Response} */
  const rechazar = () => res.set('WWW-Authenticate', 'Bearer').status(401).json({ mensaje : 'Autenticacion requerida' });

  const coincide = (/^Bearer ([^\s]+)$/i).exec(req.get('Authorization') || '');

  if (!coincide) return rechazar();

  try {
    const payload = validarToken(coincide[1]);

    const { rol, sub } = payload;

    checkId(rol);
    checkId(sub);

    // Buscar por id el usuario
    const usuario = await usuarioRepositoy.buscarPorId(sub);

    // Buscar el rol por id
    const rolUsuario = await rolRepository.buscarPorId(rol);

    // Validar si el usuario esta activo
    if (!usuario?.isActive || !rolUsuario?.isActive) return rechazar();

    /** @type {import('express').Request & {usuario?: import('../types.js').Usuario}} */
    const solicitudAutenticada = req;
    solicitudAutenticada.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);

    rechazar();
  }
};
