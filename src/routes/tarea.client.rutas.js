import path from 'node:path';

import { Router } from 'express';

const directorioPublico = path.join(process.cwd(), 'public');

const router = Router();

router.get('/', (req, res) => {
  res.sendFile('tareas.html', {
    dotfiles: 'deny',
    root: path.join(directorioPublico, 'views'),
  });
});

export default router;