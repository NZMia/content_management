import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Contact from '../page';

describe('Contact', () => {
  it('renders the contact information', () => {
    render(<Contact />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Content Publisher Team')).toBeInTheDocument();
    expect(screen.getByText('Customer Support')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(
      screen.getByText('support@contentpublisher.com')
    ).toBeInTheDocument();
    expect(screen.getByText('Phone:')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('Address:')).toBeInTheDocument();
    expect(screen.getByText(/123 Publisher Street/)).toBeInTheDocument();
    expect(screen.getByText(/San Francisco, CA 94105/)).toBeInTheDocument();
    expect(screen.getByText(/United States/)).toBeInTheDocument();
    expect(screen.getByText('Business Hours:')).toBeInTheDocument();
    expect(
      screen.getByText(/Monday - Friday: 9:00 AM - 5:00 PM \(PST\)/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Saturday - Sunday: Closed/)).toBeInTheDocument();
  });
});
