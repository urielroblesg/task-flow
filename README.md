# TaskFlow

TaskFlow es una API educativa para administrar tareas y practicar autenticación. El proyecto muestra cómo separar una aplicación de Express en componentes pequeños, cada uno con una responsabilidad clara.

Las tareas, los usuarios y los roles se guardan en MongoDB mediante Mongoose.

## ¿Qué se aprende con este proyecto?

- Crear una API REST con Express.
- Organizar el código por capas.
- Validar datos recibidos por HTTP.
- Guardar y consultar documentos en MongoDB.
- Manejar errores de forma centralizada.
- Escribir pruebas automatizadas con Jest.

## Requisitos

- Node.js 22.12 o posterior.
- MongoDB Atlas o una instancia local de MongoDB.

## Instalación

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` como `.env.dev` y configurar las variables:

   ```env
   PORT=3000
   FRONTEND_ORIGIN=http://127.0.0.1:5500
   MONGO_DB_URI=mongodb+srv://USUARIO:CLAVE@CLUSTER/taskflow
   ```

3. Iniciar el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir `http://localhost:3000` o consultar `http://localhost:3000/api/health`.

> No publiques archivos `.env`, credenciales ni cadenas de conexión reales.

## Componentes principales

| Componente | Función |
| --- | --- |
| `src/server.js` | Conecta MongoDB, crea los roles iniciales e inicia el servidor. |
| `src/app.js` | Configura Express, middlewares, archivos públicos y rutas. |
| `src/routes/` | Relaciona cada método y URL con un controlador. |
| `src/middlewares/` | Valida solicitudes y transforma errores en respuestas HTTP. |
| `src/controllers/` | Lee la solicitud, ejecuta un caso de uso y construye la respuesta. |
| `src/useCases/` | Contiene las reglas y acciones propias del negocio. |
| `src/repositories/` | Lee y modifica información almacenada en MongoDB. |
| `src/entities/` | Define la forma y las restricciones de los documentos. |
| `src/config/` | Contiene la conexión con servicios externos, como MongoDB. |
| `src/seeds/` | Agrega datos iniciales necesarios para usar el sistema. |
| `src/utils/` | Reúne utilidades pequeñas compartidas por varias capas. |
| `public/` | Contiene la página y los recursos estáticos. |
| `test/` | Contiene solicitudes manuales y pruebas automatizadas. |
| `docs/` | Incluye explicaciones adicionales para estudiar el proyecto. |

Consulta [`docs/arquitectura.md`](docs/arquitectura.md) para ver el recorrido completo de una solicitud y la responsabilidad de cada archivo.

## Flujo básico de una solicitud

Cuando un cliente crea una tarea, la solicitud sigue este recorrido:

```text
POST /api/v1/tasks
        |
        v
ruta -> controlador -> caso de uso -> repositorio -> MongoDB
        ^                                      |
        +------------ respuesta ---------------+
```

Cada capa hace sólo una parte del trabajo. Así resulta más sencillo entender, probar y modificar el proyecto.

## Rutas disponibles

### Información general

- `GET /`: muestra la página principal.
- `GET /api/health`: comprueba que la aplicación responde.
- `GET /api/info`: muestra nombre, versión y descripción del sistema.

### Tareas

- `GET /api/v1/tasks`: lista las tareas.
- `GET /api/v1/tasks?status=pending`: filtra tareas por estado.
- `GET /api/v1/tasks/:id`: obtiene una tarea.
- `POST /api/v1/tasks`: crea una tarea.
- `PATCH /api/v1/tasks/:id`: actualiza una tarea.
- `DELETE /api/v1/tasks/:id`: elimina una tarea.

Estados principales: `200` para consultas y actualizaciones, `201` al crear, `204` al eliminar, `400` para datos inválidos y `404` cuando la tarea no existe.

### Autenticación

- `POST /api/v1/auth/registro`: registra un usuario.
- `POST /api/v1/auth/login`: comprueba sus credenciales.
- `POST /api/v1/auth/logout`: representa el cierre de sesión.

> La autenticación es una demostración educativa. No crea todavía una sesión ni un token. Las contraseñas se almacenan como texto plano. Una aplicación real debe usar hashing seguro y un mecanismo de sesión o tokens.

## Comandos útiles

| Comando | Función |
| --- | --- |
| `npm run dev` | Inicia el servidor y lo reinicia al cambiar el código. |
| `npm start` | Inicia el servidor usando `.env`. |
| `npm test` | Ejecuta las pruebas automatizadas. |
| `npm run test:coverage` | Ejecuta pruebas y genera reporte de cobertura. |
| `npm run test:watch` | Repite las pruebas cuando cambia un archivo. |
| `npm run lint` | Revisa estilo y errores comunes del código. |
| `npm run lint:fix` | Corrige automáticamente problemas de estilo compatibles. |

## Pruebas

Las pruebas manuales están en archivos compatibles con clientes HTTP:

- `test/health.http`
- `test/tasks.http`
- `test/auth.http`

Las pruebas automatizadas están dentro de `test/unit/` y se ejecutan con:

```bash
npm test
```

## Comprobar la persistencia

1. Crear una tarea con `POST /api/v1/tasks` y guardar su `id`.
2. Detener Node.js.
3. Iniciar nuevamente con `npm run dev`.
4. Consultar el mismo `id` con `GET /api/v1/tasks/:id`.

La tarea sigue disponible porque MongoDB conserva el documento aunque el servidor se reinicie.
