import Head from "next/head";
import { useTheme } from "next-themes";
import MenuBar from "../src/components/MenuBar";
import type { NextPage } from 'next';

const Database: NextPage = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"} text-gray-800 dark:text-white`}
    >
      <Head>
        <title>Viral Brain - Database</title>
        <meta name="description" content="Your video database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuBar />

      <main className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Your Video Database
        </h1>
        <p className="text-xl text-center mb-8">
          Coming soon...
        </p>
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
};

export default Database;