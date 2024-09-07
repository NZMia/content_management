'use client';

import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    document.body.style.color = isDarkMode
      ? 'rgb(255, 255, 255)'
      : 'rgb(0, 0, 0)';
    document.body.style.backgroundColor = isDarkMode
      ? 'rgb(0, 0, 0)'
      : 'rgb(255, 255, 255)';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white ${
        isDarkMode ? 'bg-white' : 'bg-black'
      }`}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}
