import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { TiposDeServicioService } from '../tipos-de-servicio/tipos-de-servicio.service';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';
import { Logger } from '@nestjs/common';
import { ClienteServicio } from './entities/cliente-servicio.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name);

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly tiposDeServicioService: TiposDeServicioService,
    @InjectRepository(ClienteServicio)
    private readonly clienteServicioRepository: Repository<ClienteServicio>,
  ) {}

  async create(createClienteDto: CreateClienteDto, user: UserActiveInterface) {
    try {
      const tipoDeServicio = await this.tiposDeServicioService.findOne(
        createClienteDto.tipoDeServicioId,
      );
      if (!tipoDeServicio) {
        throw new NotFoundException('Tipo de servicio no encontrado');
      }

      // Verificar si ya existe un cliente con el mismo RUT
      const existingCliente = await this.clienteRepository.findOne({
        where: { rut: createClienteDto.rut },
      });

      if (existingCliente) {
        throw new BadRequestException('Ya existe un cliente con este RUT');
      }

      const cliente = this.clienteRepository.create({
        ...createClienteDto,
        tipoDeServicio,
        userEmail: user.email,
      });

      return await this.clienteRepository.save(cliente);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Error al crear el cliente');
    }
  }

  async findAll(user: UserActiveInterface, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search = '', sortBy = 'name', sortOrder = 'ASC' } = paginationDto;
    const offset = (page - 1) * limit;

    this.logger.log(`Finding clients for user: ${user.email}, role: ${user.role}`);
    this.logger.log(`Pagination/Search params: page=${page}, limit=${limit}, search=${search}, sortBy=${sortBy}, sortOrder=${sortOrder}`);

    const queryBuilder = this.clienteRepository.createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.tipoDeServicio', 'tipoDeServicio');

    if (user.role !== Role.ADMIN) {
      this.logger.log(`Filtering clients for non-admin user by email: ${user.email}`);
      queryBuilder.where('cliente.userEmail = :email', { email: user.email });
    } else {
      this.logger.log('Admin user detected, fetching all clients.');
    }

    if (search) {
      this.logger.log(`Applying search term: ${search}`);
      queryBuilder.andWhere(
        '(cliente.name ILIKE :search OR cliente.email ILIKE :search OR cliente.telefono ILIKE :search OR cliente.direccion ILIKE :search OR cliente.rut ILIKE :search OR tipoDeServicio.name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const validSortColumns: ReadonlyArray<keyof Cliente> = ['id', 'name', 'rut', 'email', 'telefono', 'direccion', 'comuna', 'ciudad', 'fechaProgramada', 'createdAt', 'userEmail'];
    const defaultSortBy: keyof Cliente = 'name'; 
    const safeSortBy = validSortColumns.includes(sortBy as keyof Cliente) ? (sortBy as keyof Cliente) : defaultSortBy;
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    this.logger.log(`Applying sort: sortBy=${safeSortBy}, sortOrder=${safeSortOrder}`);

    queryBuilder
      .orderBy(`cliente.${safeSortBy}`, safeSortOrder)
      .skip(offset)
      .take(limit);

    const [clientes, total] = await queryBuilder.getManyAndCount();

    this.logger.log(`Found ${clientes.length} clients, total count: ${total}`);

    return { data: clientes, total };
  }

  async findOne(id: number, user: UserActiveInterface) {
    try {
      let queryOptions = {};
      
      // Si no es admin, filtra por userEmail
      if (user.role !== Role.ADMIN) {
        queryOptions = { id, userEmail: user.email };
      } else {
        queryOptions = { id };
      }
      
      const cliente = await this.clienteRepository.findOne({
        where: queryOptions,
      });

      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }

      return cliente;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener el cliente');
    }
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
    user: UserActiveInterface,
  ) {
    try {
      const cliente = await this.findOne(id, user);

      if (updateClienteDto.tipoDeServicioId) {
        const tipoDeServicio = await this.tiposDeServicioService.findOne(
          updateClienteDto.tipoDeServicioId,
        );
        if (!tipoDeServicio) {
          throw new NotFoundException('Tipo de servicio no encontrado');
        }
        cliente.tipoDeServicio = tipoDeServicio;
      }

      if (updateClienteDto.rut && updateClienteDto.rut !== cliente.rut) {
        const existingCliente = await this.clienteRepository.findOne({
          where: { rut: updateClienteDto.rut },
        });

        if (existingCliente) {
          throw new BadRequestException('Ya existe un cliente con este RUT');
        }
      }

      Object.assign(cliente, updateClienteDto);
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el cliente');
    }
  }

  async remove(id: number, user: UserActiveInterface) {
    try {
      const cliente = await this.findOne(id, user);
      await this.clienteRepository.softDelete(id);
      return { message: 'Cliente eliminado correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el cliente');
    }
  }

  /**
   * Busca un cliente por su RUT
   * @param rut RUT del cliente a buscar
   * @returns Cliente o null si no se encuentra
   */
  async findByRut(rut: string): Promise<Cliente | null> {
    try {
      // Normalizar RUT para búsqueda (remover puntos, guión y convertir a minúsculas)
      const rutNormalizado = rut.replace(/[.-]/g, '').toLowerCase();
      
      // Si el RUT está vacío o no es válido, retornar null inmediatamente
      if (!rutNormalizado || rutNormalizado.length < 2) {
        return null;
      }
      
      // Buscar con una consulta exacta primero
      const clienteExacto = await this.clienteRepository
        .createQueryBuilder('cliente')
        .where('LOWER(REPLACE(REPLACE(cliente.rut, \'.\', \'\'), \'-\', \'\')) = :rutNormalizado', { 
          rutNormalizado 
        })
        .getOne();
      
      // Si encontramos una coincidencia exacta, la devolvemos inmediatamente
      if (clienteExacto) {
        this.logger.debug(`Cliente encontrado con coincidencia exacta de RUT: ${rut}`);
        return clienteExacto;
      }
      
      // Si no se encuentra exactamente, realizamos búsquedas más flexibles
      this.logger.debug(`No se encontró RUT exacto. Iniciando búsqueda avanzada para: ${rut}`);
      
      // Estrategia 1: Buscar por los primeros dígitos del RUT (sin dígito verificador)
      if (rutNormalizado.length >= 5) {
        // Obtener los primeros dígitos del RUT (sin dígito verificador)
        const rutPrefix = rutNormalizado.slice(0, -1);
        
        const clientesPorPrefijo = await this.clienteRepository
          .createQueryBuilder('cliente')
          .where('LOWER(REPLACE(REPLACE(cliente.rut, \'.\', \'\'), \'-\', \'\')) LIKE :rutPrefix', { 
            rutPrefix: `${rutPrefix}%` 
          })
          .getMany();
        
        if (clientesPorPrefijo.length === 1) {
          this.logger.debug(`Cliente encontrado con prefijo de RUT: ${rutPrefix}`);
          return clientesPorPrefijo[0];
        } else if (clientesPorPrefijo.length > 1) {
          // Si hay múltiples coincidencias, priorizar la más reciente
          this.logger.debug(`Se encontraron ${clientesPorPrefijo.length} coincidencias parciales para el RUT`);
          // Ordenar por fecha de creación (más reciente primero)
          return clientesPorPrefijo.sort((a, b) => 
            b.createdAt.getTime() - a.createdAt.getTime()
          )[0];
        }
      }
      
      // Estrategia 2: Búsqueda más flexible sin dígito verificador ni formateo
      // Útil cuando el RUT está en diferentes formatos o tiene un dígito verificador incorrecto
      // pero los números principales son correctos
      if (rutNormalizado.length >= 6) {
        const rutDigitsOnly = rutNormalizado.replace(/[^0-9]/g, '').slice(0, -1);
        
        if (rutDigitsOnly.length >= 5) {
          this.logger.debug(`Realizando búsqueda fuzzy por números de RUT: ${rutDigitsOnly}`);
          
          const clientesFuzzy = await this.clienteRepository
            .createQueryBuilder('cliente')
            .where('LOWER(REPLACE(REPLACE(REPLACE(cliente.rut, \'.\', \'\'), \'-\', \'\'), \'k\', \'\')) LIKE :rutDigits', {
              rutDigits: `%${rutDigitsOnly}%`
            })
            .getMany();
          
          if (clientesFuzzy.length >= 1) {
            this.logger.debug(`Se encontraron ${clientesFuzzy.length} coincidencias fuzzy para el RUT`);
            // Devolver la coincidencia más reciente
            return clientesFuzzy.sort((a, b) => 
              b.createdAt.getTime() - a.createdAt.getTime()
            )[0];
          }
        }
      }
        
      // No se encontró ninguna coincidencia
      this.logger.debug(`No se encontró ningún cliente con el RUT: ${rut} usando ninguna estrategia de búsqueda`);
      return null;
    } catch (error) {
      this.logger.error(`Error buscando cliente por RUT: ${error.message}`);
      return null;
    }
  }

  /**
   * Obtiene el servicio activo de un cliente
   * @param clienteId ID del cliente
   * @returns El servicio activo o null si no tiene ninguno
   */
  async getServicioActivo(clienteId: number): Promise<{
    id: number;
    nombre: string;
    descripcion: string; 
    precio: number;
    suspendido: boolean;
  } | null> {
    try {
      const clienteServicio = await this.clienteServicioRepository
        .createQueryBuilder('cs')
        .innerJoinAndSelect('cs.tipoDeServicio', 'tds')
        .where('cs.clienteId = :clienteId', { clienteId })
        .andWhere('cs.activo = true')
        .getOne();
        
      if (!clienteServicio) {
        return null;
      }
      
      return {
        id: clienteServicio.id,
        nombre: clienteServicio.tipoDeServicio.name,
        descripcion: clienteServicio.tipoDeServicio.description,
        precio: clienteServicio.precioMensual || 0, // Usar el precio del servicio contratado o 0 si no existe
        suspendido: clienteServicio.suspendido
      };
      
    } catch (error) {
      this.logger.error(`Error obteniendo servicio activo: ${error.message}`);
      return null;
    }
  }

  /**
   * Busca clientes que tengan RUTs con un prefijo similar
   * @param rutPrefix Prefijo de RUT a buscar
   * @returns Lista de clientes con RUTs similares
   */
  async findClientesConPrefijo(rutPrefix: string): Promise<Cliente[]> {
    try {
      if (!rutPrefix || rutPrefix.length < 3) {
        return [];
      }
      
      const clientes = await this.clienteRepository
        .createQueryBuilder('cliente')
        .where('LOWER(REPLACE(REPLACE(cliente.rut, \'.\', \'\'), \'-\', \'\')) LIKE :prefix', { 
          prefix: `%${rutPrefix}%` 
        })
        .orderBy('cliente.createdAt', 'DESC')
        .take(5) // Limitamos a 5 resultados
        .getMany();
      
      return clientes;
    } catch (error) {
      this.logger.error(`Error buscando clientes con prefijo: ${error.message}`);
      return [];
    }
  }
}
