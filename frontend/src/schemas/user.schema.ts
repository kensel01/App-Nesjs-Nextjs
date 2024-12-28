import { z } from 'zod';
import { Role } from '@/src/types/user.types';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  email: z
    .string()
    .email('Correo electrónico inválido')
    .min(5, 'El correo debe tener al menos 5 caracteres')
    .max(50, 'El correo no puede tener más de 50 caracteres'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número'
    ),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Rol inválido' }),
  }),
}); 