import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const MenuBar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-gray-800 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between flex-1">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold">
                VBrain
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/trending" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Trending Posts
                </Link>
                <Link href="/database" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  My Database
                </Link>
                <Link href="/profile" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  My Profile
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;