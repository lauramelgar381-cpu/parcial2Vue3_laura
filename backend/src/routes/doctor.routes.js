import { Router } from 'express';
import * as ctrl from '../controllers/doctor.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';
import { validar } from '../middlewares/validate.middleware.js';
import { doctorSchema, doctorUpdateSchema } from '../schemas/doctor.schema.js';

const router = Router();
/**
 * @openapi
 * /doctores:
 *   get:
 *     tags: [Doctores]
 *     summary: Listar todos los doctores
 *     responses:
 *       200: { description: Lista de doctores }
 *   post:
 *     tags: [Doctores]
 *     summary: Crear un doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, especialidad, telefono]
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string }
 *               especialidad: { type: string }
 *               telefono: { type: string }
 *               cualificaciones: { type: string }
 *     responses:
 *       201: { description: Doctor creado }
 * 
 * /doctores/{id}:
 *   get:
 *     tags: [Doctores]
 *     summary: Obtener un doctor por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Doctor encontrado }
 *       404: { description: No encontrado }
 *   put:
 *     tags: [Doctores]
 *     summary: Actualizar un doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Doctor actualizado }
 *   delete:
 *     tags: [Doctores]
 *     summary: Eliminar un doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Eliminado }
 */
router.use(autenticar);

router.get('/', ctrl.listarDoctores);
router.get('/:id', ctrl.obtenerDoctor);
router.post('/', validar(doctorSchema), ctrl.crearDoctor);
router.put('/:id', validar(doctorUpdateSchema), ctrl.actualizarDoctor);
router.delete('/:id', ctrl.eliminarDoctor);

export default router;