import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDeServicio } from './entities/tipo-de-servicio.entity';
import { CreateTipoDeServicioDto } from './dto/create-tipo-de-servicio.dto';
import { UpdateTipoDeServicioDto } from './dto/update-tipo-de-servicio.dto';

@Injectable()
export class TiposDeServicioService {
  constructor(
    @InjectRepository(TipoDeServicio)
    private readonly tipoDeServicioRepository: Repository<TipoDeServicio>,
  ) {}

  async create(createTipoDeServicioDto: CreateTipoDeServicioDto) {
    const tipoDeServicio = this.tipoDeServicioRepository.create(createTipoDeServicioDto);
    return await this.tipoDeServicioRepository.save(tipoDeServicio);
  }

  async findAll() {
    return await this.tipoDeServicioRepository.find();
  }

  async findOne(id: number) {
    const tipoDeServicio = await this.tipoDeServicioRepository.findOneBy({ id });
    if (!tipoDeServicio) {
      throw new NotFoundException('Tipo de servicio not found');
    }
    return tipoDeServicio;
  }

  async update(id: number, updateTipoDeServicioDto: UpdateTipoDeServicioDto) {
    const tipoDeServicio = await this.findOne(id);
    Object.assign(tipoDeServicio, updateTipoDeServicioDto);
    return await this.tipoDeServicioRepository.save(tipoDeServicio);
  }

  async remove(id: number) {
    const tipoDeServicio = await this.findOne(id);
    return await this.tipoDeServicioRepository.softRemove(tipoDeServicio);
  }
} 