export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  TECNICO = 'tecnico'
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  accessToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  statusCode?: number;
} 