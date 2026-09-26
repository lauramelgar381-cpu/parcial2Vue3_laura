import { Router } from 'express';
import * as ctrl from '../controllers/cita.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';
import { validar } from '../middlewares/validate.middleware.js';
import { citaSchema, citaUpdateSchema } from '../schemas/cita.schema.js';

const router = Router();
/**
 * @openapi
 * /citas:
 *   get:
 *     tags: [Citas]
 *     summary: Listar todas las citas
 *     responses:
 *       200: { description: Lista de citas }
 *   post:
 *     tags: [Citas]
 *     summary: Crear una cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pacienteId, doctorId, fechaCita]
 *             properties:
 *               pacienteId: { type: integer }
 *               doctorId: { type: integer }
 *               fechaCita: { type: string, format: date-time }
 *               estado: { type: string, enum: [PENDIENTE, CONFIRMADA, CANCELADA, REPROGRAMADA] }
 *               notas: { type: string }
 *     responses:
 *       201: { description: Cita creada }
 *
 * /citas/{id}:
 *   get:
 *     tags: [Citas]
 *     summary: Obtener una cita por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cita encontrada }
 *       404: { description: No encontrada }
 *   put:
 *     tags: [Citas]
 *     summary: Actualizar una cita
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cita actualizada }
 *   delete:
 *     tags: [Citas]
 *     summary: Eliminar una cita
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Eliminado }
 */
router.use(autenticar);

router.get('/', ctrl.listarCitas);
router.get('/:id', ctrl.obtenerCita);
router.post('/', validar(citaSchema), ctrl.crearCita);
router.put('/:id', validar(citaUpdateSchema), ctrl.actualizarCita);
router.delete('/:id', ctrl.eliminarCita);

export default router;