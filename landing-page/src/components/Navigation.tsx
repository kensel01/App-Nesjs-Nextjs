import React from 'react';
import { CircuitBoard } from 'lucide-react';

const Navigation = () => {
  return (
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
  );
};

export default Navigation; 