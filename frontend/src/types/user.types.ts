export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  TECHNICIAN = 'tecnico'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: Role;
} 