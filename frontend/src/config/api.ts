export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_URL}/auth/register`,
    LOGIN: `${API_URL}/auth/login`,
  },
  USERS: {
    BASE: `${API_URL}/users`,
  },
  CLIENTS: {
    BASE: `${API_URL}/clients`,
  },
} as const; 