import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Logger } from '@nestjs/common';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clientes')
export class ClientesController {
  private readonly logger = new Logger(ClientesController.name);
  
  constructor(private readonly clientesService: ClientesService) {}

  @Auth(Role.ADMIN, Role.USER, Role.TECNICO)
  @Post()
  create(
    @Body() createClienteDto: CreateClienteDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.clientesService.create(createClienteDto, user);
  }

  @Auth(Role.ADMIN, Role.USER, Role.TECNICO)
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @ActiveUser() user: UserActiveInterface,
    @Query() paginationDto: PaginationDto
  ) {
    try {
      this.logger.debug(`Usuario ${user.email} con rol ${user.role} solicitando lista de clientes`);
      this.logger.debug(`Parámetros de consulta: ${JSON.stringify(paginationDto)}`);
      
      const clientes = await this.clientesService.findAll(user);
      
      // Aplicar ordenación si se especifica
      let resultados = [...clientes];
      
      if (paginationDto.sortBy) {
        this.logger.debug(`Ordenando por ${paginationDto.sortBy} en orden ${paginationDto.sortOrder}`);
        resultados.sort((a, b) => {
          const aValue = a[paginationDto.sortBy];
          const bValue = b[paginationDto.sortBy];
          
          if (aValue === undefined || bValue === undefined) {
            return 0;
          }
          
          // Comparar strings o números
          const comparison = typeof aValue === 'string'
            ? aValue.localeCompare(bValue)
            : aValue - bValue;
            
          return paginationDto.sortOrder === 'ASC' ? comparison : -comparison;
        });
      }
      
      // Aplicar búsqueda si se especifica
      if (paginationDto.search && paginationDto.search.trim() !== '') {
        const searchTerm = paginationDto.search.toLowerCase();
        this.logger.debug(`Filtrando por término: ${searchTerm}`);
        
        resultados = resultados.filter(cliente => 
          cliente.name?.toLowerCase().includes(searchTerm) ||
          cliente.rut?.toLowerCase().includes(searchTerm) ||
          cliente.email?.toLowerCase().includes(searchTerm) ||
          cliente.telefono?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Aplicar paginación
      const total = resultados.length;
      const page = paginationDto.page || 1;
      const limit = paginationDto.limit || 10;
      const skip = (page - 1) * limit;
      
      // Obtener solo los elementos de la página actual
      const paginatedResults = resultados.slice(skip, skip + limit);
      
      this.logger.debug(`Devolviendo ${paginatedResults.length} de ${total} resultados`);
      
      // Devolver en el formato esperado por el frontend
      return {
        data: paginatedResults,
        total: total,
        meta: {
          page: page,
          limit: limit,
          total: total,
          totalPages: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      this.logger.error(`Error al obtener clientes: ${error.message}`, error.stack);
      throw new BadRequestException(`Error al obtener clientes: ${error.message}`);
    }
  }

  @Auth(Role.ADMIN, Role.USER, Role.TECNICO)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number, 
    @ActiveUser() user: UserActiveInterface
  ) {
    return this.clientesService.findOne(id, user);
  }

  @Auth(Role.ADMIN, Role.USER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.clientesService.update(id, updateClienteDto, user);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number, 
    @ActiveUser() user: UserActiveInterface
  ) {
    return this.clientesService.remove(id, user);
  }
}
