import React from 'react';
import { memo } from 'react';
import { Globe, Bot, Wifi, Satellite } from 'lucide-react';

interface ServiceCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const ServiceCard = memo(({ icon, title, description }: ServiceCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
    {icon}
    <h3 className="text-xl font-semibold mt-4">{title}</h3>
    <p className="text-gray-600 mt-2">{description}</p>
    {(title === "Internet Fibra/Inalámbrico" || title === "Internet Satelital") && (
      <button className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
        Verificar disponibilidad →
      </button>
    )}
  </div>
));

ServiceCard.displayName = 'ServiceCard';

const ServicesSection = () => {
  const services = [
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
  ];

  return (
    <section id="servicios" className="py-16 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 