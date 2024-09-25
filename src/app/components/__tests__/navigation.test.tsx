import React from 'react';

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import Navigation from '../Navigation';

// Mock the usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navigation', () => {
  it('renders correctly', () => {
    render(<Navigation />);
    expect(screen.getByText('Content Publisher')).toBeInTheDocument();
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
    expect(screen.getByText('Daily Record')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Navigation />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });

    // Check initial state
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    // Close menu
    fireEvent.click(menuButton);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });
});
