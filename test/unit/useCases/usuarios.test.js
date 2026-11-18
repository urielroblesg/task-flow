import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

const usuarioRepositorio = {
  actualizar: jest.fn(),
  buscarPorCorreo: jest.fn(),
  buscarPorId: jest.fn(),
  buscarTodos: jest.fn(),
  crear: jest.fn(),
  desactivar: jest.fn(),
};
const rolRepositorio = { buscarPorId: jest.fn() };
jest.unstable_mockModule('../../../src/repositories/usuario.repositorio.js', () => usuarioRepositorio);
jest.unstable_mockModule('../../../src/repositories/rol.repositorio.js', () => rolRepositorio);

let casos;
const id = '507f1f77bcf86cd799439011';
const rol = '507f191e810c19729de860ea';

beforeAll(async () => {
  const [actualizar, crear, eliminar, listar, obtener] = await Promise.all([
    import('../../../src/useCases/users/actualizar-usuario.caso-uso.js'),
    import('../../../src/useCases/users/crear-usuario.caso-uso.js'),
    import('../../../src/useCases/users/eliminar-usuario.caso-uso.js'),
    import('../../../src/useCases/users/listar-usuarios.caso-uso.js'),
    import('../../../src/useCases/users/obtener-usuario-por-id.caso-uso.js'),
  ]);
  casos = { actualizar, crear, eliminar, listar, obtener };
});

beforeEach(() => jest.clearAllMocks());

describe('casos de uso de usuarios', () => {
  it('lista sin exponer contraseñas', async () => {
    usuarioRepositorio.buscarTodos.mockResolvedValue([{ id, password: 'secreto', name: 'Ana' }]);
    await expect(casos.listar.ejecutar()).resolves.toEqual([{ id, name: 'Ana' }]);
  });

  it('obtiene por id sin contraseña', async () => {
    usuarioRepositorio.buscarPorId.mockResolvedValue({ id, password: 'secreto' });
    await expect(casos.obtener.ejecutar(id)).resolves.toEqual({ id });
  });

  it('crea usuario con rol activo', async () => {
    const entrada = { email: 'ana@example.com', name: 'Ana', password: '123456789012', rol };
    usuarioRepositorio.buscarPorCorreo.mockResolvedValue(null);
    rolRepositorio.buscarPorId.mockResolvedValue({ isActive: true });
    usuarioRepositorio.crear.mockResolvedValue({ ...entrada, id });
    await expect(casos.crear.ejecutar(entrada)).resolves.toEqual({ email: entrada.email, name: 'Ana', rol, id });
  });

  it('rechaza correo duplicado', async () => {
    usuarioRepositorio.buscarPorCorreo.mockResolvedValue({ id });
    await expect(casos.crear.ejecutar({ email: 'ana@example.com', name: 'Ana', password: '123456789012', rol }))
      .rejects.toMatchObject({ status: 409 });
  });

  it('actualiza sin exponer contraseña', async () => {
    usuarioRepositorio.actualizar.mockResolvedValue({ id, name: 'Nueva', password: 'hash' });
    await expect(casos.actualizar.ejecutar(id, { name: 'Nueva' })).resolves.toEqual({ id, name: 'Nueva' });
  });

  it('desactiva usuario', async () => {
    usuarioRepositorio.desactivar.mockResolvedValue({ id, isActive: false, password: 'hash' });
    await expect(casos.eliminar.ejecutar(id)).resolves.toEqual({ id, isActive: false });
  });
});
