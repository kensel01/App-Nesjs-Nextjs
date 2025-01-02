import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  openSubmenuIndex: number | null;
  setIsOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  toggleSubmenu: (index: number) => void;
}

export const useSidebar = create<SidebarState>()((set) => ({
  isOpen: true,
  openSubmenuIndex: null,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleSubmenu: (index: number) =>
    set((state) => ({
      openSubmenuIndex: state.openSubmenuIndex === index ? null : index,
    })),
})); 