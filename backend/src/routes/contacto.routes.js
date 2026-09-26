import { Router } from 'express';
import { enviarContacto } from '../controllers/contacto.controller.js';
import { validar } from '../middlewares/validate.middleware.js';
import { contactoSchema } from '../schemas/contacto.schema.js';

const router = Router();

/**
 * @openapi
 * /contacto:
 *   post:
 *     tags: [Contacto]
 *     summary: Enviar mensaje de contacto
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, mensaje]
 *             properties:
 *               email: { type: string }
 *               mensaje: { type: string }
 *     responses:
 *       200: { description: Correo enviado }
 *       400: { description: Datos inválidos }
 *       500: { description: Error al enviar el correo }
 */
router.post('/', validar(contactoSchema), enviarContacto);

export default router;