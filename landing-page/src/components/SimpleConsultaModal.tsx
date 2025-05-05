import React, { useState } from 'react';
import { CheckCircle2, Search } from 'lucide-react';

// Definir el tipo de resultado
interface ResultadoConsulta {
  status: string;
  nombre: string;
  servicio: string;
  ultimoPago: string;
  proximoVencimiento: string;
}

const SimpleConsultaModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [rut, setRut] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultadoConsulta | null>(null);

  const openModal = () => {
    console.log('Abriendo modal');
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Cerrando modal');
    setShowModal(false);
    // Resetear el estado si se cierra el modal
    if (result) {
      setResult(null);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Consultando RUT:', rut);
    
    if (!rut) {
      alert('Por favor ingrese un RUT');
      return;
    }
    
    setIsLoading(true);
    
    // Simulamos una consulta con un timeout
    setTimeout(() => {
      setIsLoading(false);
      setResult({
        status: 'activo',
        nombre: 'Cliente de Ejemplo',
        servicio: 'Internet Fibra 200Mbps',
        ultimoPago: '15/04/2023',
        proximoVencimiento: '15/05/2023'
      });
    }, 1500);
  };

  return (
    <>
      {/* Botón flotante siempre visible */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow-lg z-50 flex items-center"
      >
        <Search className="mr-2 h-5 w-5" />
        Consultar Estado
      </button>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            // Cerrar al hacer clic fuera del modal
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden">
            <div className="bg-emerald-500 text-white py-3 px-4">
              <h2 className="text-xl font-bold text-center">Consulta de Estado</h2>
            </div>
            
            <div className="p-6">
              {!result ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Ingrese su RUT
                    </label>
                    <input
                      type="text"
                      value={rut}
                      onChange={(e) => setRut(e.target.value)}
                      placeholder="Ej: 12345678-9"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-md font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Consultando...
                      </span>
                    ) : "Consultar Estado"}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-center">{result.nombre}</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Estado:</p>
                        <p className="font-medium text-green-600">
                          {result.status === 'activo' ? 'Activo' : 'Inactivo'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Servicio:</p>
                        <p className="font-medium">{result.servicio}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Último pago:</p>
                        <p className="font-medium">{result.ultimoPago}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Próximo vencimiento:</p>
                        <p className="font-medium">{result.proximoVencimiento}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setResult(null)}
                      className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Nueva Consulta
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botón principal visible en la parte central de la página */}
      <div className="text-center my-8">
        <button
          onClick={openModal}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-full shadow-lg inline-flex items-center"
        >
          <CheckCircle2 className="mr-2 h-6 w-6" />
          Consultar Estado de Servicio
        </button>
      </div>
    </>
  );
};

export default SimpleConsultaModal; 