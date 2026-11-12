import { Schema, SchemaTypes, model } from 'mongoose';

import validator from 'validator';
import bcrypt from 'bcrypt';

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
    validate: {
      /** @param {unknown} valor @returns {boolean} */
      validator: valor => typeof valor === 'string' && valor.length >= 12,
      message: 'La contraseña: minimo 12 caracteres',
    },
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

/** Cifra contraseña modificada antes de guardar. @returns {Promise<void>} */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

export const Usuario = model('usuario', userSchema);
