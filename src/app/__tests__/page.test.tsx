import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Home from '../page';

describe('Home', () => {
  it('renders the introduction paragraph', () => {
    render(<Home />);
    const intro = screen.getByText(/Unlock the power of your Notion content/i);
    expect(intro).toBeInTheDocument();
  });

  it('renders the "Feedback Hub" section', () => {
    render(<Home />);
    const feedbackSection = screen.getByRole('link', { name: /Feedback Hub/i });
    expect(feedbackSection).toHaveAttribute('href', '/daily-record');
    const feedbackButton = screen.getByRole('button', {
      name: /Give Feedback/i,
    });
    expect(feedbackButton).toBeInTheDocument();
  });

  it('renders the "Demo Showcase" section', () => {
    render(<Home />);
    const demoSection = screen.getByRole('link', { name: /Demo Showcase/i });
    expect(demoSection).toHaveAttribute('href', '/blog');
    const demoButton = screen.getByRole('button', { name: /View Demo/i });
    expect(demoButton).toBeInTheDocument();
  });

  it('renders the "Custom Solutions" section', () => {
    render(<Home />);
    const customSection = screen.getByRole('link', {
      name: /Custom Solutions/i,
    });
    expect(customSection).toHaveAttribute('href', '/contact');
    const contactButton = screen.getByRole('button', { name: /Contact Us/i });
    expect(contactButton).toBeInTheDocument();
  });

  it('renders the "Empower Your Content" text', () => {
    render(<Home />);
    const empowerText = screen.getByText(/Empower Your Content with/i);
    expect(empowerText).toBeInTheDocument();
  });
});
