import { GET, POST, PUT, DELETE } from '../app/api/daily-records/route';

// mock the Notion API client
jest.mock('@notionhq/client', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      databases: {
        query: jest.fn().mockResolvedValue({
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
        }),
      },
      pages: {
        create: jest.fn().mockResolvedValue({
          id: 'new-todo-id',
        }),
        update: jest.fn().mockImplementation(({ page_id }) => {
          if (page_id === 'invalid-id' || page_id === 'non-existent-id') {
            throw new Error('Todo not found');
          }
          return Promise.resolve({
            id: page_id,
            properties: {
              Name: { title: [{ plain_text: 'Updated Todo Title' }] },
              Status: { status: { name: 'Done' } },
            },
          });
        }),
      },
    })),
  };
});

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => {
      return {
        json: () => Promise.resolve(data),
        status: init?.status || 200,
      };
    }),
  },
}));

describe('API /api/daily-records', () => {
  it('GET should return a list of todos', async () => {
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

  it('POST should create a new todo', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        title: 'New Todo',
        status: 'In Progress',
      }),
    } as any;

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({
      message: 'Todo created successfully',
      newTodo: {
        id: 'new-todo-id',
      },
    });
  });

  it('PUT should update an existing todo', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        id: 'test-id-1', // 使用存在的 ID 进行成功的更新
        title: 'Updated Todo Title',
        status: 'Done',
      }),
    } as any;

    const response = await PUT(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({
      message: 'Todo updated successfully',
      response: {
        id: 'test-id-1',
        properties: {
          Name: { title: [{ plain_text: 'Updated Todo Title' }] },
          Status: { status: { name: 'Done' } },
        },
      },
    });
  });

  it('PUT should return 500 if updating a non-existent todo', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        id: 'invalid-id', // 使用不存在的 ID 来触发错误
        title: 'Updated Todo Title',
        status: 'Done',
      }),
    } as any;

    const response = await PUT(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({
      error: 'Failed to update data in Notion',
    });
  });

  it('DELETE should return 500 if trying to delete a non-existent todo', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        id: 'non-existent-id', // 使用不存在的 ID 来触发错误
      }),
    } as any;

    const response = await DELETE(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({
      error: 'Failed to delete data from Notion',
    });
  });

  it('DELETE should delete an existing todo', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({
        id: 'test-id-1', // 使用存在的 ID 进行删除
      }),
    } as any;

    const response = await DELETE(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({
      message: 'Todo deleted successfully',
    });
  });
});
