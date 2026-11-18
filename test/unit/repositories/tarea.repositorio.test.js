import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

const Task = {
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

jest.unstable_mockModule('../../../src/entities/tarea.entidad.js', () => ({ Task }));

let repositorio;
const documento = datos => ({ toObject: () => ({ __v: 0, _id: '507f1f77bcf86cd799439011', ...datos }) });
const PROPIETARIO = '507f191e810c19729de860ea';

beforeAll(async () => {
  repositorio = await import('../../../src/repositories/tarea.repositorio.js');
});

beforeEach(() => jest.clearAllMocks());

describe('repositorio de tareas', () => {
  it('lista y mapea documentos', async () => {
    Task.find.mockResolvedValue([documento({ title: 'Probar' })]);
    await expect(repositorio.buscarTodas({ status: 'pending' }, PROPIETARIO)).resolves.toEqual([
      { id: '507f1f77bcf86cd799439011', title: 'Probar' },
    ]);
    expect(Task.find).toHaveBeenCalledWith({ status: 'pending', propietario: PROPIETARIO });
  });

  it('busca por id', async () => {
    Task.findOne.mockResolvedValue(documento({ title: 'Probar' }));
    await expect(repositorio.buscarPorId('507f1f77bcf86cd799439011', PROPIETARIO))
      .resolves.toMatchObject({ id: '507f1f77bcf86cd799439011' });
    expect(Task.findOne).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011', propietario: PROPIETARIO });
  });

  it('crea y mapea documento', async () => {
    Task.create.mockResolvedValue(documento({ title: 'Nueva' }));
    await expect(repositorio.crear({ title: 'Nueva' }))
      .resolves.toMatchObject({ id: '507f1f77bcf86cd799439011', title: 'Nueva' });
  });

  it('actualiza con validadores y devuelve DTO', async () => {
    Task.findOneAndUpdate.mockResolvedValue(documento({ status: 'done' }));
    await expect(repositorio.actualizar('507f1f77bcf86cd799439011', { status: 'done' }, PROPIETARIO))
      .resolves.toMatchObject({ id: '507f1f77bcf86cd799439011', status: 'done' });
    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '507f1f77bcf86cd799439011', propietario: PROPIETARIO },
      { $set: { status: 'done' } },
      { returnDocument: 'after', runValidators: true },
    );
  });

  it('elimina y devuelve null cuando no existe', async () => {
    Task.findOneAndDelete.mockResolvedValue(null);
    await expect(repositorio.eliminar('507f1f77bcf86cd799439011', PROPIETARIO)).resolves.toBeNull();
    expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011', propietario: PROPIETARIO });
  });
});
