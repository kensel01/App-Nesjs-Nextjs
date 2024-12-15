import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>
   ){}

  async create(createCatDto: CreateCatDto, user: UserActiveInterface) {
    const breed = await this.checkIfBreedExists(createCatDto.breed);
    return await this.catRepository.save({
      ...createCatDto,
      breed,
      userEmail: user.email,
    });

  }

  async findAll(user: UserActiveInterface) {
    if(user.role === Role.ADMIN){
      return await this.catRepository.find();
    }
    return await this.catRepository.find({
      where: {userEmail: user.email},
    });
  }

  async findOne(id: number,user: UserActiveInterface) {
    const cat = await this.catRepository.findOneBy({id});

    if(!cat){
      throw new BadRequestException('Cat not found');
    }
    this.validateOwner(cat, user);
    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto,user: UserActiveInterface) {
    //return await this.catRepository.update(id, updateCatDto);
    await this.findOne(id, user);

    return await this.catRepository.update(id, {
      ...updateCatDto,
      breed : updateCatDto.breed ? await this.checkIfBreedExists(updateCatDto.breed) : undefined,
      userEmail: user.email,
    });
    
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user);
    return await this.catRepository.softDelete({id});
  }

  private validateOwner(cat: Cat, user: UserActiveInterface){
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email){
      throw new UnauthorizedException();
    }
  }

  private async checkIfBreedExists(breedName: string){
    const breed = await this.breedRepository.findOneBy({name: breedName});
    if (!breed){
      throw new BadRequestException('Breed not found');
    }
    return breed;
  }
}
