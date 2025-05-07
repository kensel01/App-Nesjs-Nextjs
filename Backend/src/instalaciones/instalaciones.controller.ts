import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InstalacionesService } from './instalaciones.service';
import { CreateInstalacionDto } from './dto/create-instalacion.dto';
import { UpdateInstalacionDto } from './dto/update-instalacion.dto';
import { FilterInstalacionDto } from './dto/filter-instalacion.dto';
import { EstadoInstalacion } from './entities/instalacion.entity';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';

@UseGuards(AuthGuard, RolesGuard)
@Controller('instalaciones')
export class InstalacionesController {
  constructor(private readonly instalacionesService: InstalacionesService) {}

  @Post()
  @Roles(Role.ADMIN,  Role.TECNICO)
  create(
    @Body() createInstalacionDto: CreateInstalacionDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.instalacionesService.create(createInstalacionDto, user);
  }

  @Get()
  @Roles(Role.ADMIN,  Role.TECNICO)
  findAll(
    @Query() filterDto: FilterInstalacionDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.instalacionesService.findAll(filterDto, user);
  }

  @Get('estado/:estado')
  @Roles(Role.ADMIN,  Role.TECNICO)
  getInstalacionesPorEstado(
    @Param('estado') estado: EstadoInstalacion,
  ) {
    return this.instalacionesService.getInstalacionesPorEstado(estado);
  }

  @Get('cliente/:id')
  @Roles(Role.ADMIN,  Role.TECNICO)
  getInstalacionesPorCliente(
    @Param('id') id: string,
  ) {
    return this.instalacionesService.getInstalacionesPorCliente(+id);
  }

  @Get(':id')
  @Roles(Role.ADMIN,  Role.TECNICO)
  findOne(@Param('id') id: string) {
    return this.instalacionesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN,  Role.TECNICO)
  update(
    @Param('id') id: string,
    @Body() updateInstalacionDto: UpdateInstalacionDto,
  ) {
    return this.instalacionesService.update(+id, updateInstalacionDto);
  }

  @Patch(':id/estado/:estado')
  @Roles(Role.ADMIN, Role.TECNICO)
  cambiarEstado(
    @Param('id') id: string,
    @Param('estado') estado: EstadoInstalacion,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.instalacionesService.cambiarEstado(+id, estado, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.instalacionesService.remove(+id);
  }
} 