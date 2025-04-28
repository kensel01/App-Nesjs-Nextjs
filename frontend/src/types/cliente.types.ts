export interface TipoDeServicio {
  id: number;
  name: string;
  precio: number;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTipoDeServicioDto {
  name: string;
}

export interface UpdateTipoDeServicioDto {
  name?: string;
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
  tipoDeServicioId: number;
  tipoDeServicio?: TipoDeServicio;
  createdAt?: string;
  updatedAt?: string;
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

export interface UpdateClienteDto {
  name?: string;
  rut?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  tipoDeServicioId?: number;
} 