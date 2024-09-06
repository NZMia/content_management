'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { handleApiRequest } from '../../utils/api';
import { ITODO } from '../api/daily-records/route';
import Tooltip from '../components/Tooltip';

export default function DailyRecord() {
  const [todos, setTodos] = useState<ITODO[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const pageSize = 10;

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await handleApiRequest(
        () =>
          fetch(
            `/api/daily-records?page=${page}&pageSize=${pageSize}&completed=${showCompleted}`
          ),
        'Failed to fetch todos'
      );
      const data = await response.json();
      setTodos((prevTodos) =>
        page === 1 ? data.todos : [...prevTodos, ...data.todos]
      );
      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [page, showCompleted, pageSize]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await handleApiRequest(
        () =>
          fetch('/api/daily-records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTodo, status: 'Not started' }),
          }),
        'Failed to add todo'
      );
      setError(null);
      await fetchTodos();
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
    }
  };

  const updateTodoStatus = async (id: string, newStatus: string) => {
    await handleApiRequest(
      () =>
        fetch('/api/daily-records', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: newStatus }),
        }),
      'Failed to update todo'
    );
  };

  const deleteTodo = async (id: string) => {
    await handleApiRequest(
      () =>
        fetch('/api/daily-records', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        }),
      'Failed to delete todo'
    );
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const startEditing = (todo: ITODO) => {
    setEditingTodo(todo.id);
    setEditedTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditedTitle('');
  };

  const saveEditedTodo = async (id: string) => {
    await handleApiRequest(
      () =>
        fetch('/api/daily-records', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, title: editedTitle }),
        }),
      'Failed to update todo'
    );
    setEditingTodo(null);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
    setPage(1);
    setTodos([]);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-black dark:text-white">
        Daily Record
      </h1>

      {error && (
        <div
          className="border-red-400 bg-red-100 text-red-700 relative mb-4 rounded border px-4 py-3"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={addTodo} className="mb-8 flex flex-col sm:flex-row">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new daily record"
          className="border-gray-300 dark:border-gray-600 flex-grow rounded-md border p-2 dark:bg-gray-800 dark:text-white sm:rounded-r-none"
        />
        <button
          type="submit"
          className="btn-primary mt-2 sm:mt-0 sm:rounded-l-none"
        >
          Add Daily Record
        </button>
      </form>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          {showCompleted ? 'Completed Todos' : 'Active Todos'}
        </h2>
        <button onClick={toggleShowCompleted} className="btn-secondary">
          {showCompleted ? 'Show Active' : 'Show Completed'}
        </button>
      </div>

      <div className="mb-8 space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm dark:bg-black"
          >
            {editingTodo === todo.id ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border-gray-300 dark:border-gray-600 mr-2 flex-grow rounded-md border p-1 dark:bg-gray-800 dark:text-white"
              />
            ) : (
              <span className="mr-2 flex-grow text-black dark:text-white">
                {todo.title}
              </span>
            )}
            <div className="flex items-center">
              {!showCompleted && (
                <select
                  value={todo.status}
                  onChange={(e) => updateTodoStatus(todo.id, e.target.value)}
                  className="border-gray-300 dark:border-gray-600 mr-2 rounded-md border p-1 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Not started">Not started</option>
                  <option value="In progress">In progress</option>
                  <option value="Done">Completed</option>
                </select>
              )}
              {editingTodo === todo.id ? (
                <>
                  <Tooltip text="Save changes">
                    <button
                      onClick={() => saveEditedTodo(todo.id)}
                      className="hover:text-gray-600 dark:hover:text-gray-300 mr-2 p-1 text-black dark:text-white"
                      aria-label="Save todo"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                  <Tooltip text="Cancel editing">
                    <button
                      onClick={cancelEditing}
                      className="hover:text-gray-600 dark:hover:text-gray-300 mr-2 p-1 text-black dark:text-white"
                      aria-label="Cancel editing"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                </>
              ) : (
                <Tooltip text="Edit todo">
                  <button
                    onClick={() => startEditing(todo)}
                    className="hover:text-gray-600 dark:hover:text-gray-300 mr-2 p-1 text-black dark:text-white"
                    aria-label="Edit todo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </Tooltip>
              )}
              <Tooltip text="Delete todo">
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="hover:text-gray-600 dark:hover:text-gray-300 p-1 text-black dark:text-white"
                  aria-label="Delete todo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="mt-4 text-center" data-testid="loading-indicator">
          Loading...
        </div>
      )}

      {hasMore && !isLoading && (
        <button onClick={loadMore} className="btn-secondary mt-4 w-full">
          Load More
        </button>
      )}

      {!hasMore && todos.length > 0 && (
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-center">
          No more todos to load.
        </p>
      )}

      {!isLoading && todos.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-center">
          {showCompleted
            ? 'No completed todos found.'
            : 'No active todos found. Add a new todo to get started!'}
        </p>
      )}
    </div>
  );
}
