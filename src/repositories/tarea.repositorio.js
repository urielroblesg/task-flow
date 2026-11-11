import { Task } from '../entities/tarea.entidad.js';

const toDto = (doc) => {
  if (!doc) return null;
  const value = doc.toObject();
  value.id = String(value._id);
  delete value._id;
  delete value.__v;
  return value;
};

export const buscarTodas = async (filtros = {}) => (await Task.find(filtros)).map(toDto);

export const buscarPorId = async identificador => toDto(await Task.findById(identificador));

export const crear = async datos => {
  const task = await Task.create(datos);
  return toDto(task);
};

export const actualizar = async (identificador, datos) => {
  const taskActualizada = await Task.findByIdAndUpdate(identificador, { $set: datos }, {
    returnDocument: 'after',
    runValidators: true,
  });

  return toDto(taskActualizada);
};

export const eliminar = async identificador => toDto(await Task.findByIdAndDelete(identificador));
