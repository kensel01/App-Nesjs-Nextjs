export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Asegurarse de que la URL no termine en /
const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${baseUrl}/api/v1/auth/register`,
    LOGIN: `${baseUrl}/api/v1/auth/login`,
    PROFILE: `${baseUrl}/api/v1/auth/profile`,
    REFRESH: `${baseUrl}/api/v1/auth/refresh`,
  },
  USERS: {
    BASE: `${baseUrl}/api/v1/users`,
  },
  SERVICES: {
    TYPES: `${baseUrl}/api/v1/tipos-de-servicio`,
  },
} as const; 