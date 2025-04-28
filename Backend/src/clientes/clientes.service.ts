import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { TiposDeServicioService } from '../tipos-de-servicio/tipos-de-servicio.service';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly tiposDeServicioService: TiposDeServicioService,
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
}
