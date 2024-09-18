import React from 'react';

import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';

import Blog from '../page';

// Mock the fetch function
global.fetch = jest.fn();

describe('Blog component', () => {
  const mockPosts = [
    {
      id: '1',
      properties: 'Test Post 1',
      tags: ['tag1', 'tag2'],
      published: true,
      createdBy: 'Test Author',
      createdAt: '2023-04-20T08:00:00Z',
      coverImage: 'https://example.com/image1.jpg',
    },
    {
      id: '2',
      properties: 'Test Post 2',
      tags: ['tag3'],
      published: true,
      createdBy: 'Another Author',
      createdAt: '2023-04-21T08:00:00Z',
      coverImage: null,
    },
  ];

  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });
  });

  it('renders blog posts after loading', async () => {
    await act(async () => {
      render(<Blog />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });

    expect(screen.getByText('By Test Author on 4/20/2023')).toBeInTheDocument();
    expect(
      screen.getByText('By Another Author on 4/21/2023')
    ).toBeInTheDocument();

    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();

    const readMoreLinks = screen.getAllByText('Read more');
    expect(readMoreLinks).toHaveLength(2);
    expect(readMoreLinks[0]).toHaveAttribute('href', '/blog/1');
    expect(readMoreLinks[1]).toHaveAttribute('href', '/blog/2');
  });

  it('renders error state when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    await act(async () => {
      render(<Blog />);
    });

    await waitFor(() => {
      expect(
        screen.getByText('Error: Error fetching blog posts')
      ).toBeInTheDocument();
    });
  });
});
