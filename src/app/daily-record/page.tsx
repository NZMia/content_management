'use client'; // Required for client-side hooks

import { useEffect, useState } from 'react';

import { ITODO } from '../api/daily-records/route';

const DailyRecordPage: React.FC = () => {
  const [todos, setTodos] = useState<ITODO[] | null>(null);
  const [expandedTodo, setExpandedTodo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [currentEdit, setCurrentEdit] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const response = await fetch('/api/daily-records');
        if (!response.ok) {
          throw new Error('Failed to fetch page data');
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching page data:', error);
        setError('Failed to fetch page data');
      }
    }

    fetchPageData();
  }, []);

  const handleAddTodoClick = () => {
    setIsAdding(true);
    setExpandedTodo(null);
  };

  const handleAddTodoSubmit = async () => {
    if (!newTodoTitle) {
      alert('Please enter a title for the new todo');
      return;
    }

    const newTodo = {
      title: newTodoTitle,
      status: 'In progress',
    };

    try {
      const response = await fetch('/api/daily-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      const data = await response.json();
      if (response.ok) {
        setTodos((prevTodos) =>
          prevTodos
            ? [...prevTodos, { id: data.newTodo.id, ...newTodo }]
            : [{ id: data.newTodo.id, ...newTodo }]
        );
        setNewTodoTitle('');
        setIsAdding(false);
        alert('Todo created successfully!');
      } else {
        alert(`Failed to create todo: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!currentEdit) return;

    const { id, title } = currentEdit;

    try {
      const response = await fetch('/api/daily-records', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title }),
      });

      const data = await response.json();
      if (response.ok) {
        setTodos(
          (prevTodos) =>
            prevTodos?.map((todo) =>
              todo.id === id ? { ...todo, title } : todo
            ) || null
        );
        setCurrentEdit(null);
        alert('Todo updated successfully!');
      } else {
        alert(`Failed to update todo: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch('/api/daily-records', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (response.ok) {
        setTodos(
          (prevTodos) => prevTodos?.filter((todo) => todo.id !== id) || null
        );
        alert('Todo deleted successfully!');
      } else {
        alert(`Failed to delete todo: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleExpandTodo = (id: string) => {
    setExpandedTodo(expandedTodo === id ? null : id);
    const todo = todos?.find((todo) => todo.id === id);
    if (todo) {
      setCurrentEdit({ id: todo.id, title: todo.title });
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full">
      <h1>Notion Page Data</h1>
      {todos ? (
        <div className="mx-auto max-w-lg rounded-lg bg-gray-800 p-4 text-white">
          <h1 className="mb-4 flex items-center text-xl font-bold">
            <span className="mr-2 text-yellow-400">⭐</span> Todos
          </h1>
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`rounded-lg bg-gray-700 p-4 ${expandedTodo === todo.id ? 'block' : 'flex items-center justify-between'}`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={todo.status === 'Done'}
                    onChange={() => handleSaveEdit()}
                  />
                  {expandedTodo === todo.id ? (
                    <div className="ml-2 flex-grow">
                      <input
                        type="text"
                        placeholder="New todo..."
                        className="w-full rounded-md bg-gray-600 p-2 outline-none"
                        value={currentEdit?.title || ''}
                        onChange={(e) =>
                          setCurrentEdit((prev) =>
                            prev ? { ...prev, title: e.target.value } : prev
                          )
                        }
                      />
                      <textarea
                        placeholder="Notes"
                        className="mt-2 w-full resize-none rounded-md bg-gray-600 p-2 outline-none"
                        rows={4}
                        // Assuming the content/notes are part of the todo object, you would handle them similarly
                      ></textarea>
                      <button
                        className="mt-2 text-green-400 hover:text-green-600"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span
                      className="ml-2 cursor-pointer"
                      onClick={() => handleExpandTodo(todo.id)}
                    >
                      {todo.title || 'New todo...'}
                    </span>
                  )}
                </div>
                {expandedTodo === todo.id && (
                  <button
                    className="mt-2 text-red-400 hover:text-red-600"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <p className="h-5 w-5">delete</p>
                  </button>
                )}
              </div>
            ))}

            {isAdding && (
              <div className="block rounded-lg bg-gray-700 p-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter new todo title..."
                    className="w-full rounded-md bg-gray-600 p-2 outline-none"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                  />
                </div>
                <button
                  className="mt-2 text-green-400 hover:text-green-600"
                  onClick={handleAddTodoSubmit}
                >
                  Add Todo
                </button>
              </div>
            )}
          </div>

          {!isAdding && (
            <button
              className="mt-4 flex items-center justify-center rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600"
              onClick={handleAddTodoClick}
            >
              <p className="h-6 w-6">Add Todo</p>
            </button>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default DailyRecordPage;
