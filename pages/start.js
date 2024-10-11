import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import MenuBar from '../src/components/MenuBar';

export default function Start() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'} text-gray-800 dark:text-white`}>
      <Head>
        <title>Viral Brain - Start</title>
        <meta name="description" content="Welcome to Viral Brain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuBar />

      <main className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Viral Brain</h1>
        <p className="text-xl text-center mb-8">Discover trending viral content and boost your social media presence.</p>
        <div className="flex justify-center">
          <Link href="/trending" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full text-lg transition-colors duration-200">
            Start Exploring
          </Link>
        </div>
      </main>

      <footer className="text-center py-4 bg-gray-100 dark:bg-gray-800">
        <a
          href="https://your-company-website.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Powered by Viral Brain
        </a>
      </footer>
    </div>
  );
}