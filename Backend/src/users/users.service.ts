import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Like, FindOptionsWhere, ILike } from 'typeorm';
import { Role } from '../common/enums/rol.enum';
import * as bcryptjs from 'bcryptjs';

interface FindUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  isActive?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Si se proporciona una contraseña, hash antes de guardar
    if (createUserDto.password) {
      createUserDto.password = await bcryptjs.hash(createUserDto.password, 10);
    }

    return await this.userRepository.save(createUserDto);
  }

  async findAll(params: FindUsersParams = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'name',
      sortOrder = 'ASC',
      isActive,
    } = params;

    const skip = (page - 1) * limit;

    let where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = {};

    // Si se proporciona isActive, filtramos por ese campo
    if (isActive !== undefined) {
      where = { isActive };
    }

    if (search) {
      // Función para crear la condición de búsqueda
      const createSearchCondition = (baseCondition: any = {}) => {
        return [
          { ...baseCondition, name: ILike(`%${search}%`) },
          { ...baseCondition, email: ILike(`%${search}%`) },
        ];
      };

      // Si ya tenemos una condición (isActive), la combinamos con la búsqueda
      if (Object.keys(where).length > 0) {
        where = createSearchCondition(where);
      } else {
        where = createSearchCondition();
      }

      // Si el término de búsqueda coincide con algún rol, agregamos la búsqueda por rol
      const upperSearch = search.toUpperCase();
      const roles = Object.values(Role);
      const matchingRoles = roles.filter((role) =>
        role.toUpperCase().includes(upperSearch),
      );

      if (matchingRoles.length > 0) {
        const roleConditions = matchingRoles.map((role) => {
          if (isActive !== undefined) {
            return { role, isActive };
          }
          return { role };
        });

        where = [...where, ...roleConditions];
      }
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      order: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      select: [
        'id',
        'name',
        'email',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
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
      select: [
        'id',
        'name',
        'email',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOneEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role', 'isActive'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Si se proporciona una contraseña, hash antes de actualizar
    if (updateUserDto.password) {
      updateUserDto.password = await bcryptjs.hash(updateUserDto.password, 10);
    }

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

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

  async updateProfile(email: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOneEmail(email);

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // No permitir cambiar el rol desde este endpoint
      delete updateUserDto.role;

      // No permitir cambiar el estado de activación desde este endpoint
      delete updateUserDto.isActive;

      // Si se está actualizando la contraseña, hay que encriptarla
      if (updateUserDto.password) {
        updateUserDto.password = await bcryptjs.hash(
          updateUserDto.password,
          10,
        );
      }

      // No permitir cambiar el email desde este endpoint para evitar problemas de seguridad
      delete updateUserDto.email;

      await this.userRepository.update(user.id, updateUserDto);

      return {
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: await this.findOne(user.id),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el perfil');
    }
  }

  async toggleUserStatus(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const newStatus = !user.isActive;

    await this.userRepository.update(id, { isActive: newStatus });

    return {
      success: true,
      message: `Usuario ${newStatus ? 'activado' : 'desactivado'} exitosamente`,
      user: await this.findOne(id),
    };
  }
}
