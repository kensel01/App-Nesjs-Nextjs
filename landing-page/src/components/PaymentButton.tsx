import { useState, useEffect, useCallback } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';

// Initialize MercadoPago SDK with public key from environment variable
// We'll initialize in a useEffect instead of at the module level
// for better SSR compatibility and to access environment variable

interface PaymentButtonProps {
  clienteId: number;
  servicioId: number;
  amount: number;
  description: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  buttonText?: string;
  className?: string;
}

export function PaymentButton({
  clienteId,
  servicioId,
  amount,
  description,
  onSuccess,
  onError: onErrorProp,
  buttonText = 'Pagar',
  className = 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
}: PaymentButtonProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize MercadoPago once when component mounts
  useEffect(() => {
    // In production, use environment variables
    const publicKey = 'TEST-d96a0d9b-de46-4965-ba50-337a778bf079'; 
    initMercadoPago(publicKey);
  }, []);

  const createPreference = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/payments/create', {
        clienteId,
        servicioId,
        amount,
        description,
      });
      
      setPreferenceId(response.data.preferenceId);
    } catch (err) {
      console.error('Error creating payment preference:', err);
      setError('Hubo un error al procesar el pago. Por favor intente nuevamente.');
      if (onErrorProp) onErrorProp(err);
    } finally {
      setLoading(false);
    }
  }, [clienteId, servicioId, amount, description, onErrorProp]);

  const handlePayment = async () => {
    if (!preferenceId) {
      await createPreference();
    }
  };

  const handleReady = () => {
    console.log('MercadoPago Wallet ready');
  };

  // Handle any wallet error events
  const handleError = (err: any) => {
    console.error('MercadoPago Wallet error:', err);
    setError('Error al cargar el botón de pago.');
    if (onErrorProp) onErrorProp(err);
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!preferenceId ? (
        <button
          onClick={handlePayment}
          disabled={loading}
          className={className}
        >
          {loading ? 'Procesando...' : buttonText}
        </button>
      ) : (
        <Wallet
          initialization={{ preferenceId }}
          onReady={handleReady}
          onError={handleError}
        />
      )}
    </div>
  );
} 