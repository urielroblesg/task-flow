import { checkSchema } from 'express-validator';

export const reglasTarea = checkSchema({
  title: {
    trim: true,
    notEmpty: { errorMessage: 'El título es obligatorio' },
  },
  description: {
    optional: true,
    isString: { errorMessage: 'La descripción debe ser texto' },
  },
  status: {
    optional: true,
    isIn: {
      options: [['pending', 'in_progress', 'done']],
      errorMessage: 'El estado no es válido',
    },
  },
  priority: {
    optional: true,
    isIn: {
      options: [['low', 'medium', 'high']],
      errorMessage: 'La prioridad no es válida',
    },
  },
});
