import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';
import { generarToken } from '../utils/jwt.js';

export async function registrar(req, res) {
  const { nombre, email, password } = req.body;

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { nombre, email, password: hash },
  });

  const token = generarToken({ id: user.id, email: user.email });
  res.status(201).json({ user: { id: user.id, nombre: user.nombre, email: user.email }, token });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const valido = await bcrypt.compare(password, user.password);
  if (!valido) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = generarToken({ id: user.id, email: user.email });
  res.json({ user: { id: user.id, nombre: user.nombre, email: user.email }, token });
}

export function logout(req, res) {
  // Con JWT stateless no hay invalidación server-side sin una tabla de blacklist;
  // el logout real ocurre en el cliente descartando el token
  res.json({ mensaje: 'Sesión cerrada correctamente' });
}