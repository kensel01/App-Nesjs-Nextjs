export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  TECHNICIAN = 'TECHNICIAN'
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