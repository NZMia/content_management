import React from 'react';

import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';

import DailyRecord from '../page';
import { handleApiRequest } from '@/utils/api';

jest.mock('@/utils/api', () => ({
  handleApiRequest: jest.fn(),
}));

describe('DailyRecord Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (handleApiRequest as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component and fetches todos', async () => {
    const mockTodos = [
      { id: '1', title: 'Test Todo 1', status: 'Not started' },
      { id: '2', title: 'Test Todo 2', status: 'In progress' },
    ];
    (handleApiRequest as jest.Mock).mockResolvedValueOnce({
      todos: mockTodos,
      hasMore: false,
    });

    await act(async () => {
      render(<DailyRecord />);
    });

    expect(screen.getByText('Daily Record')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Add a new daily record')
    ).toBeInTheDocument();
    expect(screen.getByText('Add Daily Record')).toBeInTheDocument();

    expect(handleApiRequest).toHaveBeenCalledWith({
      url: '/api/daily-records',
      method: 'GET',
      params: { page: '1', pageSize: '10', completed: 'false' },
      errorMessage: 'Failed to fetch todos',
    });
  });

  it('adds a new todo', async () => {
    (handleApiRequest as jest.Mock)
      .mockResolvedValueOnce({ todos: [], hasMore: false })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        todos: [{ id: '1', title: 'New Todo', status: 'Not started' }],
        hasMore: false,
      });

    await act(async () => {
      render(<DailyRecord />);
    });

    const input = screen.getByPlaceholderText('Add a new daily record');
    const addButton = screen.getByText('Add Daily Record');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'New Todo' } });
      fireEvent.click(addButton);
    });

    expect(handleApiRequest).toHaveBeenCalledWith({
      url: '/api/daily-records',
      method: 'POST',
      data: { title: 'New Todo', status: 'Not started' },
      errorMessage: 'Failed to add todo',
    });

    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    });
  });

  it('toggles between active and completed todos', async () => {
    const activeTodos = [
      { id: '1', title: 'Active Todo', status: 'In progress' },
    ];
    const completedTodos = [
      { id: '2', title: 'Completed Todo', status: 'Done' },
    ];

    (handleApiRequest as jest.Mock)
      .mockResolvedValueOnce({ todos: activeTodos, hasMore: false })
      .mockResolvedValueOnce({ todos: completedTodos, hasMore: false });

    await act(async () => {
      render(<DailyRecord />);
    });

    expect(screen.getByText('Active Todo')).toBeInTheDocument();

    const toggleButton = screen.getByText('Show Completed');
    expect(toggleButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Completed Todo')).toBeInTheDocument();
      expect(screen.queryByText('Active Todo')).not.toBeInTheDocument();
    });

    expect(handleApiRequest).toHaveBeenCalledWith({
      url: '/api/daily-records',
      method: 'GET',
      params: { page: '1', pageSize: '10', completed: 'true' },
      errorMessage: 'Failed to fetch todos',
    });
  });

  it('updates todo status', async () => {
    const mockTodo = { id: '1', title: 'Test Todo', status: 'Not started' };
    (handleApiRequest as jest.Mock)
      .mockResolvedValueOnce({ todos: [mockTodo], hasMore: false })
      .mockResolvedValueOnce({});

    await act(async () => {
      render(<DailyRecord />);
    });

    const statusSelect = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(statusSelect, { target: { value: 'In progress' } });
    });

    expect(handleApiRequest).toHaveBeenCalledWith({
      url: '/api/daily-records',
      method: 'PUT',
      data: { id: '1', status: 'In progress' },
      errorMessage: 'Failed to update todo status',
    });
  });

  it('deletes a todo', async () => {
    const mockTodo = { id: '1', title: 'Test Todo', status: 'Not started' };
    (handleApiRequest as jest.Mock)
      .mockResolvedValueOnce({ todos: [mockTodo], hasMore: false })
      .mockResolvedValueOnce({});

    await act(async () => {
      render(<DailyRecord />);
    });

    const deleteButton = await screen.findByLabelText('Delete todo');
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(handleApiRequest).toHaveBeenCalledWith({
      url: '/api/daily-records',
      method: 'DELETE',
      data: { id: '1' },
      errorMessage: 'Failed to delete todo',
    });
  });

  it('handles errors when fetching todos', async () => {
    (handleApiRequest as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch todos')
    );

    await act(async () => {
      render(<DailyRecord />);
    });

    expect(
      await screen.findByText('Failed to fetch todos')
    ).toBeInTheDocument();
  });

  it('handles errors when adding a todo', async () => {
    (handleApiRequest as jest.Mock)
      .mockResolvedValueOnce({ todos: [], hasMore: false })
      .mockRejectedValueOnce(new Error('Failed to add todo'));

    await act(async () => {
      render(<DailyRecord />);
    });

    const input = screen.getByPlaceholderText('Add a new daily record');
    const addButton = screen.getByText('Add Daily Record');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'New Todo' } });
      fireEvent.click(addButton);
    });

    expect(await screen.findByText('Failed to add todo')).toBeInTheDocument();
  });

  it('loads more todos when available', async () => {
    const initialTodos = [
      { id: '1', title: 'Initial Todo', status: 'Not started' },
    ];
    const moreTodos = [{ id: '2', title: 'More Todo', status: 'In progress' }];

    (handleApiRequest as jest.Mock)
      .mockResolvedValueOnce({ todos: initialTodos, hasMore: true })
      .mockResolvedValueOnce({ todos: moreTodos, hasMore: false });

    await act(async () => {
      render(<DailyRecord />);
    });

    expect(screen.getByText('Initial Todo')).toBeInTheDocument();

    const loadMoreButton = screen.getByText('Load More');
    await act(async () => {
      fireEvent.click(loadMoreButton);
    });

    await waitFor(() => {
      expect(screen.getByText('More Todo')).toBeInTheDocument();
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });

    expect(handleApiRequest).toHaveBeenCalledWith({
      url: '/api/daily-records',
      method: 'GET',
      params: { page: '2', pageSize: '10', completed: 'false' },
      errorMessage: 'Failed to fetch todos',
    });
  });

  it('cancels editing a todo', async () => {
    const mockTodo = { id: '1', title: 'Test Todo', status: 'Not started' };
    (handleApiRequest as jest.Mock).mockResolvedValueOnce({
      todos: [mockTodo],
      hasMore: false,
    });

    await act(async () => {
      render(<DailyRecord />);
    });

    const editButton = await screen.findByLabelText('Edit todo');
    await act(async () => {
      fireEvent.click(editButton);
    });

    const cancelButton = screen.getByLabelText('Cancel editing');
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(screen.queryByDisplayValue('Test Todo')).not.toBeInTheDocument();
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('saves edited todo', async () => {
    const mockTodo = { id: '1', title: 'Test Todo', status: 'Not started' };
    (handleApiRequest as jest.Mock)
      .mockResolvedValueOnce({ todos: [mockTodo], hasMore: false })
      .mockResolvedValueOnce({});

    await act(async () => {
      render(<DailyRecord />);
    });

    const editButton = await screen.findByLabelText('Edit todo');
    await act(async () => {
      fireEvent.click(editButton);
    });

    const editInput = screen.getByDisplayValue('Test Todo');
    await act(async () => {
      fireEvent.change(editInput, { target: { value: 'Edited Todo' } });
    });

    const saveButton = screen.getByLabelText('Save todo');
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(handleApiRequest).toHaveBeenCalledWith({
      url: '/api/daily-records',
      method: 'PUT',
      data: { id: '1', title: 'Edited Todo' },
      errorMessage: 'Failed to update todo',
    });
  });

  it('displays loading indicator', async () => {
    (handleApiRequest as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(<DailyRecord />);

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('displays no todos message for active todos', async () => {
    (handleApiRequest as jest.Mock).mockResolvedValueOnce({
      todos: [],
      hasMore: false,
    });

    await act(async () => {
      render(<DailyRecord />);
    });

    expect(
      screen.getByText('No active todos found. Add a new todo to get started!')
    ).toBeInTheDocument();
  });

  it('displays no todos message for completed todos', async () => {
    (handleApiRequest as jest.Mock).mockResolvedValueOnce({
      todos: [],
      hasMore: false,
    });

    await act(async () => {
      render(<DailyRecord />);
    });

    const toggleButton = screen.getByText('Show Completed');
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    // Mock the API call that happens after toggling
    (handleApiRequest as jest.Mock).mockResolvedValueOnce({
      todos: [],
      hasMore: false,
    });

    await waitFor(() => {
      expect(screen.getByText('No completed todos found.')).toBeInTheDocument();
    });
  });

  it('disables add button when input is empty', async () => {
    (handleApiRequest as jest.Mock).mockResolvedValueOnce({
      todos: [],
      hasMore: false,
    });

    render(<DailyRecord />);

    const addButton = screen.getByText('Add Daily Record');
    expect(addButton).toBeDisabled();

    const input = screen.getByPlaceholderText('Add a new daily record');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'New Todo' } });
    });

    expect(addButton).not.toBeDisabled();
  });

  it('handles error when updating todo status', async () => {
    const mockTodo = [{ id: '1', title: 'Test Todo', status: 'Not started' }];
    (handleApiRequest as jest.Mock).mockImplementation((options) => {
      if (options.method === 'GET') {
        return Promise.resolve({ todos: mockTodo, hasMore: false });
      }
      if (options.method === 'PUT') {
        return Promise.reject(new Error('Failed to update todo status'));
      }
    });

    await act(async () => {
      render(<DailyRecord />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
    });

    const statusSelect = screen.getByRole('combobox');
    await act(async () => {
      fireEvent.change(statusSelect, { target: { value: 'In progress' } });
    });

    await waitFor(() => {
      expect(
        screen.getByText('Failed to update todo status')
      ).toBeInTheDocument();
    });

    // 验证状态没有更新
    expect(statusSelect).toHaveValue('Not started');
  });

  it('handles error when deleting todo', async () => {
    const mockTodo = {
      id: '2',
      title: 'Todo to Delete',
      status: 'In progress',
    };
    (handleApiRequest as jest.Mock)
      .mockResolvedValueOnce({ todos: [mockTodo], hasMore: false })
      .mockRejectedValueOnce(new Error('Failed to delete todo'));

    await act(async () => {
      render(<DailyRecord />);
    });

    const deleteButton = await screen.findByLabelText('Delete todo');
    await waitFor(() => {
      expect(screen.getByText('Todo to Delete')).toBeInTheDocument();
    });
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(
      await screen.findByText('Failed to delete todo')
    ).toBeInTheDocument();
  });

  it('handles error when saving edited todo', async () => {
    const mockTodo = { id: '1', title: 'Test Todo', status: 'Not started' };
    (handleApiRequest as jest.Mock)
      .mockResolvedValueOnce({ todos: [mockTodo], hasMore: false })
      .mockRejectedValueOnce(new Error('Failed to update todo'));

    await act(async () => {
      render(<DailyRecord />);
    });

    const editButton = await screen.findByLabelText('Edit todo');
    await act(async () => {
      fireEvent.click(editButton);
    });

    const saveButton = screen.getByLabelText('Save todo');
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(
      await screen.findByText('Failed to update todo')
    ).toBeInTheDocument();
  });
  it('renders edit mode for a todo', async () => {
    const mockTodo = { id: '1', title: 'Test Todo', status: 'Not started' };
    (handleApiRequest as jest.Mock).mockResolvedValueOnce({
      todos: [mockTodo],
      hasMore: false,
    });

    await act(async () => {
      render(<DailyRecord />);
    });

    const editButton = screen.getByLabelText('Edit todo');
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Save todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel editing')).toBeInTheDocument();
  });
  it('renders "No more todos to load" message', async () => {
    (handleApiRequest as jest.Mock).mockResolvedValueOnce({
      todos: [{ id: '1', title: 'Test Todo', status: 'Not started' }],
      hasMore: false,
    });

    await act(async () => {
      render(<DailyRecord />);
    });

    expect(screen.getByText('No more todos to load.')).toBeInTheDocument();
  });

  it('renders loading indicator', async () => {
    (handleApiRequest as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    render(<DailyRecord />);

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
