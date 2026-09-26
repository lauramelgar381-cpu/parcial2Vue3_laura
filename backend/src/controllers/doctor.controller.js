import { prisma } from '../config/db.js';

export async function listarDoctores(req, res, next) {
  try {
    const doctores = await prisma.doctor.findMany();
    res.json(doctores);
  } catch (error) {
    next(error);
  }
}

export async function obtenerDoctor(req, res, next) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: Number(req.params.id) },
      include: { citas: true },
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor no encontrado' });
    res.json(doctor);
  } catch (error) {
    next(error);
  }
}

export async function crearDoctor(req, res, next) {
  try {
    const doctor = await prisma.doctor.create({ data: req.body });
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
}

export async function actualizarDoctor(req, res, next) {
  try {
    const doctor = await prisma.doctor.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(doctor);
  } catch (error) {
    next(error);
  }
}

export async function eliminarDoctor(req, res, next) {
  try {
    await prisma.doctor.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}