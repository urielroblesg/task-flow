import { Router as Enrutador } from 'express';
import * as controladorUsuario from '../controllers/usuario.controlador.js';
import { autenticarJwt } from '../middlewares/autenticar.jwt.js';
import { isAdministrador } from '../middlewares/is-administrador.js';

const enrutador = Enrutador();
enrutador.use(autenticarJwt, isAdministrador);
enrutador.get('/', controladorUsuario.listar);
enrutador.get('/:id', controladorUsuario.obtenerPorId);
enrutador.post('/', controladorUsuario.crear);
enrutador.patch('/:id', controladorUsuario.actualizar);
enrutador.delete('/:id', controladorUsuario.eliminar);

export default enrutador;
