import { Task } from "../entities/tarea.entidad.js";

/**
 * Convierte un documento de Mongoose en DTO.
 * @param {{toObject: () => any} | null} doc
 * @returns {import('../types.js').Tarea | null}
 */
const toDto = (doc) => {
  if (!doc) return null;
  const value = doc.toObject();
  value.id = String(value._id);
  delete value._id;
  delete value.__v;
  return /** @type {import('../types.js').Tarea} */ (value);
};

/** @param {Partial<import('../types.js').TareaEntrada>} [filtros] @returns {Promise<import('../types.js').Tarea[]>} */
export const buscarTodas = async (filtros = {}) =>
  (await Task.find(filtros)).map(toDto);

/** @param {import('../types.js').Id} identificador @returns {Promise<import('../types.js').Tarea | null>} */
export const buscarPorId = async (identificador) =>
  toDto(await Task.findById(identificador));

/** @param {import('../types.js').TareaEntrada} datos @returns {Promise<import('../types.js').Tarea>} */
export const crear = async (datos) => {
  const task = await Task.create(datos);
  return toDto(task);
};

/** @param {import('../types.js').Id} identificador @param {Partial<import('../types.js').TareaEntrada>} datos @returns {Promise<import('../types.js').Tarea | null>} */
export const actualizar = async (identificador, datos) => {
  const taskActualizada = await Task.findByIdAndUpdate(
    identificador,
    { $set: datos },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return toDto(taskActualizada);
};

/** @param {import('../types.js').Id} identificador @returns {Promise<import('../types.js').Tarea | null>} */
export const eliminar = async (identificador) =>
  toDto(await Task.findByIdAndDelete(identificador));
