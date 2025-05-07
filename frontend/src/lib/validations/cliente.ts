import * as z from 'zod';

export const clienteFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  rut: z.string().min(1, 'El RUT es requerido')
    .regex(/^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/, 'El RUT debe tener el formato XX.XXX.XXX-X'),
  telefono: z.string().min(1, 'El teléfono es requerido')
    .regex(/^\+?56\s?9\s?[0-9]{4}\s?[0-9]{4}$/, 'El teléfono debe tener el formato +56 9 XXXX XXXX'),
  email: z.string().email('El email debe ser válido').optional().or(z.literal('')),
  direccion: z.string().min(1, 'La dirección es requerida'),
  comuna: z.string().min(1, 'La comuna es requerida'),
  ciudad: z.string().min(1, 'La ciudad es requerida'),
  fechaProgramada: z.date({
    required_error: 'La fecha programada es requerida',
    invalid_type_error: 'El formato de fecha no es válido',
  }),
  notas: z.string().max(300, 'Las notas no pueden exceder los 300 caracteres').optional(),
  tipoDeServicioId: z.number({
    required_error: 'El tipo de servicio es requerido',
    invalid_type_error: 'El tipo de servicio debe ser un número',
  }),
}); 