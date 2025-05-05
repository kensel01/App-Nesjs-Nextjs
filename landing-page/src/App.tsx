import React, { lazy, Suspense, useState, useEffect } from 'react';
import { CircuitBoard, Phone, CreditCard, MessageSquare, CheckCircle2, Search } from 'lucide-react';

// Import Navigation directly instead of lazy loading it
import Navigation from './components/Navigation';
import TestModal from './components/TestModal';
import SimpleConsultaModal from './components/SimpleConsultaModal';

// Lazy load other components
const HeroSection = lazy(() => import('./components/HeroSection'));
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const PaymentPage = lazy(() => import('./components/PaymentPage'));
const StatusCheckForm = lazy(() => import('./components/StatusCheckForm'));

// Componente de fallback para Suspense
const SectionLoader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

// Componente simplificado para el modal de consulta de estado
const AccountModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" 
         onClick={(e) => {
           // Solo cierra si se hace clic fuera del modal
           if (e.target === e.currentTarget) onClose();
         }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
        <div className="bg-emerald-500 text-white py-3 px-4 text-center rounded-t-xl">
          <h2 className="text-xl font-bold">Consulta de Estado de Servicio</h2>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6">
          <Suspense fallback={<SectionLoader />}>
            <StatusCheckForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAccountModal, setShowAccountModal] = useState(false);
  
  // Controlador unificado para mostrar el modal
  const handleOpenModal = () => {
    console.log("Abriendo modal de consulta");
    setShowAccountModal(true);
  };
  
  // Controlador para cerrar el modal
  const handleCloseModal = () => {
    console.log("Cerrando modal de consulta");
    setShowAccountModal(false);
  };

  // Crear un manejador de eventos personalizado para la comunicación entre componentes
  useEffect(() => {
    // Función que maneja el evento personalizado
    const handleCustomEvent = () => {
      console.log("Evento personalizado recibido");
      handleOpenModal();
    };
    
    // Registrar el evento en el documento
    document.addEventListener('OPEN_CONSULTA_MODAL', handleCustomEvent);
    
    // Limpiar el evento al desmontar el componente
    return () => {
      document.removeEventListener('OPEN_CONSULTA_MODAL', handleCustomEvent);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'payment':
        return (
          <Suspense fallback={<SectionLoader />}>
            <PaymentPage />
          </Suspense>
        );
      default:
        return (
          <>
            <Suspense fallback={<SectionLoader />}>
              <HeroSection />
            </Suspense>
            
            {/* Botón grande y visible de Consultar Estado de Servicio en la parte superior */}
            <div className="flex justify-center -mt-16 mb-12 relative z-10">
              <button
                type="button"
                onClick={handleOpenModal}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-full shadow-lg flex items-center text-lg transition-all transform hover:scale-105"
              >
                <CheckCircle2 className="mr-2 h-6 w-6" />
                Consultar Estado de Servicio
              </button>
            </div>
            
            {/* Otros componentes de la página de inicio */}
            {/* About Section */}
            <section className="py-20 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-6">¿Por qué elegir Nodo Cero?</h2>
                    <div className="space-y-6">
                      {[
                        {
                          title: "Experiencia Local",
                          description: "Conocemos las necesidades específicas del norte de Chile y brindamos soluciones adaptadas a nuestra región."
                        },
                        {
                          title: "Tecnología de Vanguardia",
                          description: "Implementamos las últimas innovaciones en conectividad y servicios digitales."
                        },
                        {
                          title: "Compromiso con la Calidad",
                          description: "Garantizamos un servicio confiable y soporte técnico especializado 24/7."
                        },
                        {
                          title: "Soluciones Integrales",
                          description: "Desde internet hasta IA, ofrecemos todo lo que tu negocio necesita para crecer."
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <img 
                        src="https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
                        alt="Tecnología en acción"
                        className="rounded-lg shadow-lg"
                      />
                      <img 
                        src="https://images.unsplash.com/photo-1557424120-f27d89b0e562?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
                        alt="Conectividad"
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="space-y-4 pt-8">
                      <img 
                        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
                        alt="Equipo técnico"
                        className="rounded-lg shadow-lg"
                      />
                      <img 
                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80"
                        alt="Servicio al cliente"
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Suspense fallback={<SectionLoader />}>
              <ServicesSection />
            </Suspense>

            {/* Botón adicional de consulta en medio de la página para mayor visibilidad */}
            <div className="flex justify-center my-12">
              <button
                type="button"
                onClick={handleOpenModal}
                className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-full shadow-lg flex items-center text-lg transition-all transform hover:scale-105"
              >
                <Search className="mr-2 h-6 w-6" />
                Consultar mi Estado de Cuenta
              </button>
            </div>

            {/* Plans Section */}
            <section id="planes" className="py-16 px-6">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-4">Planes de Internet</h2>
                <p className="text-center text-gray-600 mb-12">Precios competitivos para la zona norte de Chile</p>
                
                {/* Internet Plans */}
                <div className="grid md:grid-cols-4 gap-8 mb-16">
                  {[
                    {
                      name: "Internet Inalámbrico Básico",
                      price: "19.990",
                      speed: "20 Mbps",
                      features: [
                        "Ideal para zonas rurales",
                        "Sin límite de descarga",
                        "Instalación incluida",
                        "Soporte técnico 24/7"
                      ]
                    },
                    {
                      name: "Fibra Óptica Hogar",
                      price: "25.990",
                      speed: "200 Mbps",
                      features: [
                        "Velocidad simétrica",
                        "Router WiFi 6 incluido",
                        "Instalación gratuita",
                        "Soporte prioritario"
                      ]
                    },
                    {
                      name: "Fibra Óptica Empresa",
                      price: "45.990",
                      speed: "500 Mbps",
                      features: [
                        "IP fija incluida",
                        "Velocidad garantizada",
                        "Atención preferencial",
                        "SLA empresarial"
                      ]
                    },
                    {
                      name: "Internet Satelital",
                      price: "35.990",
                      speed: "50 Mbps",
                      features: [
                        "Cobertura en cualquier lugar",
                        "Equipo satelital incluido",
                        "Instalación profesional",
                        "Soporte técnico 24/7"
                      ]
                    }
                  ].map((plan, index) => (
                    <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">$</span>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-lg text-gray-500">/mes</span>
                      </div>
                      <div className="mt-2 text-emerald-600 font-semibold">{plan.speed}</div>
                      <ul className="mt-6 space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <svg className="h-5 w-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full mt-8 bg-black text-white py-2 rounded-full hover:bg-gray-800 transition">
                        Contratar
                      </button>
                    </div>
                  ))}
                </div>

                {/* Hosting Plans */}
                <h2 className="text-3xl font-bold text-center mb-12">Planes de Hosting</h2>
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {[
                    {
                      name: "Hosting Básico",
                      price: "5.990",
                      features: [
                        "5 GB SSD",
                        "10 Cuentas de correo",
                        "Certificado SSL gratis",
                        "1 Dominio"
                      ]
                    },
                    {
                      name: "Hosting Emprendedor",
                      price: "12.990",
                      features: [
                        "20 GB SSD",
                        "50 Cuentas de correo",
                        "SSL Wildcard",
                        "3 Dominios"
                      ]
                    },
                    {
                      name: "Hosting Empresarial",
                      price: "25.990",
                      features: [
                        "50 GB SSD",
                        "Correos ilimitados",
                        "SSL Wildcard",
                        "Dominios ilimitados"
                      ]
                    }
                  ].map((plan, index) => (
                    <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">$</span>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-lg text-gray-500">/mes</span>
                      </div>
                      <ul className="mt-6 space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <svg className="h-5 w-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full mt-8 bg-black text-white py-2 rounded-full hover:bg-gray-800 transition">
                        Contratar
                      </button>
                    </div>
                  ))}
                </div>

                {/* AI Integration Plans */}
                <h2 className="text-3xl font-bold text-center mb-12">Planes de Integración IA</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      name: "IA Starter",
                      price: "29.990",
                      features: [
                        "Chatbot básico",
                        "Análisis de datos simple",
                        "1 Asistente virtual",
                        "Soporte por email"
                      ]
                    },
                    {
                      name: "IA Business",
                      price: "59.990",
                      features: [
                        "Chatbot avanzado",
                        "Análisis predictivo",
                        "3 Asistentes virtuales",
                        "Soporte 24/7"
                      ]
                    },
                    {
                      name: "IA Enterprise",
                      price: "129.990",
                      features: [
                        "IA personalizada",
                        "Análisis avanzado",
                        "Asistentes ilimitados",
                        "Soporte dedicado"
                      ]
                    }
                  ].map((plan, index) => (
                    <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">$</span>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-lg text-gray-500">/mes</span>
                      </div>
                      <ul className="mt-6 space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <svg className="h-5 w-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full mt-8 bg-black text-white py-2 rounded-full hover:bg-gray-800 transition">
                        Contratar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation con la prop correcta */}
      <Navigation onOpenModal={handleOpenModal} />
      
      {/* Botón flotante siempre visible */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg z-40 flex items-center"
      >
        <Search className="w-5 h-5 mr-2" />
        <span>Consultar Estado</span>
      </button>
      
      {/* Navigation pills */}
      <div className="flex justify-center mt-4 mb-6">
        <div className="bg-white p-1 rounded-full shadow flex">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`px-4 py-2 rounded-full ${currentPage === 'home' ? 'bg-emerald-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Inicio
          </button>
          <button 
            onClick={() => setCurrentPage('payment')}
            className={`px-4 py-2 rounded-full ${currentPage === 'payment' ? 'bg-emerald-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Realizar Pago
          </button>
        </div>
      </div>
      
      {/* Test Modal Component */}
      <div className="fixed bottom-4 left-4 z-30">
        <TestModal />
      </div>
      
      {/* Nuevo componente de consulta */}
      <SimpleConsultaModal />
      
      {renderPage()}
      
      {/* Modal de consulta con estado unificado */}
      <AccountModal isOpen={showAccountModal} onClose={handleCloseModal} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Nodo Cero</h3>
            <p className="text-gray-400">Soluciones digitales avanzadas para el norte de Chile.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Internet</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Hosting</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Inteligencia Artificial</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Desarrollo Web</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Centro de Ayuda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Estado del Servicio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <p className="text-gray-400">Antofagasta, Chile</p>
            <p className="text-gray-400">info@nodocero.cl</p>
            <p className="text-gray-400">+56 9 1234 5678</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white hover:text-emerald-500 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-emerald-500 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-emerald-500 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 max-w-7xl mx-auto">
          <p className="text-center text-gray-400">© 2023 Nodo Cero. Todos los derechos reservados.</p>
          <p className="text-center text-gray-400 mt-2">
            <span>Pagos seguros</span> <CreditCard className="inline-block w-5 h-5 ml-1" />
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;