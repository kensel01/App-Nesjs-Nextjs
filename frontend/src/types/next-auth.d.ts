import NextAuth from 'next-auth';
import { Role } from './user.types';

declare module 'next-auth' {
  interface User {
    id: number;
    email: string;
    name: string;
    role: Role;
    accessToken: string;
  }

  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: Role;
      accessToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    email: string;
    name: string;
    role: Role;
    accessToken: string;
  }
}