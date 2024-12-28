export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  TECNICO = 'tecnico'
}

export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface User extends Omit<CreateUserForm, 'password'> {
  id: number;
  createdAt: string;
  updatedAt: string;
} 