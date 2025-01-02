export interface TipoDeServicio {
  id: number;
  name: string;
  description?: string;
}

export interface Cliente {
  id: number;
  name: string;
  rut: string;
  telefono: string;
  email?: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  tipoDeServicio: TipoDeServicio;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClienteDto {
  name: string;
  rut: string;
  telefono: string;
  email?: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  tipoDeServicioId: number;
}

export interface UpdateClienteDto extends Partial<CreateClienteDto> {} 