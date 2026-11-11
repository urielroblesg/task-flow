import { Router as Enrutador } from 'express';

import * as controladorTarea from '../controllers/tarea.controlador.js';

const enrutador = Enrutador();

enrutador.get('/', controladorTarea.listar);
enrutador.get('/:id', controladorTarea.obtenerPorId);
enrutador.post('/', controladorTarea.crear);
enrutador.patch('/:id', controladorTarea.actualizar);
enrutador.delete('/:id', controladorTarea.eliminar);

export default enrutador;
