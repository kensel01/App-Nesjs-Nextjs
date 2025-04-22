import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginResponse, ErrorResponse } from '@/types/user.types';

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL must be defined');
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // For normal users, validate that email and password are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        try {
          console.log('Attempting login with:', API_URL);
          const res = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log('Login response status:', res.status);

          if (!res.ok) {
            const error = await res.json();
            console.error('Login error response:', error);
            throw new Error(error.message || 'Error en la autenticación');
          }

          const data = await res.json();
          console.log('Login response data:', data);

          return {
            id: data.id || 1,
            email: data.email,
            name: data.email.split('@')[0],
            role: data.role || 'user',
            accessToken: data.token,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error instanceof Error ? error : new Error('Error en la autenticación');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = Number(token.id);
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };