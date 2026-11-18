import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { crearRespuesta } from '../helpers/http.js';

const buscarPorId = jest.fn();
jest.unstable_mockModule('../../../src/repositories/rol.repositorio.js', () => ({ buscarPorId }));

const { isAdministrador } = await import('../../../src/middlewares/is-administrador.js');

beforeEach(() => jest.clearAllMocks());

describe('middleware isAdministrador', () => {
  it('permite administradores activos', async () => {
    buscarPorId.mockResolvedValue({ isActive: true, name: 'Administrador' });
    const siguiente = jest.fn();
    await isAdministrador({ usuario: { rol: 'rol-admin' } }, crearRespuesta(), siguiente);
    expect(siguiente).toHaveBeenCalledWith();
  });

  it.each([
    { isActive: true, name: 'Cliente' },
    { isActive: false, name: 'Administrador' },
    null,
  ])('responde 403 para rol no autorizado', async rol => {
    buscarPorId.mockResolvedValue(rol);
    const respuesta = crearRespuesta();
    await isAdministrador({ usuario: { rol: 'rol' } }, respuesta, jest.fn());
    expect(respuesta.status).toHaveBeenCalledWith(403);
    expect(respuesta.json).toHaveBeenCalledWith({ message: 'Acceso exclusivo para administradores' });
  });

  it('propaga errores', async () => {
    const error = new Error('fallo');
    buscarPorId.mockRejectedValue(error);
    const siguiente = jest.fn();
    await isAdministrador({ usuario: { rol: 'rol' } }, crearRespuesta(), siguiente);
    expect(siguiente).toHaveBeenCalledWith(error);
  });
});
