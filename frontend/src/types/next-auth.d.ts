import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    token: string;
  }

  interface Session {
    user: User;
    token: string;
    expires: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    email: string;
    name?: string;
    role?: string;
    exp: number;
    iat: number;
    jti: string;
  }
}