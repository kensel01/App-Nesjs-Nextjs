import React from 'react';
import { Network } from 'lucide-react';

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection; 