import { useState } from 'react';
import { PaymentButton } from './PaymentButton';

interface PaymentFormProps {
  onSuccess?: () => void;
}

export function PaymentForm({ onSuccess }: PaymentFormProps) {
  const [clienteId, setClienteId] = useState('');
  const [servicioId, setServicioId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Pago de servicio');
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!clienteId || !servicioId || !amount) {
      setFormError('Por favor complete todos los campos requeridos.');
      return;
    }

    // Show payment button if form is valid
    setShowPaymentButton(true);
  };

  const handleError = (error: any) => {
    setFormError('Error en el proceso de pago. Por favor intente nuevamente.');
    console.error('Payment error:', error);
  };

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    // Reset form
    setClienteId('');
    setServicioId('');
    setAmount('');
    setDescription('Pago de servicio');
    setShowPaymentButton(false);
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Realizar Pago</h2>
      
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clienteId">
            ID de Cliente*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="clienteId"
            type="number"
            placeholder="Ingrese ID de cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="servicioId">
            ID de Servicio*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="servicioId"
            type="number"
            placeholder="Ingrese ID de servicio"
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Monto*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            placeholder="Ingrese monto a pagar"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Descripción
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            type="text"
            placeholder="Descripción del pago"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        {!showPaymentButton ? (
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Continuar
            </button>
          </div>
        ) : (
          <PaymentButton
            clienteId={parseInt(clienteId, 10)}
            servicioId={parseInt(servicioId, 10)}
            amount={parseFloat(amount)}
            description={description}
            onSuccess={handleSuccess}
            onError={handleError}
            buttonText="Pagar con MercadoPago"
          />
        )}
      </form>
      
      <p className="text-sm text-gray-600 mt-4">
        * Campos requeridos
      </p>
    </div>
  );
} 