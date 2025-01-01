import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ENDPOINTS } from "@/config/api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos');
        }

        try {
          const loginUrl = ENDPOINTS.AUTH.LOGIN;
          console.log('Intentando login con URL:', loginUrl);
          
          const response = await fetch(loginUrl, {
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

          console.log('Respuesta del servidor:', response.status);
          const data = await response.json();
          console.log('Datos recibidos:', data);

          if (!response.ok) {
            const errorMessage = data.message || 'Error al iniciar sesión';
            console.error('Login error:', errorMessage);
            throw new Error(errorMessage);
          }

          // Asumiendo que el backend devuelve { token, email }
          return {
            id: data.email,
            email: data.email,
            token: data.token,
            name: data.email
          };
        } catch (error: any) {
          console.error('Error completo:', error);
          throw new Error(error.message || 'Error al iniciar sesión');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          email: token.email as string,
          token: token.token as string
        };
        session.token = token.token as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST };