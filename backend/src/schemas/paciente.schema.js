import { z } from 'zod';

export const pacienteSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(8),
  fechaNacimiento: z.coerce.date(),
  historialMedico: z.string().optional(),
});

export const pacienteUpdateSchema = pacienteSchema.partial();