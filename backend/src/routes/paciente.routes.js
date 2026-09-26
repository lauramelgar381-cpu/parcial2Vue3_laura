import { Router } from 'express';
import * as ctrl from '../controllers/paciente.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';
import { validar } from '../middlewares/validate.middleware.js';
import { pacienteSchema, pacienteUpdateSchema } from '../schemas/paciente.schema.js';

const router = Router();
/**
 * @openapi
 * /pacientes:
 *   get:
 *     tags: [Pacientes]
 *     summary: Listar todos los pacientes
 *     responses:
 *       200: { description: Lista de pacientes }
 *   post:
 *     tags: [Pacientes]
 *     summary: Crear un paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, telefono, fechaNacimiento]
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string }
 *               telefono: { type: string }
 *               fechaNacimiento: { type: string, format: date }
 *               historialMedico: { type: string }
 *     responses:
 *       201: { description: Paciente creado }
 *
 * /pacientes/{id}:
 *   get:
 *     tags: [Pacientes]
 *     summary: Obtener un paciente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paciente encontrado }
 *       404: { description: No encontrado }
 *   put:
 *     tags: [Pacientes]
 *     summary: Actualizar un paciente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Paciente actualizado }
 *   delete:
 *     tags: [Pacientes]
 *     summary: Eliminar un paciente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Eliminado }
 */

router.use(autenticar);


router.get('/', ctrl.listarPacientes);
router.get('/:id', ctrl.obtenerPaciente);
router.post('/', validar(pacienteSchema), ctrl.crearPaciente);
router.put('/:id', validar(pacienteUpdateSchema), ctrl.actualizarPaciente);
router.delete('/:id', ctrl.eliminarPaciente);

export default router;