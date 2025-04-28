import { Cliente, CreateClienteDto, UpdateClienteDto } from '@/types/cliente.types';
import { logger } from '@/lib/logger';
import { BaseApiService } from './base-api.service';
import { PaginationMeta } from '@/types/pagination.types';

interface GetClientesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: keyof Cliente;
  sortOrder?: 'ASC' | 'DESC';
}

class ClientesService extends BaseApiService {
  constructor() {
    super();
  }

  async getClientes(params: GetClientesParams = {}): Promise<{ clientes: Cliente[]; total: number }> {
    try {
      const { page = 1, limit = 10, search = '', sortBy, sortOrder } = params;
      let filters = {};
      
      if (search) {
        filters = { ...filters, search };
      }
      
      if (sortBy) {
        filters = { ...filters, sortBy, sortOrder };
      }
      
      const url = `${this.API_URL}/api/v1/clientes?page=${page}&limit=${limit}${this.buildFilterParams(filters)}`;
      logger.log('URL de petición a clientes:', url);
      
      const response = await this.fetchWithRetry(url, {
        headers: await this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      logger.log('Respuesta del servidor (clientes):', responseData);
      
      if (!responseData) {
        throw new Error('No se recibieron datos del servidor');
      }
      
      // Verificar la estructura de la respuesta
      if (Array.isArray(responseData)) {
        // Si la respuesta es un array plano de clientes
        logger.info('Respuesta recibida como array plano, adaptando formato');
        return {
          clientes: responseData,
          total: responseData.length
        };
      } else if (responseData.data) {
        // Si la respuesta tiene la estructura esperada {data, total, meta}
        logger.info('Respuesta recibida en formato esperado con data y meta');
        return {
          clientes: responseData.data || [],
          total: responseData.meta?.total || responseData.total || responseData.data.length
        };
      } else {
        // Si no se reconoce la estructura
        logger.warn('Estructura de respuesta no reconocida:', responseData);
        return {
          clientes: [],
          total: 0
        };
      }
    } catch (error) {
      logger.error('Error en getClientes:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Cliente> {
    try {
      const response = await this.fetchWithRetry(`${this.API_URL}/api/v1/clientes/${id}`, {
        headers: await this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener cliente: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      logger.error('Error en getById:', error);
      throw error;
    }
  }

  async create(data: CreateClienteDto): Promise<Cliente> {
    try {
      const response = await this.fetchWithRetry(`${this.API_URL}/api/v1/clientes`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear cliente: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      logger.error('Error en create:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateClienteDto): Promise<Cliente> {
    try {
      logger.log('URL de la petición:', `${this.API_URL}/api/v1/clientes/${id}`);
      
      const response = await this.fetchWithRetry(`${this.API_URL}/api/v1/clientes/${id}`, {
        method: 'PATCH',
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar cliente: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      logger.error('Error en update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      logger.log('URL de la petición:', `${this.API_URL}/api/v1/clientes/${id}`);
      
      const response = await this.fetchWithRetry(`${this.API_URL}/api/v1/clientes/${id}`, {
        method: 'DELETE',
        headers: await this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar cliente: ${response.status}`);
      }
    } catch (error) {
      logger.error('Error en delete:', error);
      throw error;
    }
  }
}

export const clientesService = new ClientesService(); 