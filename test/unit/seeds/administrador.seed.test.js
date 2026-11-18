import { beforeAll, beforeEach, expect, it, jest } from '@jest/globals';

const buscarUsuario = jest.fn();
const crearUsuario = jest.fn();
const buscarRol = jest.fn();

jest.unstable_mockModule('../../../src/entities/usuario.entidad.js', () => ({
  Usuario: { findOne: buscarUsuario, create: crearUsuario },
}));

jest.unstable_mockModule('../../../src/entities/rol.entidad.js', () => ({
  Rol: { findOne: buscarRol },
}));

let sembrarAdministrador;

beforeAll(async () => {
  ({ sembrarAdministrador } = await import('../../../src/seeds/administrador.seed.js'));
});

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.ADMIN_NAME;
  delete process.env.ADMIN_EMAIL;
  delete process.env.ADMIN_PASSWORD;
});

const configurarAdministrador = () => {
  process.env.ADMIN_NAME = 'Administrador inicial';
  process.env.ADMIN_EMAIL = 'ADMIN@TASKFLOW.TEST';
  process.env.ADMIN_PASSWORD = 'contrasena-segura';
};

it('omite el seed si faltan variables del administrador', async () => {
  await expect(sembrarAdministrador()).resolves.toBeNull();
  expect(buscarUsuario).not.toHaveBeenCalled();
  expect(crearUsuario).not.toHaveBeenCalled();
});

it('crea el administrador inicial con su rol', async () => {
  configurarAdministrador();
  const rol = { _id: 'rol-administrador' };
  const usuario = { _id: 'usuario-administrador' };
  buscarUsuario.mockResolvedValue(null);
  buscarRol.mockResolvedValue(rol);
  crearUsuario.mockResolvedValue(usuario);

  await expect(sembrarAdministrador()).resolves.toBe(usuario);

  expect(buscarUsuario).toHaveBeenCalledWith({ email: 'admin@taskflow.test' });
  expect(buscarRol).toHaveBeenCalledWith({ name: 'Administrador' });
  expect(crearUsuario).toHaveBeenCalledWith({
    name: 'Administrador inicial',
    email: 'ADMIN@TASKFLOW.TEST',
    password: 'contrasena-segura',
    rol: 'rol-administrador',
  });
});

it('no duplica un administrador existente', async () => {
  configurarAdministrador();
  const usuario = { _id: 'usuario-existente' };
  buscarUsuario.mockResolvedValue(usuario);

  await expect(sembrarAdministrador()).resolves.toBe(usuario);
  expect(buscarRol).not.toHaveBeenCalled();
  expect(crearUsuario).not.toHaveBeenCalled();
});

it('falla si no existe el rol Administrador', async () => {
  configurarAdministrador();
  buscarUsuario.mockResolvedValue(null);
  buscarRol.mockResolvedValue(null);

  await expect(sembrarAdministrador()).rejects.toThrow('No existe el rol Administrador');
  expect(crearUsuario).not.toHaveBeenCalled();
});
