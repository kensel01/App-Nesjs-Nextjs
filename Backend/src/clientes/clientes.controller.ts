import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clientes')
export class ClientesController {
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
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.clientesService.findAll(user);
  }

  @Auth(Role.ADMIN, Role.USER, Role.TECNICO)
  @Get(':id')
  findOne(
    @Param('id') id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.clientesService.findOne(id, user);
  }

  @Auth(Role.ADMIN, Role.USER)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateClienteDto: UpdateClienteDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.clientesService.update(id, updateClienteDto, user);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.clientesService.remove(id, user);
  }
} 