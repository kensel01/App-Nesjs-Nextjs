'use client';

import { MdDarkMode, MdLightMode, MdLogout, MdMenu } from 'react-icons/md';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarStore } from '@/store/sidebar';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { handleLogout } = useAuth();
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow">
      <div className="flex justify-between items-center px-4 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
          aria-label="Toggle sidebar"
        >
          <MdMenu className="w-6 h-6" />
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <MdLightMode className="w-6 h-6" />
            ) : (
              <MdDarkMode className="w-6 h-6" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <MdLogout className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
} 