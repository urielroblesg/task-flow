import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

const Task = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

jest.unstable_mockModule('../../../src/entities/tarea.entidad.js', () => ({ Task }));

let repositorio;
const documento = datos => ({ toObject: () => ({ __v: 0, _id: '507f1f77bcf86cd799439011', ...datos }) });

beforeAll(async () => {
  repositorio = await import('../../../src/repositories/tarea.repositorio.js');
});

beforeEach(() => jest.clearAllMocks());

describe('repositorio de tareas', () => {
  it('lista y mapea documentos', async () => {
    Task.find.mockResolvedValue([documento({ title: 'Probar' })]);
    await expect(repositorio.buscarTodas({ status: 'pending' })).resolves.toEqual([
      { id: '507f1f77bcf86cd799439011', title: 'Probar' },
    ]);
    expect(Task.find).toHaveBeenCalledWith({ status: 'pending' });
  });

  it('busca por id', async () => {
    Task.findById.mockResolvedValue(documento({ title: 'Probar' }));
    await expect(repositorio.buscarPorId('507f1f77bcf86cd799439011'))
      .resolves.toMatchObject({ id: '507f1f77bcf86cd799439011' });
  });

  it('crea y mapea documento', async () => {
    Task.create.mockResolvedValue(documento({ title: 'Nueva' }));
    await expect(repositorio.crear({ title: 'Nueva' }))
      .resolves.toMatchObject({ id: '507f1f77bcf86cd799439011', title: 'Nueva' });
  });

  it('actualiza con validadores y devuelve DTO', async () => {
    Task.findByIdAndUpdate.mockResolvedValue(documento({ status: 'done' }));
    await expect(repositorio.actualizar('507f1f77bcf86cd799439011', { status: 'done' }))
      .resolves.toMatchObject({ id: '507f1f77bcf86cd799439011', status: 'done' });
    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      { $set: { status: 'done' } },
      { returnDocument: 'after', runValidators: true },
    );
  });

  it('elimina y devuelve null cuando no existe', async () => {
    Task.findByIdAndDelete.mockResolvedValue(null);
    await expect(repositorio.eliminar('507f1f77bcf86cd799439011')).resolves.toBeNull();
  });
});
