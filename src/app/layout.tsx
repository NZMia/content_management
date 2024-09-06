import React from 'react';

import { Inter } from 'next/font/google';

import Footer from './components/Footer';
import Navigation from './components/Navigation';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Mia's Portfolio",
  description: 'Full-stack developer crafting innovative digital experiences',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white`}
      >
        <Navigation />
        <main className="flex flex-grow flex-col items-center justify-center p-8 pt-20">
          <div className="w-full max-w-4xl">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
