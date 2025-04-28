import React, { Suspense, lazy } from 'react';
import { Network } from 'lucide-react';

// Import the StatusCheckForm lazily
const StatusCheckForm = lazy(() => import('./StatusCheckForm'));

// Loader component for suspense
const FormLoader = () => (
  <div className="bg-white shadow-xl rounded-xl p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-10 bg-gray-200 rounded mb-4"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

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
              <a href="#consulta" className="bg-emerald-500 text-black px-8 py-4 rounded-full font-semibold hover:bg-emerald-400 transition flex items-center justify-center">
                <Network className="w-5 h-5 mr-2" />
                Consultar Estado
              </a>
              <a href="#planes" className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition">
                Ver Planes
              </a>
            </div>
          </div>
          <Suspense fallback={<FormLoader />}>
            <StatusCheckForm />
          </Suspense>
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