import React from 'react';

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';

import DailyRecord from '../page';

// Mock the fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('DailyRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ todos: [], hasMore: false }),
    });
  });

  it('renders correctly', async () => {
    render(<DailyRecord />);
    expect(screen.getByText('Daily Record')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Add a new daily record')
    ).toBeInTheDocument();
    expect(screen.getByText('Add Daily Record')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText('Active Todos')).toBeInTheDocument()
    );
  });

  it('adds a new todo', async () => {
    render(<DailyRecord />);
    const input = screen.getByPlaceholderText('Add a new daily record');
    const addButton = screen.getByText('Add Daily Record');

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2)); // Once for initial load, once for adding
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/daily-records',
      expect.any(Object)
    );
  });

  it('toggles between active and completed todos', async () => {
    const activeTodos = [
      { id: '1', title: 'Active Todo 1', status: 'In progress' },
      { id: '2', title: 'Active Todo 2', status: 'Not started' },
    ];
    const completedTodos = [
      { id: '3', title: 'Completed Todo 1', status: 'Done' },
      { id: '4', title: 'Completed Todo 2', status: 'Done' },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ todos: activeTodos, hasMore: false }),
    });

    render(<DailyRecord />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/daily-records?page=1&pageSize=10&completed=false'
      );
      expect(screen.getByText('Active Todos')).toBeInTheDocument();
      activeTodos.forEach((todo) => {
        expect(screen.getByText(todo.title)).toBeInTheDocument();
      });
    });

    const statusSelects = screen.getAllByRole('combobox');
    expect(statusSelects).toHaveLength(activeTodos.length);
    expect(statusSelects[0]).toHaveValue('In progress');
    expect(statusSelects[1]).toHaveValue('Not started');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ todos: completedTodos, hasMore: false }),
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Show Completed'));
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/daily-records?page=1&pageSize=10&completed=true'
      );
      expect(screen.getByText('Completed Todos')).toBeInTheDocument();
      completedTodos.forEach((todo) => {
        expect(screen.getByText(todo.title)).toBeInTheDocument();
      });
    });

    expect(screen.queryAllByRole('combobox')).toHaveLength(0);
  });

  it('updates todo status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
          hasMore: false,
        }),
    });

    render(<DailyRecord />);
    await waitFor(() =>
      expect(screen.getByText('Test Todo')).toBeInTheDocument()
    );

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'In progress' } });

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/daily-records',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ id: '1', status: 'In progress' }),
        })
      )
    );
  });

  it('deletes a todo', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
          hasMore: false,
        }),
    });

    render(<DailyRecord />);
    await waitFor(() =>
      expect(screen.getByText('Test Todo')).toBeInTheDocument()
    );

    const deleteButton = screen.getByLabelText('Delete todo');
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/daily-records',
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ id: '1' }),
        })
      )
    );
  });

  it('edits a todo', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
          hasMore: false,
        }),
    });

    render(<DailyRecord />);
    await waitFor(() =>
      expect(screen.getByText('Test Todo')).toBeInTheDocument()
    );

    const editButton = screen.getByLabelText('Edit todo');
    fireEvent.click(editButton);

    const editInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(editInput, { target: { value: 'Edited Todo' } });

    const saveButton = screen.getByLabelText('Save todo');
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/daily-records',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ id: '1', title: 'Edited Todo' }),
        })
      )
    );
  });

  it('cancels editing a todo', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
          hasMore: false,
        }),
    });

    render(<DailyRecord />);
    await waitFor(() =>
      expect(screen.getByText('Test Todo')).toBeInTheDocument()
    );

    const editButton = screen.getByLabelText('Edit todo');
    fireEvent.click(editButton);

    const editInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(editInput, { target: { value: 'Edited Todo' } });

    const cancelButton = screen.getByLabelText('Cancel editing');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Edited Todo')).not.toBeInTheDocument();
  });

  it('loads more todos', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
          hasMore: true,
        }),
    });

    render(<DailyRecord />);
    await waitFor(() =>
      expect(screen.getByText('Test Todo')).toBeInTheDocument()
    );

    const loadMoreButton = screen.getByText('Load More');
    fireEvent.click(loadMoreButton);

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/daily-records?page=2&pageSize=10&completed=false'
      )
    );
  });

  it('handles errors when fetching todos', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<DailyRecord />);
    await waitFor(() =>
      expect(
        screen.getByText('Failed to load todos. Please try again later.')
      ).toBeInTheDocument()
    );
  });

  it('handles errors when adding a todo', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ todos: [], hasMore: false }),
      })
      .mockRejectedValueOnce(new Error('Failed to add todo'));

    render(<DailyRecord />);
    const input = screen.getByPlaceholderText('Add a new daily record');
    const addButton = screen.getByText('Add Daily Record');

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.queryByText('Failed to add todo. Please try again.')
      ).not.toBeInTheDocument();
      expect(input).toHaveValue('New Todo');
      expect(
        screen.getByText(
          'No active todos found. Add a new todo to get started!'
        )
      ).toBeInTheDocument();
    });
  });

  it('handles errors when updating todo status', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
            hasMore: false,
          }),
      })
      .mockRejectedValueOnce(new Error('Failed to update todo'));

    render(<DailyRecord />);
    await waitFor(() =>
      expect(screen.getByText('Test Todo')).toBeInTheDocument()
    );

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'In progress' } });

    await waitFor(() =>
      expect(
        screen.getByText('Failed to update todo. Please try again.')
      ).toBeInTheDocument()
    );
  });

  it('handles errors when deleting a todo', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
            hasMore: false,
          }),
      })
      .mockRejectedValueOnce(new Error('Failed to delete todo'));

    render(<DailyRecord />);
    await waitFor(() =>
      expect(screen.getByText('Test Todo')).toBeInTheDocument()
    );

    const deleteButton = screen.getByLabelText('Delete todo');
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(
        screen.getByText('Failed to delete todo. Please try again.')
      ).toBeInTheDocument()
    );
  });

  it('handles errors when editing a todo', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
            hasMore: false,
          }),
      })
      .mockRejectedValueOnce(new Error('Failed to update todo'));

    render(<DailyRecord />);
    await waitFor(() =>
      expect(screen.getByText('Test Todo')).toBeInTheDocument()
    );

    const editButton = screen.getByLabelText('Edit todo');
    fireEvent.click(editButton);

    const editInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(editInput, { target: { value: 'Edited Todo' } });

    const saveButton = screen.getByLabelText('Save todo');
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(
        screen.getByText('Failed to update todo. Please try again.')
      ).toBeInTheDocument()
    );
  });

  it('displays no todos message when there are no todos', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ todos: [], hasMore: false }),
    });

    render(<DailyRecord />);
    await waitFor(() =>
      expect(
        screen.getByText(
          'No active todos found. Add a new todo to get started!'
        )
      ).toBeInTheDocument()
    );
  });

  it('displays no completed todos message when there are no completed todos', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ todos: [], hasMore: false }),
    });

    render(<DailyRecord />);
    await act(async () => {
      fireEvent.click(screen.getByText('Show Completed'));
    });

    await waitFor(() =>
      expect(screen.getByText('No completed todos found.')).toBeInTheDocument()
    );
  });

  it('displays loading message when fetching todos', async () => {
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ todos: [], hasMore: false }),
              }),
            100
          )
        )
    );

    render(<DailyRecord />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    );
  });

  it('displays no more todos message when all todos are loaded', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
          hasMore: false,
        }),
    });

    render(<DailyRecord />);
    await waitFor(() =>
      expect(screen.getByText('No more todos to load.')).toBeInTheDocument()
    );
  });

  it('handles non-ok response when fetching todos', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    render(<DailyRecord />);
    await waitFor(() =>
      expect(
        screen.getByText('Failed to load todos. Please try again later.')
      ).toBeInTheDocument()
    );
  });

  it('clears error message after successful action', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ todos: [], hasMore: false }),
      });

    render(<DailyRecord />);
    await waitFor(() =>
      expect(
        screen.getByText('Failed to load todos. Please try again later.')
      ).toBeInTheDocument()
    );

    const input = screen.getByPlaceholderText('Add a new daily record');
    const addButton = screen.getByText('Add Daily Record');

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      // Check that the error message is no longer present
      const errorMessage = screen.queryByText(
        'Failed to load todos. Please try again later.'
      );
      expect(errorMessage).toBeNull();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('handles empty input when adding a todo', async () => {
    render(<DailyRecord />);
    const addButton = screen.getByText('Add Daily Record');

    fireEvent.click(addButton);

    // Wait for a short time to ensure any potential state updates have occurred
    await waitFor(() => {});

    // Check that no fetch call was made
    expect(mockFetch).not.toHaveBeenCalledWith(
      '/api/daily-records',
      expect.any(Object)
    );

    // Verify that the input field is still empty
    const input = screen.getByPlaceholderText('Add a new daily record');
    expect(input).toHaveValue('');

    // Optionally, check that no error message is displayed
    expect(
      screen.queryByText('Failed to add todo. Please try again.')
    ).not.toBeInTheDocument();
  });
});
