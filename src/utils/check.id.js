import mongoose from 'mongoose';
import { HttpError } from './http.error.js';

export const checkId = identificador => {
  if (!mongoose.isObjectIdOrHexString(identificador)) {
    throw new HttpError(400, 'ID inválido');
  }
};
