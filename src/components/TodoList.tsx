'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4">Todoリスト</h3>
      
      {/* 入力フォーム */}
      <div className="join w-full mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="新しいタスクを入力..."
          className="input input-bordered join-item flex-1"
        />
        <button
          onClick={addTodo}
          className="btn btn-primary join-item"
        >
          追加
        </button>
      </div>

      {/* Todoリスト */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-base-content/60">タスクがありません</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="checkbox checkbox-primary"
              />
              <span
                className={`flex-1 ${
                  todo.completed ? 'line-through text-base-content/60' : ''
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="btn btn-ghost btn-sm text-error"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>

      {/* 統計 */}
      {todos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-base-300">
          <div className="stats stats-horizontal shadow">
            <div className="stat">
              <div className="stat-title">完了</div>
              <div className="stat-value text-primary">{todos.filter(todo => todo.completed).length}</div>
              <div className="stat-desc">/{todos.length} タスク</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 