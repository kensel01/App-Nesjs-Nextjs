import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository <User>,
  ){}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

 
  async findOneEmail(email:string) {
    return await this.userRepository.findOneBy({email}) ;
  }

  async findEmailWithPassword(email:string){
    return  await this.userRepository.findOne({ where: {email}, select: ['id', 'name', 'email', 'password','role'],} );
  }
 
}
