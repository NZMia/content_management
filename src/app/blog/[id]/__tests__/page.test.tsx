import React from 'react';

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

import BlogPostPage from '../page';

// Mock the useParams hook
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'test-id' }),
}));

// Mock the fetch function
global.fetch = jest.fn();

// Mock the notion-blocks components
jest.mock(
  '../../../components/notion-blocks/BulletedListItem',
  () =>
    ({ block }: { block: any }) => <div>BulletedListItem: {block.id}</div>
);
jest.mock(
  '../../../components/notion-blocks/Callout',
  () =>
    ({ block }: { block: any }) => <div>Callout: {block.id}</div>
);
jest.mock(
  '../../../components/notion-blocks/Code',
  () =>
    ({ block }: { block: any }) => <div>Code: {block.id}</div>
);
jest.mock(
  '../../../components/notion-blocks/Heading',
  () =>
    ({ block }: { block: any }) => <div>Heading: {block.id}</div>
);
jest.mock(
  '../../../components/notion-blocks/Paragraph',
  () =>
    ({ block }: { block: any }) => <div>Paragraph: {block.id}</div>
);
jest.mock(
  '../../../components/notion-blocks/Quote',
  () =>
    ({ block }: { block: any }) => <div>Quote: {block.id}</div>
);
jest.mock(
  '../../../components/notion-blocks/Toggle',
  () =>
    ({ block }: { block: any }) => <div>Toggle: {block.id}</div>
);

describe('BlogPostPage component', () => {
  const mockPost = {
    id: 'test-id',
    properties: 'Test Blog Post',
    tags: ['tag1', 'tag2'],
    published: true,
    createdBy: 'Test Author',
    createdAt: '2023-04-20T08:00:00Z',
    coverImage: 'https://example.com/image.jpg',
    content: [
      { id: '1', type: 'paragraph' },
      { id: '2', type: 'heading_1' },
      { id: '3', type: 'code' },
      { id: '4', type: 'quote' },
      { id: '5', type: 'callout' },
      { id: '6', type: 'toggle' },
      { id: '7', type: 'bulleted_list_item' },
    ],
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPost,
    });
  });

  it('renders blog post after loading', async () => {
    render(<BlogPostPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    expect(screen.getByText('By Test Author on 4/20/2023')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();

    expect(screen.getByText('Paragraph: 1')).toBeInTheDocument();
    expect(screen.getByText('Heading: 2')).toBeInTheDocument();
    expect(screen.getByText('Code: 3')).toBeInTheDocument();
    expect(screen.getByText('Quote: 4')).toBeInTheDocument();
    expect(screen.getByText('Callout: 5')).toBeInTheDocument();
    expect(screen.getByText('Toggle: 6')).toBeInTheDocument();
    expect(screen.getByText('BulletedListItem: 7')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    render(<BlogPostPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Error: Error fetching blog post')
      ).toBeInTheDocument();
    });
  });
});
