import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Auth(Role.ADMIN, Role.TECNICO)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto, @ActiveUser() user: UserActiveInterface) {
    return this.clientesService.create(createClienteDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.clientesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number,@ActiveUser() user: UserActiveInterface) {
    return this.clientesService.findOne(id,user);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateClienteDto: UpdateClienteDto,@ActiveUser() user: UserActiveInterface) {
    return this.clientesService.update(id, updateClienteDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
    return this.clientesService.remove(id, user);
  }
} 