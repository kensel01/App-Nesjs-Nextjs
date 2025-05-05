import React from 'react';
import { CircuitBoard, UserCircle2 } from 'lucide-react';

// Definimos la nueva interfaz de props
interface NavigationProps {
  onOpenModal: () => void;
}

const Navigation = ({ onOpenModal }: NavigationProps) => {
  const handleAccountButtonClick = (e: any) => {
    e.preventDefault();
    console.log("Botón Mi Cuenta clickeado en Navigation");
    
    // Usar directamente la función prop en lugar de eventos
    onOpenModal();
  };

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
        <button 
          type="button"
          onClick={handleAccountButtonClick}
          className="bg-emerald-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-emerald-500 transition flex items-center"
        >
          <UserCircle2 className="mr-2 h-5 w-5" />
          Mi Cuenta
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 