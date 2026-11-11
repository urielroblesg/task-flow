import { Schema, SchemaTypes, model } from 'mongoose';

import validator from 'validator';

export const userSchema = new Schema({
  name: {
    type: SchemaTypes.String,
    trim: true,
    required: true,
    maxlength: 120,
  },
  email : {
    type: SchemaTypes.String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Por favor, introduce un correo electrónico válido',
    },
  },
  password: {
    type: SchemaTypes.String,
    trim: true,
    required: true,
  },
  rol: {
    type: SchemaTypes.ObjectId,
    ref: 'Rol',
    required: [true, 'El rol es obligatorio'],
  },
  isActive: {
    type: SchemaTypes.Boolean,
    default: true,
  },
  createdAt: {
    type: SchemaTypes.Date,
    default: Date.now,
  },
});

export const Usuario = model('usuario', userSchema);
