import React from 'react';

import { render, screen } from '@testing-library/react';

import RootLayout from '../layout';

// Mock the Navigation and Footer components
jest.mock('../components/Navigation', () => {
  return function MockNavigation() {
    return <div data-testid="mock-navigation">Navigation</div>;
  };
});

jest.mock('../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="mock-footer">Footer</div>;
  };
});

describe('RootLayout', () => {
  it('renders children and layout components', () => {
    render(
      <RootLayout>
        <div data-testid="mock-children">Test Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  //   it('applies correct classes to body', () => {
  //     render(
  //       <RootLayout>
  //         <div>Test Content</div>
  //       </RootLayout>
  //     );

  //     const body = screen.getByRole('body');
  //     expect(body).toHaveClass('flex', 'min-h-screen', 'flex-col', 'bg-white', 'text-black', 'transition-colors', 'duration-300', 'dark:bg-black', 'dark:text-white');
  //   });

  it('renders main content with correct classes', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass(
      'flex',
      'flex-grow',
      'flex-col',
      'items-center',
      'justify-center',
      'p-8',
      'pt-20'
    );
  });

  //   it('sets correct lang attribute on html element', () => {
  //     render(
  //       <RootLayout>
  //         <div>Test Content</div>
  //       </RootLayout>
  //     );

  //     const html = document.documentElement;
  //     expect(html).toHaveAttribute('lang', 'en');
  //   });
});
