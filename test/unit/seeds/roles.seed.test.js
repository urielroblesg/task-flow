import { beforeAll, beforeEach, expect, it, jest } from '@jest/globals';

const bulkWrite = jest.fn();

jest.unstable_mockModule('../../../src/entities/rol.entidad.js', () => ({
  Rol: { bulkWrite },
}));

let sembrarRoles;

beforeAll(async () => {
  ({ sembrarRoles } = await import('../../../src/seeds/roles.seed.js'));
});

beforeEach(() => {
  bulkWrite.mockClear();
});

it('inserta Administrador y Cliente mediante operaciones idempotentes', async () => {
  await sembrarRoles();

  expect(bulkWrite).toHaveBeenCalledWith([
    expect.objectContaining({
      updateOne: expect.objectContaining({ filter: { name: 'Administrador' }, upsert: true }),
    }),
    expect.objectContaining({
      updateOne: expect.objectContaining({ filter: { name: 'Cliente' }, upsert: true }),
    }),
  ]);
  for (const { updateOne } of bulkWrite.mock.calls[0][0]) {
    expect(updateOne.update).toHaveProperty('$setOnInsert');
  }
});
