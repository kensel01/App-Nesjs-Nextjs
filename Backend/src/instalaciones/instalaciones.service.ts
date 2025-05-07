import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, FindOptionsWhere, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Instalacion, EstadoInstalacion } from './entities/instalacion.entity';
import { CreateInstalacionDto } from './dto/create-instalacion.dto';
import { UpdateInstalacionDto } from './dto/update-instalacion.dto';
import { FilterInstalacionDto } from './dto/filter-instalacion.dto';
import { ClientesService } from '../clientes/clientes.service';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { ClienteServicio } from '../clientes/entities/cliente-servicio.entity';

@Injectable()
export class InstalacionesService {
  constructor(
    @InjectRepository(Instalacion)
    private instalacionesRepository: Repository<Instalacion>,
    private clientesService: ClientesService,
    @InjectRepository(ClienteServicio)
    private clienteServicioRepository: Repository<ClienteServicio>,
  ) {}

  async create(createInstalacionDto: CreateInstalacionDto, user: UserActiveInterface): Promise<Instalacion> {
    // Verificar que el cliente exista
    const cliente = await this.clientesService.findOne(createInstalacionDto.clienteId, user);
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${createInstalacionDto.clienteId} no encontrado`);
    }

    // Verificar que el servicio exista
    const clienteServicio = cliente.servicios.find(
      (servicio) => servicio.id === createInstalacionDto.clienteServicioId,
    );
    if (!clienteServicio) {
      throw new NotFoundException(
        `Servicio con ID ${createInstalacionDto.clienteServicioId} no encontrado para el cliente con ID ${createInstalacionDto.clienteId}`,
      );
    }

    // Si no se proporcionó dirección, usar la del cliente
    if (!createInstalacionDto.direccion) {
      createInstalacionDto.direccion = cliente.direccion;
    }

    // Si no se proporcionó comuna, usar la del cliente
    if (!createInstalacionDto.comuna) {
      createInstalacionDto.comuna = cliente.comuna;
    }

    // Si no se proporcionó ciudad, usar la del cliente
    if (!createInstalacionDto.ciudad) {
      createInstalacionDto.ciudad = cliente.ciudad;
    }

    const nuevaInstalacion = this.instalacionesRepository.create(createInstalacionDto);
    return this.instalacionesRepository.save(nuevaInstalacion);
  }

  async findAll(filterDto: FilterInstalacionDto = {}, user: UserActiveInterface): Promise<Instalacion[]> {
    const where: FindOptionsWhere<Instalacion> = {};
    
    // Filtrar por estado
    if (filterDto.estados && filterDto.estados.length > 0) {
      where.estado = filterDto.estados.length === 1 ? filterDto.estados[0] : In(filterDto.estados);
    }
    
    // Filtrar por rango de fechas
    if (filterDto.fechaDesde && filterDto.fechaHasta) {
      where.fechaProgramada = Between(
        new Date(filterDto.fechaDesde),
        new Date(filterDto.fechaHasta),
      );
    } else if (filterDto.fechaDesde) {
      where.fechaProgramada = MoreThanOrEqual(new Date(filterDto.fechaDesde));
    } else if (filterDto.fechaHasta) {
      where.fechaProgramada = LessThanOrEqual(new Date(filterDto.fechaHasta));
    }
    
    // Filtrar por cliente
    if (filterDto.clienteId) {
      where.clienteId = filterDto.clienteId;
    }
    
    // Filtrar por servicio
    if (filterDto.clienteServicioId) {
      where.clienteServicioId = filterDto.clienteServicioId;
    }
    
    // Filtrar por dirección
    if (filterDto.direccion) {
      where.direccion = Like(`%${filterDto.direccion}%`);
    }
    
    // Filtrar por comuna
    if (filterDto.comuna) {
      where.comuna = Like(`%${filterDto.comuna}%`);
    }
    
    // Filtrar por ciudad
    if (filterDto.ciudad) {
      where.ciudad = Like(`%${filterDto.ciudad}%`);
    }
    
    // Filtrar por técnico
    if (filterDto.nombreTecnico) {
      where.nombreTecnico = Like(`%${filterDto.nombreTecnico}%`);
    }
    
    // Búsqueda general
    if (filterDto.busqueda) {
      // Implementar lógica para búsqueda general
      // Esta es una simplificación
      const query = this.instalacionesRepository.createQueryBuilder('instalacion')
        .leftJoinAndSelect('instalacion.cliente', 'cliente')
        .leftJoinAndSelect('instalacion.clienteServicio', 'clienteServicio')
        .where('cliente.name LIKE :search', { search: `%${filterDto.busqueda}%` })
        .orWhere('cliente.rut LIKE :search', { search: `%${filterDto.busqueda}%` })
        .orWhere('instalacion.direccion LIKE :search', { search: `%${filterDto.busqueda}%` })
        .orWhere('instalacion.nombreTecnico LIKE :search', { search: `%${filterDto.busqueda}%` })
        .orWhere('instalacion.notas LIKE :search', { search: `%${filterDto.busqueda}%` })
        .orWhere('instalacion.observaciones LIKE :search', { search: `%${filterDto.busqueda}%` });
      
      return query.getMany();
    }
    
    return this.instalacionesRepository.find({
      where,
      relations: ['cliente', 'clienteServicio'],
      order: {
        fechaProgramada: 'ASC',
        horaInicio: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Instalacion> {
    const instalacion = await this.instalacionesRepository.findOne({
      where: { id },
      relations: ['cliente', 'clienteServicio'],
    });
    
    if (!instalacion) {
      throw new NotFoundException(`Instalación con ID ${id} no encontrada`);
    }
    
    return instalacion;
  }

  async update(id: number, updateInstalacionDto: UpdateInstalacionDto): Promise<Instalacion> {
    const instalacion = await this.findOne(id);
    
    // Si se está cambiando el estado a COMPLETADA, verificar que se haya proporcionado hora de fin
    if (
      updateInstalacionDto.estado === EstadoInstalacion.COMPLETADA &&
      !instalacion.horaFin &&
      !updateInstalacionDto.horaFin
    ) {
      throw new BadRequestException(
        'Debe proporcionar una hora de fin para marcar la instalación como completada',
      );
    }
    
    Object.assign(instalacion, updateInstalacionDto);
    return this.instalacionesRepository.save(instalacion);
  }

  async remove(id: number): Promise<void> {
    const instalacion = await this.findOne(id);
    await this.instalacionesRepository.remove(instalacion);
  }

  async getInstalacionesPorEstado(estado: EstadoInstalacion): Promise<Instalacion[]> {
    return this.instalacionesRepository.find({
      where: { estado },
      relations: ['cliente', 'clienteServicio'],
      order: {
        fechaProgramada: 'ASC',
        horaInicio: 'ASC',
      },
    });
  }

  async getInstalacionesPorCliente(clienteId: number): Promise<Instalacion[]> {
    return this.instalacionesRepository.find({
      where: { clienteId },
      relations: ['cliente', 'clienteServicio'],
      order: {
        fechaProgramada: 'ASC',
        horaInicio: 'ASC',
      },
    });
  }

  async cambiarEstado(id: number, estado: EstadoInstalacion, user: UserActiveInterface): Promise<Instalacion> {
    const instalacion = await this.findOne(id);
    
    // Validaciones específicas según el cambio de estado
    if (estado === EstadoInstalacion.COMPLETADA && !instalacion.horaFin) {
      throw new BadRequestException(
        'Debe proporcionar una hora de fin para marcar la instalación como completada',
      );
    }
    
    instalacion.estado = estado;
    
    // Si se completa la instalación y no tenía fecha de instalación en el servicio, actualizarla
    if (estado === EstadoInstalacion.COMPLETADA) {
      // Actualizar directamente en la base de datos la fecha de instalación del servicio
      await this.clienteServicioRepository
        .createQueryBuilder()
        .update()
        .set({ fechaInstalacion: instalacion.fechaProgramada })
        .where('id = :servicioId', { servicioId: instalacion.clienteServicioId })
        .andWhere('fechaInstalacion IS NULL')
        .execute();
    }
    
    return this.instalacionesRepository.save(instalacion);
  }
} 