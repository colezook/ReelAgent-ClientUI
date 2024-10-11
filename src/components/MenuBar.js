import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';

const MenuBar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = (pathname) => router.pathname === pathname;

  const linkClass = (pathname) => `
    px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
    ${isActive(pathname)
      ? 'bg-purple-700 text-white'
      : theme === 'dark'
        ? 'text-gray-300 hover:bg-purple-800 hover:text-white'
        : 'text-gray-800 hover:bg-purple-200 hover:text-gray-900'
    }
  `;

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 shadow-md h-20 ${theme === 'dark' ? 'bg-black' : styles['light-colorful-bg']}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className={`${styles.titleBubble} text-2xl font-bold text-white`}>
                V-Brain 1.1
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/start" className={linkClass('/start')}>
                  Start
                </Link>
                <Link href="/trending" className={linkClass('/trending')}>
                  Trending Posts
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-200'}`}
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
