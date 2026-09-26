import { z } from 'zod';

export const contactoSchema = z.object({
  email: z.string().email('Email inválido'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});