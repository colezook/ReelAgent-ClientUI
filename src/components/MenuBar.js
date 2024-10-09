import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const MenuBar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = (pathname) => router.pathname === pathname;

  const linkClass = (pathname) => `
    px-3 py-2 rounded-md text-sm font-medium
    ${isActive(pathname)
      ? theme === 'dark'
        ? 'bg-orange-600 text-white'
        : 'bg-blue-600 text-white'
      : theme === 'dark'
      ? 'text-gray-300 hover:bg-orange-700 hover:text-white'
      : 'text-gray-700 hover:bg-blue-700 hover:text-white'
    }
  `;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/trending" className="text-2xl font-bold text-gray-800 dark:text-white">
                VBrain
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/trending" className={linkClass('/trending')}>
                  Trending Posts
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;