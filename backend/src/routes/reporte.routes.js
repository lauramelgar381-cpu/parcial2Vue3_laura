import { Router } from 'express';
import { citasPorEstado, citasPorDoctor } from '../controllers/cita.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();
/**
 * @openapi
 * /reportes/citas-por-estado:
 *   get:
 *     tags: [Reportes]
 *     summary: Obtener el total de citas agrupadas por estado
 *     responses:
 *       200: { description: Conteo de citas por estado }
 *
 * /reportes/citas-por-doctor:
 *   get:
 *     tags: [Reportes]
 *     summary: Obtener el total de citas agrupadas por doctor
 *     responses:
 *       200: { description: Conteo de citas por doctor }
 */
router.use(autenticar);

router.get('/citas-por-estado', citasPorEstado);
router.get('/citas-por-doctor', citasPorDoctor);

export default router;