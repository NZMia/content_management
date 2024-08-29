import { Client } from '@notionhq/client';
import { NextRequest } from 'next/server';

import { GET, POST, PUT, DELETE } from '../app/api/daily-records/route';
// Mock Notion API client
jest.mock('@notionhq/client', () => {
  const mockQuery = jest.fn().mockResolvedValue({
    results: [
      {
        id: 'test-id-1',
        properties: {
          Name: { title: [{ plain_text: 'Test Task 1' }] },
          Status: { status: { name: 'In Progress' } },
        },
      },
      {
        id: 'test-id-2',
        properties: {
          Name: { title: [{ plain_text: 'Test Task 2' }] },
          Status: { status: { name: 'Done' } },
        },
      },
    ],
  });

  const mockClient = jest.fn().mockImplementation(() => ({
    databases: {
      query: mockQuery,
    },
    pages: {
      create: jest.fn().mockImplementation(({ properties }) => {
        return Promise.resolve({
          id: 'new-todo-id',
          properties: {
            Name: {
              title: [
                {
                  plain_text: properties.Name.title[0]?.text.content || '',
                },
              ],
            },
            Status: {
              status: {
                name: properties.Status.status.name,
              },
            },
          },
        });
      }),
      update: jest.fn().mockImplementation(({ page_id, properties }) => {
        if (page_id === 'invalid-id' || page_id === 'non-existent-id') {
          throw new Error('Todo not found');
        }
        return Promise.resolve({ id: page_id, properties });
      }),
      delete: jest.fn().mockImplementation(({ page_id }) => {
        if (page_id === 'non-existent-id') {
          throw new Error('Todo not found');
        }
        return Promise.resolve({ id: page_id });
      }),
    },
  }));

  return {
    Client: mockClient,
  };
});

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => data,
      status: init?.status || 200,
    })),
  },
}));

describe('API /api/daily-records', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of todos', async () => {
      const response = await GET();
      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual([
        {
          id: 'test-id-1',
          status: 'In Progress',
          title: 'Test Task 1',
        },
        {
          id: 'test-id-2',
          status: 'Done',
          title: 'Test Task 2',
        },
      ]);
    });

    it('should handle errors', async () => {
      const mockError = new Error('Database query failed');
      const client = new Client();
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      jest.mocked(client.databases.query).mockRejectedValueOnce(mockError);

      const response = await GET();

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Failed to fetch data from Notion',
      });
    });
  });

  describe('POST', () => {
    it('should create a new todo', async () => {
      // Mock the request body since NextRequest is not properly mocked
      const mockReq = {
        json: async () => ({
          title: 'New Todo',
          status: 'Not Started',
        }),
      };
      const response = await POST(mockReq as unknown as NextRequest);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        message: 'Todo created successfully',
        newTodo: {
          id: 'new-todo-id',
          properties: {
            Name: {
              title: [
                {
                  plain_text: 'New Todo',
                },
              ],
            },
            Status: {
              status: {
                name: 'Not Started',
              },
            },
          },
        },
      });
    });

    it('should handle errors when creating a todo', async () => {
      const mockError = new Error('Failed to create todo');
      const client = new Client();
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      jest.mocked(client.pages.create).mockRejectedValueOnce(mockError);

      const req = new NextRequest('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Todo',
          status: 'Not Started',
        }),
      });

      const response = await POST(req);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Failed to add data to Notion',
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const mockReq = {
        json: async () => ({
          title: '',
          status: '',
        }),
      };
      const response = await POST(mockReq as unknown as NextRequest);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Missing required fields',
      });
    });
  });

  describe('PUT', () => {
    it('should update an existing todo', async () => {
      const mockReq = {
        json: async () => ({
          id: 'test-id-1',
          title: 'Updated Todo',
          status: 'Done',
        }),
      };
      const response = await PUT(mockReq as unknown as NextRequest);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        message: 'Todo updated successfully',
        response: {
          id: 'test-id-1',
          properties: {
            Name: {
              title: [
                {
                  type: 'text',
                  text: {
                    content: 'Updated Todo',
                  },
                },
              ],
            },
            Status: {
              status: {
                name: 'Done',
              },
            },
          },
        },
      });
    });

    it('should return 500 if trying to update a non-existent todo', async () => {
      const mockReq = {
        json: async () => ({
          id: 'non-existent-id',
          title: 'Updated Todo',
          status: 'Done',
        }),
      };
      const response = await PUT(mockReq as unknown as NextRequest);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Failed to update data in Notion',
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const mockReq = {
        json: async () => ({
          id: 'test-id-1',
          title: '',
          status: '',
        }),
      };
      const response = await PUT(mockReq as unknown as NextRequest);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Missing required fields',
      });
    });
  });

  describe('DELETE', () => {
    it('should delete an existing todo', async () => {
      const mockReq = {
        json: async () => ({
          id: 'test-id-1',
        }),
      };
      const response = await DELETE(mockReq as unknown as NextRequest);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        message: 'Todo deleted successfully',
      });
    });

    it('should return 500 if trying to delete a non-existent todo', async () => {
      const mockReq = {
        json: async () => ({
          id: 'non-existent-id',
        }),
      };
      const response = await DELETE(mockReq as unknown as NextRequest);

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: 'Failed to delete data from Notion',
      });
    });

    it('should return 400 if id is missing', async () => {
      const mockReq = {
        json: async () => ({}),
      };
      const response = await DELETE(mockReq as unknown as NextRequest);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: 'Missing required field: id',
      });
    });
  });
});
