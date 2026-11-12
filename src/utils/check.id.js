import mongoose from 'mongoose';
import { HttpError } from './http.error.js';

/** @param {unknown} identificador @returns {asserts identificador is import('../types.js').Id} @throws {HttpError} */
export const checkId = identificador => {
  if (!mongoose.isObjectIdOrHexString(identificador)) {
    throw new HttpError(400, 'ID inválido');
  }
};
