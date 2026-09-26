import { prisma } from '../config/db.js';

export async function listarPacientes(req, res, next) {
  try {
    const pacientes = await prisma.paciente.findMany();
    res.json(pacientes);
  } catch (error) {
    next(error);
  }
}

export async function obtenerPaciente(req, res, next) {
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: Number(req.params.id) },
      include: { citas: true },
    });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (error) {
    next(error);
  }
}

export async function crearPaciente(req, res, next) {
  try {
    const paciente = await prisma.paciente.create({ data: req.body });
    res.status(201).json(paciente);
  } catch (error) {
    next(error);
  }
}

export async function actualizarPaciente(req, res, next) {
  try {
    const paciente = await prisma.paciente.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(paciente);
  } catch (error) {
    next(error);
  }
}

export async function eliminarPaciente(req, res, next) {
  try {
    await prisma.paciente.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}