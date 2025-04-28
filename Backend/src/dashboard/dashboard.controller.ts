import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { DashboardService } from './dashboard.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Auth(Role.ADMIN, Role.TECNICO, Role.READ_ONLY)
  @ApiOperation({ summary: 'Get dashboard summary data' })
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute for this endpoint
  async getDashboardData() {
    return this.dashboardService.getDashboardData();
  }

  @Get('clientes/activos')
  @Auth(Role.ADMIN, Role.TECNICO, Role.READ_ONLY)
  @ApiOperation({ summary: 'Get active customers with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  async getActiveCustomers(@Query() paginationDto: PaginationDto) {
    return this.dashboardService.getActiveCustomers(paginationDto);
  }

  @Get('clientes/suspendidos')
  @Auth(Role.ADMIN, Role.TECNICO, Role.READ_ONLY)
  @ApiOperation({ summary: 'Get suspended customers with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  async getSuspendedCustomers(@Query() paginationDto: PaginationDto) {
    return this.dashboardService.getSuspendedCustomers(paginationDto);
  }

  @Get('pagos/resumen')
  @Auth(Role.ADMIN, Role.READ_ONLY)
  @ApiOperation({ summary: 'Get payment summary metrics' })
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async getPaymentSummary() {
    return this.dashboardService.getPaymentSummary();
  }
}
