import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarStore {
  isOpen: boolean;
  isMobile: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  toggle: () => void;
}

// Detectar si es un dispositivo móvil basado en el ancho de la pantalla
const checkIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024; // 1024px es el breakpoint lg de Tailwind
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: !checkIsMobile(), // Por defecto, abierto en desktop y cerrado en móvil
      isMobile: checkIsMobile(),
      setIsOpen: (isOpen) => set({ isOpen }),
      setIsMobile: (isMobile) => set({ isMobile }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'sidebar-store',
    }
  )
); 