import { z } from 'zod';

export const citaSchema = z.object({
  pacienteId: z.number().int().positive(),
  doctorId: z.number().int().positive(),
  fechaCita: z.coerce.date().refine((fecha) => fecha > new Date(), {
    message: 'La fecha de la cita debe ser futura',
  }),
  estado: z.enum(['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REPROGRAMADA']).optional(),
  notas: z.string().optional(),
});

export const citaUpdateSchema = citaSchema.partial();