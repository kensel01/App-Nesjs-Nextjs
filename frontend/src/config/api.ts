export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api/v1';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_URL}/auth/register`,
    LOGIN: `${API_URL}/auth/login`,
    PROFILE: `${API_URL}/auth/profile`,
    REFRESH: `${API_URL}/auth/refresh`,
  },
  USERS: {
    BASE: `${API_URL}/users`,
  },
  SERVICES: {
    TYPES: `${API_URL}/tipos-de-servicio`,
  },
} as const; 