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

  async findAll(user: UserActiveInterface) {
    try {
      // Si el usuario es administrador, devuelve todos los clientes
      if (user.role === Role.ADMIN) {
        return await this.clienteRepository.find({
          order: { createdAt: 'DESC' },
        });
      } 
      
      // Para otros roles, filtra por userEmail
      return await this.clienteRepository.find({
        where: { userEmail: user.email },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException('Error al obtener los clientes');
    }
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
      
      // Buscar con una consulta más flexible que permite diferentes formatos de RUT
      const cliente = await this.clienteRepository
        .createQueryBuilder('cliente')
        .where('LOWER(REPLACE(REPLACE(cliente.rut, \'.\', \'\'), \'-\', \'\')) = :rutNormalizado', { 
          rutNormalizado 
        })
        .getOne();
      
      // Si no se encuentra exactamente, intentar con un prefijo más amplio
      if (!cliente && rutNormalizado.length >= 5) {
        // Obtener los primeros dígitos del RUT (sin dígito verificador)
        const rutPrefix = rutNormalizado.slice(0, -1);
        
        this.logger.debug(`No se encontró RUT exacto. Buscando con prefijo: ${rutPrefix}`);
        
        const clientesPosibles = await this.clienteRepository
          .createQueryBuilder('cliente')
          .where('LOWER(REPLACE(REPLACE(cliente.rut, \'.\', \'\'), \'-\', \'\')) LIKE :rutPrefix', { 
            rutPrefix: `${rutPrefix}%` 
          })
          .getMany();
        
        if (clientesPosibles.length === 1) {
          // Si hay una única coincidencia, retornarla
          return clientesPosibles[0];
        } else if (clientesPosibles.length > 1) {
          // Si hay múltiples coincidencias, priorizar la más reciente
          this.logger.debug(`Se encontraron ${clientesPosibles.length} coincidencias parciales para el RUT`);
          // Ordenar por fecha de creación (más reciente primero)
          return clientesPosibles.sort((a, b) => 
            b.createdAt.getTime() - a.createdAt.getTime()
          )[0];
        }
      }
        
      return cliente;
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
}
