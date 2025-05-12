import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { CreateTipoDeServicioDto } from './dto/create-tipo-de-servicio.dto';
import { UpdateTipoDeServicioDto } from './dto/update-tipo-de-servicio.dto';
import { TiposDeServicioService } from './tipos-de-servicio.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('tipos-de-servicio')
export class TiposDeServicioController {
  constructor(
    private readonly tiposDeServicioService: TiposDeServicioService,
  ) {}

  @Post()
  @Auth(Role.ADMIN)
  create(@Body() createTipoDeServicioDto: CreateTipoDeServicioDto) {
    return this.tiposDeServicioService.create(createTipoDeServicioDto);
  }

  @Get()
  @Auth(Role.ADMIN, Role.TECNICO)
  @SkipThrottle()
  findAll() {
    return this.tiposDeServicioService.findAll();
  }

  @Get(':id')
  @Auth(Role.ADMIN, Role.TECNICO)
  findOne(@Param('id') id: number) {
    return this.tiposDeServicioService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  update(
    @Param('id') id: number,
    @Body() updateTipoDeServicioDto: UpdateTipoDeServicioDto,
  ) {
    return this.tiposDeServicioService.update(id, updateTipoDeServicioDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  remove(@Param('id') id: number) {
    return this.tiposDeServicioService.remove(id);
  }
}
