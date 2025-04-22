import React from 'react';
import { CircuitBoard, Phone, Server, Shield, CreditCard, MessageSquare, Wifi, Globe, Bot, FileCode, Satellite, CheckCircle2, Network } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-black py-4 px-6 fixed w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CircuitBoard className="h-8 w-8 text-emerald-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Nodo Cero
            </span>
          </div>
          <div className="hidden md:flex space-x-6 text-gray-300">
            <a href="#inicio" className="hover:text-emerald-400 transition">Inicio</a>
            <a href="#servicios" className="hover:text-emerald-400 transition">Servicios</a>
            <a href="#planes" className="hover:text-emerald-400 transition">Planes</a>
            <a href="#contacto" className="hover:text-emerald-400 transition">Contacto</a>
          </div>
          <button className="bg-emerald-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-emerald-500 transition">
            Mi Cuenta
          </button>
        </div>
      </nav>

      {/* Hero Section Mejorado */}
      <section id="inicio" className="pt-24 pb-12 px-6 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center py-16">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-emerald-400/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold">
                  Innovación Digital para el Norte
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Transformamos la 
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"> Conectividad</span> del Norte de Chile
              </h1>
              <p className="text-xl text-gray-300">
                Somos pioneros en soluciones tecnológicas integrales, llevando internet de alta velocidad y servicios digitales avanzados a cada rincón del norte chileno.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-emerald-500 text-black px-8 py-4 rounded-full font-semibold hover:bg-emerald-400 transition flex items-center justify-center">
                  <Network className="w-5 h-5 mr-2" />
                  Verificar Cobertura
                </button>
                <button className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition">
                  Conoce Nuestros Planes
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 rounded-2xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Tecnología y conectividad"
                className="rounded-2xl shadow-2xl relative z-10"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-white/10">
            <div>
              <div className="text-4xl font-bold text-emerald-400">10+</div>
              <div className="text-gray-400 mt-2">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400">50k+</div>
              <div className="text-gray-400 mt-2">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400">98%</div>
              <div className="text-gray-400 mt-2">Uptime Garantizado</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400">24/7</div>
              <div className="text-gray-400 mt-2">Soporte Técnico</div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Services Section */}
      <section id="servicios" className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="h-8 w-8 text-emerald-500" />,
                title: "Hosting Web Profesional",
                description: "Alojamiento seguro y veloz para tu sitio web con soporte 24/7"
              },
              {
                icon: <Bot className="h-8 w-8 text-emerald-500" />,
                title: "Integración de IA",
                description: "Potencia tu emprendimiento con agentes de inteligencia artificial personalizados"
              },
              {
                icon: <Wifi className="h-8 w-8 text-emerald-500" />,
                title: "Internet Fibra/Inalámbrico",
                description: "Conexiones de alta velocidad para zonas urbanas y rurales"
              },
              {
                icon: <Satellite className="h-8 w-8 text-emerald-500" />,
                title: "Internet Satelital",
                description: "Conectividad garantizada en cualquier ubicación del norte de Chile"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                {service.icon}
                <h3 className="text-xl font-semibold mt-4">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
                {(service.title === "Internet Fibra/Inalámbrico" || service.title === "Internet Satelital") && (
                  <button className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
                    Verificar disponibilidad →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Contact Section */}
      <section id="contacto" className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-emerald-500" />
                <span>+56 9 1234 5678</span>
              </div>
              <div className="flex items-center space-x-4">
                <MessageSquare className="h-6 w-6 text-emerald-500" />
                <span>contacto@nodocero.cl</span>
              </div>
              <div className="flex items-center space-x-4">
                <CreditCard className="h-6 w-6 text-emerald-500" />
                <span>Pagos seguros</span>
              </div>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              <input
                type="text"
                placeholder="Dirección (para verificar cobertura)"
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              <textarea
                placeholder="Mensaje"
                rows={4}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              <button className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <CircuitBoard className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold text-emerald-400">Nodo Cero</span>
            </div>
            <p className="mt-4">Conectividad e innovación para el norte de Chile</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li>Internet Fibra Óptica</li>
              <li>Internet Inalámbrico</li>
              <li>Internet Satelital</li>
              <li>Hosting Web</li>
              <li>Soluciones IA</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>Sobre Nosotros</li>
              <li>Cobertura</li>
              <li>Blog</li>
              <li>Contacto</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>Términos y Condiciones</li>
              <li>Política de Privacidad</li>
              <li>Política de Cookies</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;