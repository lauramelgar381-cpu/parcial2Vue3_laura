import { Router } from 'express';
import { registrar, login, logout } from '../controllers/auth.controller.js';
import { validar } from '../middlewares/validate.middleware.js';
import { registroSchema, loginSchema } from '../schemas/auth.schema.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un nuevo usuario
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: Usuario creado }
 *       409: { description: Email ya registrado }
 */
router.post('/register', validar(registroSchema), registrar);

/**
 * @openapi
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login exitoso }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', validar(loginSchema), login);

/**
 * @openapi
 * /logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión
 *     responses:
 *       200: { description: Sesión cerrada }
 */
router.post('/logout', autenticar, logout);

export default router;