import { Client } from '@notionhq/client';
import { NextRequest } from 'next/server';

import { GET } from '../blog/route';

const MOCK_BASE_URL = 'http://localhost:9999';

// Mock Notion API client
jest.mock('@notionhq/client', () => {
  const mockQuery = jest.fn().mockResolvedValue({
    results: [
      {
        id: 'post1',
        properties: {
          Name: { title: [{ plain_text: 'Test Post 1' }] },
          Tags: { multi_select: [{ name: 'tag1' }, { name: 'tag2' }] },
          Published: { checkbox: true },
          CreatedBy: { created_by: { name: 'Test Author' } },
          CreatedAt: { created_time: '2023-04-20T08:00:00Z' },
        },
        cover: {
          type: 'external',
          external: { url: 'https://example.com/image1.jpg' },
        },
      },
      {
        id: 'post2',
        properties: {
          Name: { title: [{ plain_text: 'Test Post 2' }] },
          Tags: { multi_select: [{ name: 'tag2' }, { name: 'tag3' }] },
          Published: { checkbox: false },
          CreatedBy: { created_by: { name: 'Another Author' } },
          CreatedAt: { created_time: '2023-04-21T10:00:00Z' },
        },
        cover: {
          type: 'file',
          file: { url: 'https://example.com/image2.jpg' },
        },
      },
    ],
    has_more: false,
  });

  const mockClient = jest.fn().mockImplementation(() => ({
    databases: {
      query: mockQuery,
    },
    pages: {
      retrieve: jest.fn().mockImplementation(({ page_id }) => {
        if (page_id === 'non-existent-id') {
          throw new Error('Post not found');
        }
        if (page_id === 'invalid-post') {
          return Promise.reject({
            id: page_id,
            object: 'page',
          });
        }
        return Promise.resolve({
          id: page_id,
          properties: {
            Name: { title: [{ plain_text: 'Test Post 1' }] },
            Tags: { multi_select: [{ name: 'tag1' }, { name: 'tag2' }] },
            Published: { checkbox: true },
            CreatedBy: { created_by: { name: 'Test Author' } },
            CreatedAt: { created_time: '2023-04-20T08:00:00Z' },
          },
          cover: {
            type: 'external',
            external: { url: 'https://example.com/image1.jpg' },
          },
        });
      }),
    },
    blocks: {
      children: {
        list: jest.fn().mockResolvedValue({
          results: [
            { id: 'block1', type: 'paragraph' },
            { id: 'block2', type: 'heading_1' },
          ],
        }),
      },
    },
  }));

  return {
    Client: mockClient,
  };
});

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url) => ({
    url: url.startsWith('http') ? url : `${MOCK_BASE_URL}${url}`,
  })),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => data,
      status: init?.status || 200,
    })),
  },
}));

describe('API /api/blog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of blog posts', async () => {
      const mockReq = new NextRequest(`${MOCK_BASE_URL}/api/blog`);
      const response = await GET(mockReq);
      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toHaveLength(2);
      expect(jsonResponse[0]).toEqual({
        id: 'post1',
        properties: 'Test Post 1',
        tags: ['tag1', 'tag2'],
        published: true,
        createdBy: 'Test Author',
        createdAt: '2023-04-20T08:00:00Z',
        coverImage: 'https://example.com/image1.jpg',
        content: [],
      });
      expect(jsonResponse[1]).toEqual({
        id: 'post2',
        properties: 'Test Post 2',
        tags: ['tag2', 'tag3'],
        published: false,
        createdBy: 'Another Author',
        createdAt: '2023-04-21T10:00:00Z',
        coverImage: 'https://example.com/image2.jpg',
        content: [],
      });
    });

    it('should return a single blog post when id is provided', async () => {
      const mockReq = new NextRequest(`${MOCK_BASE_URL}/api/blog?id=post1`);
      const response = await GET(mockReq);
      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual({
        id: 'post1',
        properties: 'Test Post 1',
        tags: ['tag1', 'tag2'],
        published: true,
        createdBy: 'Test Author',
        createdAt: '2023-04-20T08:00:00Z',
        coverImage: 'https://example.com/image1.jpg',
        content: [
          { id: 'block1', type: 'paragraph' },
          { id: 'block2', type: 'heading_1' },
        ],
      });
    });

    it('should handle errors when fetching all posts', async () => {
      const mockError = new Error('Database query failed');
      const client = new Client();
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      jest.mocked(client.databases.query).mockRejectedValueOnce(mockError);

      const mockReq = new NextRequest(`${MOCK_BASE_URL}/api/blog`);
      const response = await GET(mockReq);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Error fetching blog posts',
      });
    });

    it('should handle errors when fetching a single post', async () => {
      const client = new Client();
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      jest
        .mocked(client.pages.retrieve)
        .mockRejectedValueOnce(new Error('Post not found'));

      const mockReq = new NextRequest(
        `${MOCK_BASE_URL}/api/blog?id=non-existent-id`
      );
      const response = await GET(mockReq);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Error fetching blog post by id',
      });
    });

    it('should handle empty results', async () => {
      const client = new Client();
      jest.mocked(client.databases.query).mockResolvedValueOnce({
        results: [],
        type: 'page_or_database',
        page_or_database: {},
        object: 'list',
        next_cursor: null,
        has_more: false,
      });

      const mockReq = new NextRequest(`${MOCK_BASE_URL}/api/blog`);
      const response = await GET(mockReq);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([]);
    });

    it('should handle invalid page object when fetching all posts', async () => {
      const client = new Client();
      jest.mocked(client.databases.query).mockResolvedValueOnce({
        results: [
          {
            id: 'invalid-post',
            properties: {},
            url: '',
            created_time: '',
            last_edited_time: '',
            created_by: { id: '', object: 'user' },
            last_edited_by: { id: '', object: 'user' },
            cover: null,
            icon: null,
            parent: { type: 'database_id', database_id: '' },
            archived: false,
            object: 'page',
          },
        ],
        type: 'page_or_database',
        page_or_database: {},
        object: 'list',
        next_cursor: null,
        has_more: false,
      });

      const mockReq = new NextRequest(`${MOCK_BASE_URL}/api/blog`);
      const response = await GET(mockReq);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([
        {
          content: [],
          coverImage: null,
          createdAt: '',
          createdBy: '',
          id: 'invalid-post',
          properties: '',
          published: false,
          tags: [],
        },
      ]);
    });

    it('should handle invalid page object when fetching a single post', async () => {
      const client = new Client();
      jest.mocked(client.pages.retrieve).mockResolvedValueOnce({
        id: 'invalid-post',
        object: 'page',
      });

      const mockReq = new NextRequest(
        `${MOCK_BASE_URL}/api/blog?id=invalid-post`
      );
      const response = await GET(mockReq);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Error fetching blog post by id',
      });
    });

    it('should handle missing properties in page object', async () => {
      const client = new Client();
      jest.mocked(client.pages.retrieve).mockResolvedValueOnce({
        id: 'invalid-post',
        properties: {},
        object: 'page',
      });

      const mockReq = new NextRequest(
        `${MOCK_BASE_URL}/api/blog?id=invalid-post`
      );
      const response = await GET(mockReq);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Error fetching blog post by id',
      });
    });
  });
});
