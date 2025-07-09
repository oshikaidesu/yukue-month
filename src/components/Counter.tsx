'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title">カウンター</h2>
        <div className="text-4xl font-bold text-primary">{count}</div>
        <div className="card-actions">
          <button
            onClick={decrement}
            className="btn btn-error"
          >
            -1
          </button>
          <button
            onClick={reset}
            className="btn btn-neutral"
          >
            リセット
          </button>
          <button
            onClick={increment}
            className="btn btn-success"
          >
            +1
          </button>
        </div>
      </div>
    </div>
  );
} 