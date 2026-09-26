import { z } from 'zod';

export const doctorSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  especialidad: z.string().min(2),
  telefono: z.string().min(8),
  cualificaciones: z.string().optional(),
});

export const doctorUpdateSchema = doctorSchema.partial();