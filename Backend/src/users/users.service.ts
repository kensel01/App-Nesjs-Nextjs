import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Like, FindOptionsWhere, ILike } from 'typeorm';
import { Role } from '../common/enums/rol.enum';

interface FindUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll(params: FindUsersParams = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'name',
      sortOrder = 'ASC',
    } = params;

    const skip = (page - 1) * limit;

    let where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = {};

    if (search) {
      // Primero intentamos buscar por nombre y email
      where = [
        { name: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ];

      // Si el término de búsqueda coincide con algún rol, agregamos la búsqueda por rol
      const upperSearch = search.toUpperCase();
      const roles = Object.values(Role);
      const matchingRoles = roles.filter(role => 
        role.toUpperCase().includes(upperSearch)
      );

      if (matchingRoles.length > 0) {
        where = [...where, ...matchingRoles.map(role => ({ role }))];
      }
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      order: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      select: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });

    return {
      users,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });
  }

  async findOneEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (user) {
      await this.userRepository.delete(id);
    }
    return user;
  }
}
