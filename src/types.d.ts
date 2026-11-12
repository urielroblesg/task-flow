import type { Types } from 'mongoose';

export type Id = string | Types.ObjectId;

export interface TareaEntrada {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  ownerId?: Id;
}

export interface Tarea extends TareaEntrada {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UsuarioEntrada {
  name: string;
  email: string;
  password: string;
  rol?: Id;
}

export interface Usuario extends UsuarioEntrada {
  id: string;
  rol: Id;
  isActive: boolean;
}

export type UsuarioPublico = Omit<Usuario, 'password'>;

export interface Rol {
  _id: Types.ObjectId;
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Credenciales {
  email: string;
  password: string;
}

export interface Sesion {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  usuario: UsuarioPublico;
}

export interface JwtPayloadTaskFlow {
  rol: string;
  sub?: string;
  iat?: number;
  exp?: number;
}
