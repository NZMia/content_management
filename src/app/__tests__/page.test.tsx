import React from 'react';

import { render, screen } from '@testing-library/react';

import Home from '../page';

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent("Hi, I'm Mia");
  });

  it('renders the introduction paragraph', () => {
    render(<Home />);
    const intro = screen.getByText(/A passionate full-stack developer/i);
    expect(intro).toBeInTheDocument();
  });

  it('renders the "View Projects" button', () => {
    render(<Home />);
    const projectsButton = screen.getByRole('link', { name: /View Projects/i });
    expect(projectsButton).toHaveAttribute('href', '#projects');
  });

  it('renders the "Contact Me" button', () => {
    render(<Home />);
    const contactButton = screen.getByRole('link', { name: /Contact Me/i });
    expect(contactButton).toHaveAttribute('href', '#contact');
  });

  it('renders the "Let\'s build something great together" section', () => {
    render(<Home />);
    const sectionHeading = screen.getByRole('heading', {
      name: /Let's build something great together/i,
    });
    expect(sectionHeading).toBeInTheDocument();
    const learnMoreLink = screen.getByRole('link', {
      name: /Learn more about my journey/i,
    });
    expect(learnMoreLink).toHaveAttribute('href', '#about');
  });

  //   it('renders the "Tech Stack" section', () => {
  //     render(<Home />);
  //     const techStackHeading = screen.getByRole('heading', { name: /Tech Stack/i });
  //     expect(techStackHeading).toBeInTheDocument();
  //     const techItems = screen.getAllByRole('generic', { name: '' });
  //     expect(techItems).toHaveLength(6); // Assuming 6 tech stack items
  //     expect(screen.getByText('React')).toBeInTheDocument();
  //     expect(screen.getByText('Next.js')).toBeInTheDocument();
  //     expect(screen.getByText('TypeScript')).toBeInTheDocument();
  //     expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
  //     expect(screen.getByText('Node.js')).toBeInTheDocument();
  //     expect(screen.getByText('GraphQL')).toBeInTheDocument();
  //   });
});
