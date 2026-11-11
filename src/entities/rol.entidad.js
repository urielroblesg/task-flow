import { Schema, SchemaTypes, model } from 'mongoose';

export const rolSchema = new Schema({
  name: {
    type: SchemaTypes.String,
    required: [true, 'El nombre del rol es obligatorio'],
    unique: true,
    trim: true,
    maxlength: 50,
  },
  description: {
    type: SchemaTypes.String,
    default: '',
    trim: true,
    maxlength: 250,
  },
  isActive: {
    type: SchemaTypes.Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'roles',
});

export const Rol = model('Rol', rolSchema);
