import request from 'supertest';
import '../tests/setup.js';
import app from '../src/app.js';
import { prisma } from '../src/config/db.js';

describe('Citas', () => {
  let token;
  let pacienteId;
  let doctorId;

  const usuarioTest = {
    nombre: 'Test Citas',
    email: 'test.citas@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: usuarioTest.email } });
    const resAuth = await request(app).post('/api/register').send(usuarioTest);
    token = resAuth.body.token;

    const resPaciente = await request(app)
      .post('/api/pacientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Paciente Cita Test',
        email: 'paciente.cita@example.com',
        telefono: '70001234',
        fechaNacimiento: '1990-01-01',
      });
    pacienteId = resPaciente.body.id;

    const resDoctor = await request(app)
      .post('/api/doctores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Doctor Cita Test',
        email: 'doctor.cita@example.com',
        especialidad: 'General',
        telefono: '70005678',
      });
    doctorId = resDoctor.body.id;
  });

  afterAll(async () => {
    await prisma.cita.deleteMany({ where: { pacienteId } });
    await prisma.paciente.deleteMany({ where: { id: pacienteId } });
    await prisma.doctor.deleteMany({ where: { id: doctorId } });
    await prisma.user.deleteMany({ where: { email: usuarioTest.email } });
    await prisma.$disconnect();
  });

  it('debe rechazar una cita con fecha en el pasado', async () => {
    const res = await request(app)
      .post('/api/citas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        pacienteId,
        doctorId,
        fechaCita: '2020-01-01T10:00:00Z',
      });

    expect(res.statusCode).toBe(400);
  });

  it('debe crear una cita con fecha futura válida', async () => {
    const res = await request(app)
      .post('/api/citas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        pacienteId,
        doctorId,
        fechaCita: '2027-01-01T10:00:00Z',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.estado).toBe('PENDIENTE');
  });

  it('debe rechazar una cita con pacienteId inexistente', async () => {
    const res = await request(app)
      .post('/api/citas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        pacienteId: 999999,
        doctorId,
        fechaCita: '2027-01-01T10:00:00Z',
      });

    expect(res.statusCode).toBe(400);
  });
});