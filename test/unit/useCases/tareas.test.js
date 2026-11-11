import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

const repositorio = {
  actualizar: jest.fn(), buscarPorId: jest.fn(), buscarTodas: jest.fn(), crear: jest.fn(), eliminar: jest.fn(),
};
jest.unstable_mockModule('../../../src/repositories/tarea.repositorio.js', () => repositorio);

let actualizar;
let crear;
let eliminar;
let listar;
let obtener;
const ID = '507f1f77bcf86cd799439011';

beforeAll(async () => {
  [actualizar, crear, eliminar, listar, obtener] = await Promise.all([
    import('../../../src/useCases/tasks/actualizar-tarea.caso-uso.js'),
    import('../../../src/useCases/tasks/crear-tarea.caso-uso.js'),
    import('../../../src/useCases/tasks/eliminar-tarea.caso-uso.js'),
    import('../../../src/useCases/tasks/listar-tareas.caso-uso.js'),
    import('../../../src/useCases/tasks/obtener-tarea-por-id.caso-uso.js'),
  ]);
});

beforeEach(() => jest.clearAllMocks());

describe('casos de uso de tareas', () => {
  it('crea usando solo campos permitidos', async () => {
    repositorio.crear.mockResolvedValue({ id: ID, title: 'Nueva' });
    await expect(crear.ejecutar({ title: 'Nueva' })).resolves.toMatchObject({ id: ID });
    expect(repositorio.crear).toHaveBeenCalledWith({ title: 'Nueva' });
  });

  it('rechaza campos no permitidos', async () => {
    await expect(crear.ejecutar({ ownerId: ID, title: 'Nueva' })).rejects.toMatchObject({ status: 400 });
  });

  it('valida filtro de estado', async () => {
    repositorio.buscarTodas.mockResolvedValue(['tarea']);
    await expect(listar.ejecutar({ status: 'pending' })).resolves.toEqual(['tarea']);
    await expect(listar.ejecutar({ status: 'otro' })).rejects.toMatchObject({ status: 400 });
  });

  it('obtiene por ObjectId y genera 404', async () => {
    repositorio.buscarPorId.mockResolvedValueOnce({ id: ID }).mockResolvedValueOnce(null);
    await expect(obtener.ejecutar(ID)).resolves.toEqual({ id: ID });
    await expect(obtener.ejecutar(ID)).rejects.toMatchObject({ status: 404 });
  });

  it('rechaza identificador inválido', async () => {
    await expect(obtener.ejecutar('abc')).rejects.toMatchObject({ status: 400 });
  });

  it('actualiza tarea existente', async () => {
    repositorio.actualizar.mockResolvedValue({ id: ID, status: 'done' });
    await expect(actualizar.ejecutar(ID, { status: 'done' })).resolves.toMatchObject({ status: 'done' });
  });

  it('rechaza actualización vacía', async () => {
    await expect(actualizar.ejecutar(ID, {})).rejects.toMatchObject({ status: 400 });
  });

  it('elimina tarea existente', async () => {
    repositorio.eliminar.mockResolvedValue({ id: ID });
    await expect(eliminar.ejecutar(ID)).resolves.toEqual({ id: ID });
  });
});
