import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

const repositorio = {
  buscarPorCorreo: jest.fn(),
  crear: jest.fn(),
};
const repositorioRol = {
  buscarPorNombre: jest.fn(),
};

jest.unstable_mockModule('../../../src/repositories/usuario.repositorio.js', () => repositorio);
jest.unstable_mockModule('../../../src/repositories/rol.repositorio.js', () => repositorioRol);

let cerrar;
let iniciar;
let registrar;

beforeAll(async () => {
  [cerrar, iniciar, registrar] = await Promise.all([
    import('../../../src/useCases/auth/cerrar-sesion.caso-uso.js'),
    import('../../../src/useCases/auth/iniciar-sesion.caso-uso.js'),
    import('../../../src/useCases/auth/registrar-usuario.caso-uso.js'),
  ]);
});

beforeEach(() => {
  jest.clearAllMocks();
  repositorioRol.buscarPorNombre.mockResolvedValue({ _id: 'cliente-id' });
});

describe('casos de uso de autenticación', () => {
  it('registra usuario nuevo sin exponer contraseña', async () => {
    repositorio.buscarPorCorreo.mockResolvedValue(null);
    repositorio.crear.mockImplementation(async usuario => ({ ...usuario, id: 1 }));
    const resultado = await registrar.ejecutar({ email: 'ana@example.com', name: 'Ana', password: 'secreto12' });
    expect(resultado).toMatchObject({ email: 'ana@example.com', id: 1, name: 'Ana' });
    expect(resultado).not.toHaveProperty('password');
    expect(repositorio.crear).toHaveBeenCalledWith(expect.objectContaining({ rol: 'cliente-id' }));
  });

  it('ignora el rol recibido y asigna Cliente', async () => {
    repositorio.buscarPorCorreo.mockResolvedValue(null);
    repositorio.crear.mockImplementation(async usuario => ({ ...usuario, id: 1 }));
    await registrar.ejecutar({ email: 'ana@example.com', name: 'Ana', password: 'secreto12', rol: 'administrador-id' });
    expect(repositorio.crear).toHaveBeenCalledWith(expect.objectContaining({ rol: 'cliente-id' }));
  });

  it('rechaza correo registrado', async () => {
    repositorio.buscarPorCorreo.mockResolvedValue({ id: 1 });
    await expect(registrar.ejecutar({ email: 'ana@example.com' })).resolves.toBeNull();
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('rechaza registro cuando no existe el rol Cliente', async () => {
    repositorio.buscarPorCorreo.mockResolvedValue(null);
    repositorioRol.buscarPorNombre.mockResolvedValue(null);
    await expect(registrar.ejecutar({ email: 'ana@example.com' }))
      .rejects.toThrow('No existe el rol Cliente');
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it('inicia sesión con credenciales válidas sin exponer contraseña', async () => {
    repositorio.buscarPorCorreo.mockResolvedValue({ email: 'ana@example.com', id: 1, password: 'secreto12' });
    await expect(iniciar.ejecutar({ email: 'ana@example.com', password: 'secreto12' }))
      .resolves.toEqual({ email: 'ana@example.com', id: 1 });
  });

  it.each([
    [null, 'secreto12'],
    [{ password: 'otra' }, 'secreto12'],
  ])('rechaza credenciales inválidas', async (usuario, password) => {
    repositorio.buscarPorCorreo.mockResolvedValue(usuario);
    await expect(iniciar.ejecutar({ email: 'ana@example.com', password })).resolves.toBeNull();
  });

  it('cierra sesión', async () => {
    await expect(cerrar.ejecutar()).resolves.toEqual({ message: 'Sesión cerrada' });
  });
});
