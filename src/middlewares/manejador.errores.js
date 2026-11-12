/** @type {import('express').ErrorRequestHandler} */
const manejadorErrores = (error, _solicitud, respuesta, _siguiente) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return respuesta.status(400).json({ message: 'Datos inválidos para la tarea' });
  }

  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  return respuesta.status(status).json({
    message: status === 500 ? 'Error interno' : error.message,
  });
};

export default manejadorErrores;
