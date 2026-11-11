import { expect, it, jest } from '@jest/globals';

const listen = jest.fn((_puerto, callback) => callback());
const sembrarRoles = jest.fn();

jest.unstable_mockModule('../../src/app.js', () => ({ default: { listen } }));
jest.unstable_mockModule('../../src/config/database.js', () => ({ conectarBd: jest.fn() }));
jest.unstable_mockModule('../../src/seeds/roles.seed.js', () => ({ sembrarRoles }));

it('inicia aplicación en puerto configurado', async () => {
  process.env.PORT = '4321';
  jest.spyOn(console, 'log').mockImplementation(() => {});
  await import('../../src/server.js');
  expect(sembrarRoles).toHaveBeenCalledTimes(1);
  expect(listen).toHaveBeenCalledWith('4321', expect.any(Function));
  expect(console.log).toHaveBeenCalledWith('TaskFlow listo en http://localhost:4321. MongoDB conectado.');
  console.log.mockRestore();
  delete process.env.PORT;
});
