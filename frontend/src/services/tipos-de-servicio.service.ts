import { BaseApiService } from './base-api.service';
import { TipoDeServicio, CreateTipoDeServicioDto, UpdateTipoDeServicioDto } from '@/types/cliente.types';

interface GetTiposDeServicioParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof TipoDeServicio;
  sortOrder?: 'ASC' | 'DESC';
}

interface GetTiposDeServicioResponse {
  tiposDeServicio: TipoDeServicio[];
  total: number;
}

export class TiposDeServicioService extends BaseApiService {
  async getTiposDeServicio(
    params: GetTiposDeServicioParams = {}
  ): Promise<GetTiposDeServicioResponse> {
    const { page = 1, limit = 10, search = '', sortBy, sortOrder } = params;
    const filters: Record<string, any> = {};
    if (search) filters.search = search;
    if (sortBy) {
      filters.sortBy = sortBy;
      filters.sortOrder = sortOrder;
    }
    const url = `${this.API_URL}/api/v1/tipos-de-servicio?page=${page}&limit=${limit}${this.buildFilterParams(filters)}`;
    const response = await this.fetchWithRetry(url, { headers: await this.getHeaders() });
    if (!response.ok) {
      throw new Error(`Error en getTiposDeServicio: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    let list: TipoDeServicio[] = [];
    let total: number = 0;
    if (Array.isArray(data)) {
      list = data;
      total = data.length;
    } else if (data.data && Array.isArray(data.data)) {
      list = data.data;
      total = data.total ?? data.data.length;
    } else if (data.tiposDeServicio && Array.isArray(data.tiposDeServicio)) {
      list = data.tiposDeServicio;
      total = data.total ?? data.tiposDeServicio.length;
    } else {
      throw new Error('Formato de respuesta inválido en getTiposDeServicio');
    }
    return { tiposDeServicio: list, total };
  }

  async getById(id: number): Promise<TipoDeServicio> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/tipos-de-servicio/${id}`,
      { headers: await this.getHeaders() }
    );
    if (!response.ok) {
      throw new Error(`Error en getById: ${response.status}`);
    }
    return await response.json();
  }

  async create(data: CreateTipoDeServicioDto): Promise<TipoDeServicio> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/tipos-de-servicio`,
      {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`Error en create: ${response.status}`);
    }
    return await response.json();
  }

  async update(
    id: number,
    data: UpdateTipoDeServicioDto
  ): Promise<TipoDeServicio> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/tipos-de-servicio/${id}`,
      {
        method: 'PATCH',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`Error en update: ${response.status}`);
    }
    return await response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await this.fetchWithRetry(
      `${this.API_URL}/api/v1/tipos-de-servicio/${id}`,
      { method: 'DELETE', headers: await this.getHeaders() }
    );
    if (!response.ok) {
      throw new Error(`Error en delete: ${response.status}`);
    }
  }
}

export const tiposDeServicioService = new TiposDeServicioService(); 