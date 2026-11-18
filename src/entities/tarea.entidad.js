import { Schema, SchemaTypes, model } from 'mongoose';

const taskSchema = new Schema({
  title : { type: SchemaTypes.String, required: true, trim: true, maxlength: 120 },
  description: { type: SchemaTypes.String, default: '', maxlength: 1000 },
  status: {
    type: SchemaTypes.String,
    enum: ['pending', 'in_progress', 'done'],
    default: 'pending',
  },
  priority: {
    type: SchemaTypes.String, enum: ['low', 'medium', 'high'], default: 'medium',
  },
  propietario: { type: SchemaTypes.ObjectId, index: true, ref: 'Usuario', required: true },
}, {
  timestamps: true, collection: 'tasks',
});

export const Task = model('Task', taskSchema);
