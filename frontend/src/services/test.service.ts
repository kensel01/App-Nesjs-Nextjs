import { API_URL } from '@/src/config/api';

class TestService {
  async checkConnection() {
    try {
      console.log('Intentando conectar a:', `${API_URL}/auth`);
      
      const response = await fetch(`${API_URL}/auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        console.error('Error de fetch:', error);
        throw new Error(`Error de red: ${error.message}`);
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      // Si llegamos aquí, el servidor está respondiendo
      return { status: 'Servidor disponible', endpoint: '/auth' };
    } catch (error) {
      console.error('Error detallado:', {
        message: error instanceof Error ? error.message : 'Error desconocido',
        error,
      });
      throw error;
    }
  }

  async testAuthEndpoint() {
    try {
      console.log('Intentando login en:', `${API_URL}/auth/login`);
      
      const testUser = {
        email: "test@test.com",
        password: "123123",
      };

      console.log('Datos a enviar:', testUser);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      }).catch(error => {
        console.error('Error de fetch:', error);
        throw new Error(`Error de red: ${error.message}`);
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${data.message || response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Error detallado:', {
        message: error instanceof Error ? error.message : 'Error desconocido',
        error,
      });
      throw error;
    }
  }
}

export const testService = new TestService(); 