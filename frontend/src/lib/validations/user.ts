import * as z from 'zod';
import { Role } from '@/types/user.types';

// Schema para crear usuario
export const createUserFormSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z.string()
    .email('Ingresa un correo electrónico válido')
    .min(5, 'El correo electrónico es muy corto')
    .max(50, 'El correo electrónico es muy largo'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  confirmPassword: z.string(),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Selecciona un rol válido' })
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Schema para editar usuario
export const updateUserFormSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z.string()
    .email('Ingresa un correo electrónico válido')
    .min(5, 'El correo electrónico es muy corto')
    .max(50, 'El correo electrónico es muy largo'),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Selecciona un rol válido' })
  }),
}); 