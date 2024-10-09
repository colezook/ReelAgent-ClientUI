import React from 'react';
import Head from 'next/head';
import MenuBar from '../src/components/MenuBar';

export default function Database() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Head>
        <title>Viral Brain - Your Database</title>
        <meta name="description" content="Your personal viral content database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuBar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-purple-600 dark:text-purple-400 mb-8">
          Your Database
        </h1>
        <p className="text-center">
          This page is under construction. Your personal database content will be displayed here soon.
        </p>
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 py-4 text-center">
        <a
          href="https://your-company-website.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
        >
          Powered by Viral Brain
        </a>
      </footer>
    </div>
  );
}