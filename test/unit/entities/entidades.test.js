import { describe, expect, it } from '@jest/globals';

import { Task } from '../../../src/entities/tarea.entidad.js';
import { Rol } from '../../../src/entities/rol.entidad.js';
import { Usuario, userSchema } from '../../../src/entities/usuario.entidad.js';

describe('Task', () => {
  it('aplica valores predeterminados y limpia título', async () => {
    const tarea = new Task({ title: '  Probar  ' });
    await expect(tarea.validate()).resolves.toBeUndefined();
    expect(tarea).toMatchObject({ description: '', priority: 'medium', status: 'pending', title: 'Probar' });
  });

  it('rechaza título vacío y estado inválido', async () => {
    await expect(new Task({ status: 'otro', title: ' ' }).validate()).rejects.toMatchObject({
      name: 'ValidationError',
    });
  });
});

describe('Usuario', () => {
  const rolId = '507f1f77bcf86cd799439011';

  it('aplica valores predeterminados', async () => {
    const usuario = new Usuario({ email: 'a@b.com', name: 'Ana', password: '12345678', rol: rolId });
    await expect(usuario.validate()).resolves.toBeUndefined();
    expect(usuario).toMatchObject({
      createdAt: expect.any(Date),
      email: 'a@b.com',
      isActive: true,
      name: 'Ana',
      password: '12345678',
    });
    expect(String(usuario.rol)).toBe(rolId);
  });

  it('conserva valores proporcionados', async () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const usuario = new Usuario({ createdAt, email: 'a@b.com', isActive: false, name: 'Ana', password: 'clave', rol: rolId });
    await expect(usuario.validate()).resolves.toBeUndefined();
    expect(usuario).toMatchObject({ createdAt, email: 'a@b.com', isActive: false, name: 'Ana', password: 'clave' });
    expect(String(usuario.rol)).toBe(rolId);
  });

  it('define una referencia obligatoria al modelo Rol', () => {
    expect(userSchema.path('rol').options).toMatchObject({ ref: 'Rol', required: expect.any(Array) });
  });
});

describe('Rol', () => {
  it('aplica valores predeterminados y limpia campos', async () => {
    const rol = new Rol({ description: '  Usuario estándar  ', name: '  Cliente  ' });
    await expect(rol.validate()).resolves.toBeUndefined();
    expect(rol).toMatchObject({ description: 'Usuario estándar', isActive: true, name: 'Cliente' });
  });

  it('requiere nombre', async () => {
    await expect(new Rol({}).validate()).rejects.toMatchObject({ name: 'ValidationError' });
  });
});
