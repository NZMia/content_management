import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import RootLayout from '../layout';

// Mock the Navigation component
jest.mock('../components/Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="mock-navigation">Mock Navigation</nav>;
  };
});

// Mock the Footer component
jest.mock('../components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="mock-footer">Mock Footer</footer>;
  };
});

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('RootLayout', () => {
  it('renders the layout structure correctly', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="mock-children">Test Content</div>
      </RootLayout>
    );

    // Check if the html element has the correct lang attribute
    const htmlElement = container.querySelector('html');
    expect(htmlElement).toHaveAttribute('lang', 'en');

    // Check if the body has the correct classes
    const bodyElement = container.querySelector('body');
    expect(bodyElement).toHaveClass(
      'flex',
      'min-h-screen',
      'flex-col',
      'bg-white',
      'text-black',
      'transition-colors',
      'duration-300',
      'dark:bg-black',
      'dark:text-white'
    );

    // Check if the Navigation component is rendered
    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();

    // Check if the main element is rendered with correct classes
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass(
      'flex',
      'flex-grow',
      'flex-col',
      'items-center',
      'justify-center',
      'p-8',
      'pt-20'
    );

    // Check if the children are rendered within a div with correct classes
    const childrenContainer = screen.getByTestId('mock-children').parentElement;
    expect(childrenContainer).toHaveClass('w-full', 'max-w-4xl');

    // Check if the Footer component is rendered
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <RootLayout>
        <div data-testid="mock-children">Test Content</div>
      </RootLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
