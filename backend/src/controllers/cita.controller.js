import { prisma } from '../config/db.js';

export async function listarCitas(req, res, next) {
  try {
    const citas = await prisma.cita.findMany({
      include: { paciente: true, doctor: true },
    });
    res.json(citas);
  } catch (error) {
    next(error);
  }
}

export async function obtenerCita(req, res, next) {
  try {
    const cita = await prisma.cita.findUnique({
      where: { id: Number(req.params.id) },
      include: { paciente: true, doctor: true },
    });
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    next(error);
  }
}

export async function crearCita(req, res, next) {
  try {
    const paciente = await prisma.paciente.findUnique({ where: { id: req.body.pacienteId } });
    const doctor = await prisma.doctor.findUnique({ where: { id: req.body.doctorId } });
    if (!paciente || !doctor) {
      return res.status(400).json({ error: 'Paciente o doctor no existe' });
    }

    const citaExistente = await prisma.cita.findFirst({
      where: {
        doctorId: req.body.doctorId,
        fechaCita: new Date(req.body.fechaCita),
        estado: { not: 'CANCELADA' },
      },
    });

    if (citaExistente) {
      return res.status(409).json({ error: 'El doctor ya tiene una cita agendada en ese horario' });
    }

    const cita = await prisma.cita.create({
      data: req.body,
      include: { paciente: true, doctor: true },
    });
    res.status(201).json(cita);
  } catch (error) {
    next(error);
  }
}
export async function actualizarCita(req, res, next) {
  try {
    if (req.body.doctorId && req.body.fechaCita) {
      const citaExistente = await prisma.cita.findFirst({
        where: {
          doctorId: req.body.doctorId,
          fechaCita: new Date(req.body.fechaCita),
          estado: { not: 'CANCELADA' },
          id: { not: Number(req.params.id) },
        },
      });

      if (citaExistente) {
        return res.status(409).json({ error: 'El doctor ya tiene una cita agendada en ese horario' });
      }
    }

    const cita = await prisma.cita.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { paciente: true, doctor: true },
    });
    res.json(cita);
  } catch (error) {
    next(error);
  }
}

export async function eliminarCita(req, res, next) {
  try {
    await prisma.cita.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Reportes
export async function citasPorEstado(req, res, next) {
  try {
    const resultado = await prisma.cita.groupBy({
      by: ['estado'],
      _count: { estado: true },
    });
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function citasPorDoctor(req, res, next) {
  try {
    const resultado = await prisma.cita.groupBy({
      by: ['doctorId'],
      _count: { doctorId: true },
    });

    const conNombre = await Promise.all(
      resultado.map(async (item) => {
        const doctor = await prisma.doctor.findUnique({ where: { id: item.doctorId } });
        return { doctor: doctor?.nombre, totalCitas: item._count.doctorId };
      })
    );

    res.json(conNombre);
  } catch (error) {
    next(error);
  }
}