import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Footer from '../Footer';

describe('Footer', () => {
  it('renders correctly', () => {
    render(<Footer />);

    // Check if the copyright notice is present
    expect(
      screen.getByText(/© \d{4} Mia's Portfolio\. All rights reserved\./)
    ).toBeInTheDocument();

    // Check if the links are present
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('has correct link destinations', () => {
    render(<Footer />);

    const privacyLink = screen.getByText('Privacy Policy');
    const termsLink = screen.getByText('Terms of Service');
    const githubLink = screen.getByText('GitHub');

    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/yourusername'
    );
  });

  it('has correct styling', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-white');
    expect(footer).toHaveClass('dark:bg-black');
    expect(footer).toHaveClass('border-t');
    expect(footer).toHaveClass('border-gray-200');
    expect(footer).toHaveClass('dark:border-gray-800');
  });
});
