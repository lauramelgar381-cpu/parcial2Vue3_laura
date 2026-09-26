import request from 'supertest';
import '../tests/setup.js';
import app from '../src/app.js';
import { prisma } from '../src/config/db.js';

describe('Doctores', () => {
  let token;
  let doctorId;

  const usuarioTest = {
    nombre: 'Test Doctores',
    email: 'test.doctores@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: usuarioTest.email } });
    const res = await request(app).post('/api/register').send(usuarioTest);
    token = res.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: usuarioTest.email } });
    if (doctorId) {
      await prisma.doctor.deleteMany({ where: { id: doctorId } });
    }
    await prisma.$disconnect();
  });

  it('debe rechazar acceso sin token', async () => {
    const res = await request(app).get('/api/doctores');
    expect(res.statusCode).toBe(401);
  });

  it('debe crear un doctor con token válido', async () => {
    const res = await request(app)
      .post('/api/doctores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Doctor Test',
        email: 'doctor.test@example.com',
        especialidad: 'Cardiología',
        telefono: '70009999',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Doctor Test');
    doctorId = res.body.id;
  });

  it('no debe permitir un doctor con email duplicado', async () => {
    const res = await request(app)
      .post('/api/doctores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Doctor Duplicado',
        email: 'doctor.test@example.com', // mismo email que el anterior
        especialidad: 'Pediatría',
        telefono: '70001111',
      });

    expect(res.statusCode).toBe(409);
  });

  it('debe listar doctores con token válido', async () => {
    const res = await request(app)
      .get('/api/doctores')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debe obtener un doctor por ID', async () => {
    const res = await request(app)
      .get(`/api/doctores/${doctorId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(doctorId);
  });

  it('debe actualizar un doctor existente', async () => {
    const res = await request(app)
      .put(`/api/doctores/${doctorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ especialidad: 'Neurología' });

    expect(res.statusCode).toBe(200);
    expect(res.body.especialidad).toBe('Neurología');
  });

  it('debe devolver 404 al actualizar un doctor inexistente', async () => {
    const res = await request(app)
      .put('/api/doctores/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ especialidad: 'Dermatología' });

    expect(res.statusCode).toBe(404);
  });

  it('debe eliminar un doctor existente', async () => {
    const res = await request(app)
      .delete(`/api/doctores/${doctorId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
    doctorId = null;
  });
});