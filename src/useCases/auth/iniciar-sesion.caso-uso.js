import { compare } from "bcrypt";

import * as repositorioUsuario from "../../repositories/usuario.repositorio.js";
import { buscarPorId } from "../../repositories/rol.repositorio.js";

import { firmarToken } from "../../utils/jtw.gen.js";
import { HttpError } from "../../utils/http.error.js";

/** @param {import('../../types.js').Credenciales} credenciales @returns {Promise<import('../../types.js').Sesion | null>} */
export const ejecutar = async ({ email, password }) => {
  const usuario = await repositorioUsuario.buscarPorCorreo(email);
  if (!usuario) {
    return null;
  }

  const coinciden = await compare(password, usuario.password);

  if (!coinciden) {
    throw new Error("Las contraseñas no coinciden");
  }

  // Payload para el token
  const rol = await buscarPorId(usuario.rol);

  if (!usuario.isActive || !rol?.isActive)
    throw new HttpError(401, "Credenciales inválidas");

  const jwtPayload = {
    rol: rol.id,
  };

  const jwt = firmarToken(jwtPayload, usuario.id);

  const { password: _hashPrivado, ...publico } = usuario;

  return {
    accessToken: jwt,
    tokenType: "Bearer",
    expiresIn: 900,
    usuario: publico,
  };
};
