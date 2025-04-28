import { useState } from 'react';
import { PaymentForm } from './PaymentForm';

export default function PaymentPage() {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Pagos en Línea</h1>
      
      {paymentSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
          ¡Pago realizado con éxito! Gracias por su pago.
        </div>
      )}
      
      <div className="max-w-md mx-auto">
        <PaymentForm onSuccess={handlePaymentSuccess} />
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-2">Información Importante</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Los pagos se procesan de forma segura a través de MercadoPago.</li>
          <li>Recibirá una confirmación por correo electrónico una vez que el pago sea procesado.</li>
          <li>Si tiene problemas al realizar el pago, por favor contacte a nuestro equipo de soporte.</li>
        </ul>
      </div>
    </div>
  );
} 