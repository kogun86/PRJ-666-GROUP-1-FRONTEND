// src/features/smartTodo/SmartTodoContent.jsx
import React, { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { LoadingAnimation } from '../../features/animations';
// no need to re-import the CSS here if you've already done it in _app.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SmartTodoContent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getHeaders = async () => {
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.NODE_ENV === 'development') {
      headers.Authorization = 'Bearer mock-id-token';
    } else {
      const session = await fetchAuthSession();
      headers.Authorization = `Bearer ${session.tokens.idToken}`;
    }
    return headers;
  };

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/v1/smart-todo`, {
        method: 'GET',
        headers,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { events = [] } = await res.json();
      events.sort((a, b) => (b.importanceScore || 0) - (a.importanceScore || 0));
      setEvents(events);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingAnimation />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-600 text-center py-4">Error loading tasks: {error}</div>;
  }
  if (!events.length) {
    return <p className="text-center text-gray-600 py-8">No tasks found.</p>;
  }

  // pick a simple color name by score
  const pick = (score) => {
    const s = Math.min(Math.max(score || 0, 0), 100);
    if (s >= 80) return 'red';
    if (s >= 60) return 'orange';
    if (s >= 40) return 'yellow';
    return 'green';
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((e) => {
          const score = (e.importanceScore || 0).toFixed(0);
          const color = pick(e.importanceScore);
          const badgeText = score >= 80 ? 'Crucial' : score >= 60 ? 'Urgent' : `${score}%`;

          return (
            <div key={e._id} className={`card ${color}`}>
              <div className="card-body">
                <span className={`badge ${color}`}>{badgeText}</span>

                <h3 className="card-header">{e.title}</h3>

                <p className="card-meta">
                  <span className="icon">🎓</span>
                  {e.course?.code || '—'}
                  {e.course?.title && ` • ${e.course.title}`}
                </p>

                <p className="card-meta">
                  <span className="icon">⏰</span>
                  {new Date(e.end).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>

                <div className="progress-bar">
                  <div className={`progress ${color}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
