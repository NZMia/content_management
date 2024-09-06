import React from 'react';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-gray-200 border-t bg-white dark:border-gray-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Mia's Portfolio. All rights
              reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-gray-600 dark:text-gray-400 text-sm hover:text-black dark:hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 dark:text-gray-400 text-sm hover:text-black dark:hover:text-white"
            >
              Terms of Service
            </Link>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 text-sm hover:text-black dark:hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
