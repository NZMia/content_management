import React from 'react';

import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';

import ThemeToggle from '../ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset the body classes and styles before each test
    document.body.className = '';
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
  });

  it('renders correctly', () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    expect(button).toHaveTextContent('🌙');
  });

  it('toggles theme on click', () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    expect(button).toHaveClass('bg-black');
    expect(button).toHaveTextContent('🌙');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveTextContent('☀️');
  });

  it('updates body classes and styles when toggling theme', () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');

    fireEvent.click(button);

    expect(document.body.classList.contains('dark')).toBe(true);
    expect(document.body.style.backgroundColor).toBe('rgb(0, 0, 0)');
    expect(document.body.style.color).toBe('rgb(255, 255, 255)');

    fireEvent.click(button);

    expect(document.body.classList.contains('dark')).toBe(false);
    expect(document.body.style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(document.body.style.color).toBe('rgb(0, 0, 0)');
  });

  it('initializes with light theme', () => {
    render(<ThemeToggle />);
    expect(document.body.classList.contains('dark')).toBe(false);
    expect(document.body.style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(document.body.style.color).toBe('rgb(0, 0, 0)');
  });

  it('persists theme across re-renders', () => {
    const { rerender, getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');

    fireEvent.click(button);
    expect(document.body.classList.contains('dark')).toBe(true);

    rerender(<ThemeToggle />);
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  it('applies theme effect on mount and toggle', () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button', { name: /toggle theme/i });

    // Initial state (light mode)
    expect(document.body.classList.contains('dark')).toBe(false);
    expect(document.body.style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(document.body.style.color).toBe('rgb(0, 0, 0)');
    expect(button.textContent).toBe('🌙');

    // Toggle to dark mode
    fireEvent.click(button);
    expect(document.body.classList.contains('dark')).toBe(true);
    expect(document.body.style.backgroundColor).toBe('rgb(0, 0, 0)');
    expect(document.body.style.color).toBe('rgb(255, 255, 255)');
    expect(button.textContent).toBe('☀️');

    // Toggle back to light mode
    fireEvent.click(button);

    expect(document.body.classList.contains('dark')).toBe(false);
    expect(document.body.style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(document.body.style.color).toBe('rgb(0, 0, 0)');
    expect(button.textContent).toBe('🌙');
  });

  it('initializes with system preference for light mode', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');

    expect(document.body.classList.contains('dark')).toBe(false);
    expect(document.body.style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(document.body.style.color).toBe('rgb(0, 0, 0)');
    expect(button.textContent).toBe('🌙');
  });

  it('applies correct classes to button', () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');

    expect(button).toHaveClass(
      'text-gray-600',
      'hover:text-black',
      'px-3',
      'py-2',
      'rounded-md',
      'text-sm',
      'font-medium'
    );

    fireEvent.click(button);

    expect(button).toHaveClass('dark:text-gray-300', 'dark:hover:text-white');
  });
});
