import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { TipoDeServicio } from '../tipos-de-servicio/entities/tipo-de-servicio.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/rol.enum';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(TipoDeServicio)
    private readonly tipoDeServicioRepository: Repository<TipoDeServicio>
   ){}

  async create(createClienteDto: CreateClienteDto, user: UserActiveInterface) {
    const tipoDeServicio = await this.checkIfTipoDeServicioExists(createClienteDto.tipoDeServicio);
    return await this.clienteRepository.save({
      ...createClienteDto,
      tipoDeServicio,
      userEmail: user.email,
    });
  }

  async findAll(user: UserActiveInterface) {
    if(user.role === Role.ADMIN){
      return await this.clienteRepository.find();
    }
    return await this.clienteRepository.find({
      where: {userEmail: user.email},
    });
  }

  async findOne(id: number,user: UserActiveInterface) {
    const cliente = await this.clienteRepository.findOneBy({id});

    if(!cliente){
      throw new BadRequestException('Cliente not found');
    }
    this.validateOwner(cliente, user);
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto,user: UserActiveInterface) {
    await this.findOne(id, user);

    return await this.clienteRepository.update(id, {
      ...updateClienteDto,
      tipoDeServicio : updateClienteDto.tipoDeServicio ? await this.checkIfTipoDeServicioExists(updateClienteDto.tipoDeServicio) : undefined,
      userEmail: user.email,
    });
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user);
    return await this.clienteRepository.softDelete({id});
  }

  private validateOwner(cliente: Cliente, user: UserActiveInterface){
    if (user.role !== Role.ADMIN && cliente.userEmail !== user.email){
      throw new UnauthorizedException();
    }
  }

  private async checkIfTipoDeServicioExists(tipoDeServicioName: string){
    const tipoDeServicio = await this.tipoDeServicioRepository.findOneBy({name: tipoDeServicioName});
    if (!tipoDeServicio){
      throw new BadRequestException('Tipo de servicio not found');
    }
    return tipoDeServicio;
  }
} 