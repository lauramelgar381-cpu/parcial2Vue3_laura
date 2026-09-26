import request from 'supertest';
import '../tests/setup.js';
import app from '../src/app.js';
import { prisma } from '../src/config/db.js';

describe('Pacientes', () => {
  let token;
  let pacienteId;

  const usuarioTest = {
    nombre: 'Test Pacientes',
    email: 'test.pacientes@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: usuarioTest.email } });
    const res = await request(app).post('/api/register').send(usuarioTest);
    token = res.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: usuarioTest.email } });
    if (pacienteId) {
      await prisma.paciente.deleteMany({ where: { id: pacienteId } });
    }
    await prisma.$disconnect();
  });

  it('debe rechazar acceso sin token', async () => {
    const res = await request(app).get('/api/pacientes');
    expect(res.statusCode).toBe(401);
  });

  it('debe crear un paciente con token válido', async () => {
    const res = await request(app)
      .post('/api/pacientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Paciente Test',
        email: 'paciente.test@example.com',
        telefono: '70001234',
        fechaNacimiento: '1990-01-01',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Paciente Test');
    pacienteId = res.body.id;
  });

  it('debe listar pacientes con token válido', async () => {
    const res = await request(app)
      .get('/api/pacientes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debe actualizar un paciente existente', async () => {
    const res = await request(app)
      .put(`/api/pacientes/${pacienteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Paciente Actualizado' });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Paciente Actualizado');
  });

  it('debe devolver 404 al obtener un paciente inexistente', async () => {
    const res = await request(app)
      .get('/api/pacientes/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it('debe eliminar un paciente existente', async () => {
    const res = await request(app)
      .delete(`/api/pacientes/${pacienteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
    pacienteId = null; // ya no hace falta limpiarlo en afterAll
  });
});