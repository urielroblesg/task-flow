import aplicacion from './app.js';

import { conectarBd } from './config/database.js';
import { sembrarRoles } from './seeds/roles.seed.js';
import { validarEntorno } from './config/env.js';
import { Usuario } from './entities/usuario.entidad.js';
import { Rol } from './entities/rol.entidad.js';

const PUERTO = process.env.PORT || 3000;
try {
  validarEntorno();
  await conectarBd();
  await Promise.all([Usuario.init(), Rol.init()]);
  await sembrarRoles();
  aplicacion.listen(PUERTO, '0.0.0.0', () => console.log('TaskFlow listo. MongoDB conectado.'));
} catch (error) {
  console.error('No se pudo iniciar. Revisa MONGO_DB_URI, permisos, red e IP autorizada.');
  console.error(error);

  process.exitCode = 1;
}
