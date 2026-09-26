import request from 'supertest';
import '../tests/setup.js';
import app from '../src/app.js';
import { prisma } from '../src/config/db.js';

describe('Autenticación', () => {
  const usuarioTest = {
    nombre: 'Test Usuario',
    email: 'test.auth@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    // Limpia cualquier usuario de prueba previo
    await prisma.user.deleteMany({ where: { email: usuarioTest.email } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: usuarioTest.email } });
    await prisma.$disconnect();
  });

  it('debe registrar un nuevo usuario', async () => {
    const res = await request(app).post('/api/register').send(usuarioTest);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(usuarioTest.email);
  });

  it('no debe permitir registrar un email duplicado', async () => {
    const res = await request(app).post('/api/register').send(usuarioTest);

    expect(res.statusCode).toBe(409);
  });

  it('debe rechazar login con credenciales inválidas', async () => {
    const res = await request(app).post('/api/login').send({
      email: usuarioTest.email,
      password: 'contraseñaIncorrecta',
    });

    expect(res.statusCode).toBe(401);
  });

  it('debe validar formato de email en registro', async () => {
    const res = await request(app).post('/api/register').send({
      nombre: 'Test',
      email: 'no-es-un-email',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
  });
});