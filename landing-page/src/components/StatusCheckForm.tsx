import * as React from 'react';
import { Loader2, CircleCheck, AlertCircle } from 'lucide-react';
import { useThrottle } from '../hooks/useThrottle';

interface StatusResponse {
  status: 'active' | 'suspended' | 'not_found';
  balance?: number;
  service?: string;
  lastPayment?: string;
  errorMessage?: string;
}

// Remove type definitions and use simple event types

const StatusCheckForm = () => {
  const [rut, setRut] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState(null as StatusResponse | null);
  
  // Limitar las consultas para evitar abuso (máximo una consulta cada 2 segundos)
  const throttledCheckStatus = useThrottle(checkStatus, 2000);
  
  // Format RUT as user types (12.345.678-9)
  const handleRutChange = (e: any) => {
    let value = e.target.value;
    
    // Remove all non-digits and "k"/"K"
    value = value.replace(/[^0-9kK]/g, '');
    
    // Format with dots and dash
    if (value.length > 1) {
      let formatted = '';
      const parts = value.split('');
      const lastChar = parts.pop() || '';
      
      // Add dots every 3 digits from right to left
      let counter = 0;
      for (let i = parts.length - 1; i >= 0; i--) {
        if (counter === 3 && i !== 0) {
          formatted = '.' + formatted;
          counter = 0;
        }
        formatted = parts[i] + formatted;
        counter++;
      }
      
      // Add the dash and last digit/K
      formatted = formatted + '-' + lastChar;
      value = formatted;
    }
    
    setRut(value);
  };
  
  async function checkStatus(e: any) {
    e.preventDefault();
    
    if (!rut) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // Create a token that will be validated on the backend
      const token = await fetchPaymentIntent();
      
      // Make API request to backend to check status
      const response = await fetch('/api/client/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rut, token }),
      });
      
      if (!response.ok) {
        throw new Error('Error al consultar estado');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking status:', error);
      setResult({
        status: 'not_found',
        errorMessage: 'Ocurrió un error al consultar tu estado. Por favor intenta más tarde.'
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Get a token from backend to prevent CSRF and validate payment intent
  async function fetchPaymentIntent() {
    const response = await fetch('/api/payment/intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rut }),
    });
    
    const data = await response.json();
    return data.token;
  }
  
  // Redirect to payment page with the validated token
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const token = await fetchPaymentIntent();
      window.location.href = `/payment?token=${token}`;
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('No se pudo iniciar el proceso de pago. Por favor intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow-xl rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Consulta el estado de tu servicio</h3>
      
      <form onSubmit={throttledCheckStatus} className="space-y-4">
        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
            RUT
          </label>
          <input
            id="rut"
            type="text"
            placeholder="12.345.678-9"
            value={rut}
            onChange={handleRutChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingresa tu RUT sin puntos ni guión
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Consultando...
              </span>
            ) : (
              'Consultar Estado'
            )}
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-6 p-4 rounded-lg border">
          {result.status === 'active' ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <CircleCheck className="text-green-500 w-6 h-6 mr-2" />
                <p className="font-medium text-green-700">Tu servicio está activo</p>
              </div>
              <p className="text-sm text-gray-600">
                Servicio: {result.service}
              </p>
              <p className="text-sm text-gray-600">
                Último pago: {result.lastPayment}
              </p>
            </div>
          ) : result.status === 'suspended' ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 w-6 h-6 mr-2" />
                <p className="font-medium text-red-700">Tu servicio está suspendido</p>
              </div>
              <p className="text-sm text-red-600">
                Tienes un saldo pendiente de ${result.balance} CLP
              </p>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Procesando...
                  </span>
                ) : (
                  'Pagar Saldo'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center">
                <AlertCircle className="text-amber-500 w-6 h-6 mr-2" />
                <p className="font-medium text-amber-700">Cliente no encontrado</p>
              </div>
              <p className="text-sm text-gray-600">
                {result.errorMessage || 'No encontramos registros con ese RUT. Verifica tus datos o contáctanos.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusCheckForm; 