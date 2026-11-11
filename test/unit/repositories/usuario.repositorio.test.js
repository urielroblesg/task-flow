import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

const Usuario = {
  create: jest.fn(),
  findOne: jest.fn(),
};

jest.unstable_mockModule('../../../src/entities/usuario.entidad.js', () => ({ Usuario }));

let repositorio;
const documento = datos => ({
  toObject: () => ({ __v: 0, _id: '507f1f77bcf86cd799439011', ...datos }),
});

beforeAll(async () => {
  repositorio = await import('../../../src/repositories/usuario.repositorio.js');
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('repositorio de usuarios', () => {
  it('busca usuario por correo', async () => {
    Usuario.findOne.mockResolvedValue(documento({ email: 'ana@example.com', password: 'secreto12' }));
    await expect(repositorio.buscarPorCorreo('ana@example.com')).resolves.toEqual({
      email: 'ana@example.com',
      id: '507f1f77bcf86cd799439011',
      password: 'secreto12',
    });
    expect(Usuario.findOne).toHaveBeenCalledWith({ email: 'ana@example.com' });

    Usuario.findOne.mockResolvedValue(null);
    await expect(repositorio.buscarPorCorreo('nadie@example.com')).resolves.toBeNull();
  });

  it('crea usuario mediante el modelo y devuelve DTO', async () => {
    const datos = { email: 'bob@example.com', password: 'secreto12' };
    Usuario.create.mockResolvedValue(documento(datos));
    await expect(repositorio.crear(datos)).resolves.toEqual({
      ...datos,
      id: '507f1f77bcf86cd799439011',
    });
    expect(Usuario.create).toHaveBeenCalledWith(datos);
  });
});
