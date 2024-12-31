import * as z from 'zod';
import { Role } from '@/types/user.types';

export const userFormSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Debe ser un email válido.',
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.',
  }).optional(),
  role: z.nativeEnum(Role, {
    required_error: 'Por favor selecciona un rol.',
  }),
}); 