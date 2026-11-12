import jwt from 'jsonwebtoken';

const issuer = 'taskflow-api';
const audience = 'tasflow-client';

/** @param {Omit<import('../types.js').JwtPayloadTaskFlow, 'sub'>} payload @param {string} subject @returns {string} */
export const firmarToken = (payload, subject) => jwt.sign(payload, process.env.JWT_SECRET, {
  algorithm: 'HS256',
  issuer,
  audience,
  subject,
});

/** @param {string} token @returns {import('../types.js').JwtPayloadTaskFlow} */
export const validarToken = (token) => jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: 'HS256',
  issuer,
  audience,
});
