import { describe, expect, it, jest } from '@jest/globals';

import { reglasInicioSesion, reglasRegistro } from '../../../src/middlewares/autenticacion.validador.js';
import manejadorErrores from '../../../src/middlewares/manejador.errores.js';
import { reglasTarea } from '../../../src/middlewares/tarea.validador.js';
import { validarSolicitud } from '../../../src/middlewares/validar.solicitud.js';
import { crearRespuesta, ejecutarMiddlewares } from '../helpers/http.js';

const validar = async (reglas, body) => {
  const solicitud = { body };
  const respuesta = crearRespuesta();
  await ejecutarMiddlewares(reglas, solicitud, respuesta);
  const siguiente = jest.fn();
  validarSolicitud(solicitud, respuesta, siguiente);
  return { respuesta, siguiente, solicitud };
};

describe('validadores de autenticación', () => {
  it('acepta registro válido y normaliza datos', async () => {
    const resultado = await validar(reglasRegistro, {
      email: 'ANA@EXAMPLE.COM',
      name: ' Ana ',
      password: 'secreto12',
    });
    expect(resultado.siguiente).toHaveBeenCalled();
    expect(resultado.solicitud.body).toMatchObject({ email: 'ana@example.com', name: 'Ana' });
  });

  it('rechaza registro inválido', async () => {
    const { respuesta } = await validar(reglasRegistro, { email: 'correo', name: '', password: 'corta' });
    expect(respuesta.status).toHaveBeenCalledWith(400);
    expect(respuesta.json).toHaveBeenCalledWith(expect.objectContaining({ errores: expect.any(Array) }));
  });

  it('valida credenciales de inicio', async () => {
    expect((await validar(reglasInicioSesion, { email: 'ana@example.com', password: 'secreto12' })).siguiente)
      .toHaveBeenCalled();
  });
});

describe('validador de tarea', () => {
  it('acepta y limpia tarea válida', async () => {
    const resultado = await validar(reglasTarea, { priority: 'high', status: 'done', title: ' Probar ' });
    expect(resultado.siguiente).toHaveBeenCalled();
    expect(resultado.solicitud.body).toEqual({ priority: 'high', status: 'done', title: 'Probar' });
  });

  it('rechaza campos inválidos', async () => {
    const { respuesta } = await validar(reglasTarea, { priority: 'urgente', status: 'PENDING', title: '' });
    expect(respuesta.status).toHaveBeenCalledWith(400);
    expect(respuesta.json.mock.calls[0][0].errores).toHaveLength(3);
  });
});

describe('manejador de errores', () => {
  it('oculta error interno y responde 500', () => {
    const respuesta = crearRespuesta();
    manejadorErrores(new Error('fallo'), {}, respuesta, jest.fn());
    expect(respuesta.status).toHaveBeenCalledWith(500);
    expect(respuesta.json).toHaveBeenCalledWith({ message: 'Error interno' });
  });
});
