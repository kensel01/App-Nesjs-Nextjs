'use client';

import { useState } from 'react';
import { testService } from '@/services/test.service';
import { API_URL } from '@/config/api';

export default function TestConnectionPage() {
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [authStatus, setAuthStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const checkHealth = async () => {
    try {
      setIsLoading(true);
      setHealthStatus('Intentando conexión...');
      const result = await testService.checkConnection();
      setHealthStatus(`Conexión exitosa: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setHealthStatus(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAuth = async () => {
    try {
      setIsLoading(true);
      setAuthStatus('Intentando login...');
      const result = await testService.testAuthEndpoint();
      setAuthStatus(`Login exitoso: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setAuthStatus(`Error en login: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Prueba de Conexión con Backend</h1>
      
      <div className="space-y-8">
        <div className="mb-8 p-4 bg-yellow-50 rounded">
          <h3 className="font-semibold text-yellow-800">Información de Configuración:</h3>
          <div className="mt-2 space-y-2">
            <p className="text-yellow-700">
              <strong>Backend URL (env):</strong> {process.env.NEXT_PUBLIC_BACKEND_URL}
            </p>
            <p className="text-yellow-700">
              <strong>Backend URL (config):</strong> {API_URL}
            </p>
            <p className="text-yellow-700">
              <strong>Test Endpoint:</strong> {`${API_URL}/auth`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Estado del Servidor</h2>
          <p className="text-sm text-gray-600">
            Prueba la conexión usando el endpoint público de autenticación
          </p>
          <button
            onClick={checkHealth}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Verificando...' : 'Verificar Conexión'}
          </button>
          {healthStatus && (
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
              {healthStatus}
            </pre>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Prueba de Login</h2>
          <p className="text-sm text-gray-600">
            Intenta hacer login con el usuario de prueba
          </p>
          <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded">
            <p><strong>Credenciales de Prueba:</strong></p>
            <p>Email: test@test.com</p>
            <p>Password: 123123</p>
          </div>
          <button
            onClick={testAuth}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Probando...' : 'Probar Login'}
          </button>
          {authStatus && (
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto whitespace-pre-wrap">
              {authStatus}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
} 