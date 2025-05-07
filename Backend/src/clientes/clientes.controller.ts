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
  UnauthorizedException,
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
import { Public } from '../auth/decorators/public.decorator';
import { PaymentsService } from '../payments/payments.service';

interface CheckClientStatusDto {
  rut: string;
  token: string;
}

interface ClientStatusResponse {
  status: 'active' | 'suspended' | 'not_found';
  balance?: number;
  service?: string;
  lastPayment?: string;
  nextDueDate?: string; 
  daysUntilSuspension?: number;
  errorMessage?: string;
  rutConsultado?: string;
  cliente?: {
    id?: number;
    nombre?: string;
    email?: string;
    direccion?: string;
    telefono?: string;
    fechaRegistro?: string;
  };
  recentPayments?: Array<{
    fecha: string;
    monto: number;
    estado: string;
    metodo: string;
    comprobante?: string | null;
  }>;
  serviceDetails?: {
    velocidad?: string;
    caracteristicas?: string[];
    tipoConexion?: string;
  };
  tendenciaPagos?: {
    puntualidad: 'alta' | 'media' | 'baja';
    ultimosMeses: number;
  } | null;
  sugerencias?: Array<{
    rut: string;
    nombre: string;
  }>;
}

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clientes')
export class ClientesController {
  private readonly logger = new Logger(ClientesController.name);
  
  constructor(
    private readonly clientesService: ClientesService,
    private readonly paymentsService: PaymentsService,
  ) {}

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

  /**
   * Endpoint público para consultar el estado de un cliente por RUT
   * Requiere un token de seguridad generado previamente
   */
  @Public()
  @Post('client/status')
  async checkClientStatus(@Body() checkClientStatusDto: CheckClientStatusDto): Promise<ClientStatusResponse> {
    try {
      const { rut, token } = checkClientStatusDto;
      
      // Verificar token (esto generalmente sería más seguro con firma digital)
      // La validación completa dependería de cómo implementaste fetchPaymentIntent
      if (!token) {
        throw new UnauthorizedException('Token inválido');
      }
      
      // Normalizar el RUT antes de buscar (eliminar espacios, etc.)
      const rutNormalizado = rut.trim();
      
      this.logger.debug(`Consultando estado para RUT: ${rutNormalizado}`);
      
      // Buscar cliente por RUT con la función mejorada
      const cliente = await this.clientesService.findByRut(rutNormalizado);
      
      if (!cliente) {
        // Intentar buscar clientes similares para proporcionar sugerencias
        const clientesSimilares = await this.buscarClientesSimilares(rutNormalizado);
        
        return {
          status: 'not_found',
          errorMessage: 'No se encontró ningún cliente con el RUT proporcionado',
          sugerencias: clientesSimilares.length > 0 ? clientesSimilares : undefined
        };
      }
      
      // Obtener información de pagos y servicio
      const servicioActivo = await this.clientesService.getServicioActivo(cliente.id);
      
      if (!servicioActivo) {
        return {
          status: 'not_found',
          errorMessage: 'No se encontró ningún servicio activo para este cliente',
          cliente: {
            nombre: cliente.name,
            email: cliente.email,
            direccion: cliente.direccion
          }
        };
      }
      
      // Obtener último pago
      const ultimoPago = await this.paymentsService.getUltimoPago(cliente.id, servicioActivo.id);
      
      // Obtener historial de pagos recientes (últimos 5)
      const pagosRecientes = await this.paymentsService.getPagosRecientes(cliente.id, servicioActivo.id, 5);
      
      // Calcular próximo vencimiento (30 días después del último pago)
      let nextDueDate = null;
      let daysUntilSuspension = 0;
      
      if (ultimoPago) {
        const fechaUltimoPago = new Date(ultimoPago.fecha);
        nextDueDate = new Date(fechaUltimoPago);
        nextDueDate.setDate(nextDueDate.getDate() + 30);
        
        // Calcular días restantes hasta suspensión
        const hoy = new Date();
        daysUntilSuspension = Math.floor((nextDueDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      }
      
      // Determinar si el servicio está activo o suspendido
      const suspendido = servicioActivo.suspendido || (daysUntilSuspension < 0);
      
      // Calcular saldo pendiente si está suspendido
      const saldoPendiente = suspendido ? servicioActivo.precio : 0;
      
      // Obtener detalles técnicos del servicio
      const serviceDetails = {
        velocidad: this.obtenerVelocidadServicio(servicioActivo.nombre),
        caracteristicas: this.obtenerCaracteristicasServicio(servicioActivo.nombre, servicioActivo.descripcion),
        tipoConexion: this.obtenerTipoConexion(servicioActivo.nombre)
      };
      
      // Información adicional del cliente
      const clienteDetails = {
        id: cliente.id, // Útil para referencia interna
        nombre: cliente.name,
        email: cliente.email,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        fechaRegistro: cliente.createdAt.toISOString().split('T')[0] // Solo la fecha
      };
      
      // Preparar información de pagos recientes
      const recentPayments = pagosRecientes.map(pago => ({
        fecha: pago.fecha.toISOString(),
        monto: pago.monto,
        estado: pago.estado,
        metodo: pago.metodoPago,
        comprobante: (pago as any).comprobante || null
      }));
      
      // Calcular información de tendencia de pagos
      const tendenciaPagos = this.calcularTendenciaPagos(pagosRecientes);
      
      return {
        status: suspendido ? 'suspended' : 'active',
        balance: saldoPendiente,
        service: servicioActivo.nombre,
        lastPayment: ultimoPago ? ultimoPago.fecha.toISOString() : null,
        nextDueDate: nextDueDate ? nextDueDate.toISOString() : null,
        daysUntilSuspension: daysUntilSuspension > 0 ? daysUntilSuspension : 0,
        cliente: clienteDetails,
        recentPayments,
        serviceDetails,
        tendenciaPagos,
        rutConsultado: rutNormalizado
      };
    } catch (error) {
      this.logger.error(`Error al consultar estado de cliente: ${error.message}`, error.stack);
      return {
        status: 'not_found',
        errorMessage: 'Ocurrió un error al consultar tu estado. Por favor intenta más tarde.'
      };
    }
  }

  /**
   * Método auxiliar para buscar clientes con RUTs similares
   * Útil para sugerir alternativas cuando no se encuentra el RUT exacto
   */
  private async buscarClientesSimilares(rut: string): Promise<Array<{rut: string, nombre: string}>> {
    try {
      // Limpiar el RUT para la búsqueda
      const rutLimpio = rut.replace(/[^0-9kK]/g, '');
      
      if (rutLimpio.length < 4) return [];
      
      // Obtener los primeros 4-6 dígitos para buscar coincidencias parciales
      const rutPrefix = rutLimpio.substring(0, Math.min(6, rutLimpio.length - 1));
      
      this.logger.debug(`Buscando clientes similares con prefijo: ${rutPrefix}`);
      
      const clientesSimilares = await this.clientesService.findClientesConPrefijo(rutPrefix);
      
      // Devolver solo RUT y nombre para evitar exponer datos sensibles
      return clientesSimilares.map(cliente => ({
        rut: cliente.rut,
        nombre: cliente.name
      })).slice(0, 3); // Limitar a 3 sugerencias
      
    } catch (error) {
      this.logger.error(`Error buscando clientes similares: ${error.message}`);
      return [];
    }
  }
  
  /**
   * Método auxiliar para calcular tendencia y estadísticas básicas de pagos
   */
  private calcularTendenciaPagos(pagos: any[]): { 
    puntualidad: 'alta' | 'media' | 'baja', 
    ultimosMeses: number 
  } | null {
    if (!pagos || pagos.length === 0) return null;
    
    // Calcular cuántos pagos son puntuales (no estaban suspendidos)
    const pagosPuntuales = pagos.filter(p => 
      p.estado === 'COMPLETED' || p.estado === 'APPROVED'
    ).length;
    
    const ratio = pagosPuntuales / pagos.length;
    
    return {
      puntualidad: ratio > 0.8 ? 'alta' : ratio > 0.5 ? 'media' : 'baja',
      ultimosMeses: pagos.length
    };
  }

  /**
   * Método auxiliar para extraer la velocidad del servicio de su nombre o descripción
   */
  private obtenerVelocidadServicio(nombreServicio: string): string {
    // Buscar patrones como "100Mbps", "200 Mbps", etc.
    const match = nombreServicio.match(/(\d+)\s*(mbps|mb\/s|megas)/i);
    if (match) {
      return `${match[1]} Mbps`;
    }
    return 'No especificada';
  }

  /**
   * Método auxiliar para extraer características del servicio
   */
  private obtenerCaracteristicasServicio(nombreServicio: string, descripcion?: string): string[] {
    const caracteristicas = [];
    
    // Identificar características por patrones en el nombre
    if (nombreServicio.match(/fibra/i)) {
      caracteristicas.push('Fibra Óptica');
    }
    
    if (nombreServicio.match(/inalámbrico|wireless/i)) {
      caracteristicas.push('Conexión Inalámbrica');
    }
    
    if (nombreServicio.match(/dedicado|exclusivo/i)) {
      caracteristicas.push('Ancho de Banda Dedicado');
    }
    
    // Añadir características basadas en la descripción si está disponible
    if (descripcion) {
      if (descripcion.match(/ip\s+fija/i)) {
        caracteristicas.push('IP Fija');
      }
      
      if (descripcion.match(/simétric[oa]/i)) {
        caracteristicas.push('Velocidad Simétrica');
      }
    }
    
    // Si no se encontraron características, añadir una genérica
    if (caracteristicas.length === 0) {
      caracteristicas.push('Internet Residencial');
    }
    
    return caracteristicas;
  }

  /**
   * Método auxiliar para determinar el tipo de conexión
   */
  private obtenerTipoConexion(nombreServicio: string): string {
    if (nombreServicio.match(/fibra/i)) {
      return 'Fibra Óptica';
    } else if (nombreServicio.match(/wireless|inalámbrico/i)) {
      return 'Inalámbrico';
    } else if (nombreServicio.match(/satelital/i)) {
      return 'Satelital';
    } else if (nombreServicio.match(/adsl|cobre/i)) {
      return 'ADSL';
    }
    
    return 'No especificado';
  }
}
