import React, { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import Layout from '../componentShared/Layout';
import ProtectedRoute from '../componentShared/ProtectedRoute';
import AIChatWindow from '../componentShared/AIChatWindow';

const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/v1'
    : `${process.env.NEXT_PUBLIC_API_URL}/v1`;

const SmartTodoContent = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getHeaders = async () => {
    if (process.env.NODE_ENV === 'development') {
      return {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-id-token',
      };
    }
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    };
  };

  const fetchSmartTodos = async () => {
    try {
      setIsLoading(true);
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/todo`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('❌ Failed to fetch SMART TODOs:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Temporarily commenting out this fetch call as it's causing the app to crash
    // fetchSmartTodos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SMART TODO List</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!isLoading && !error && tasks.length === 0 && <p>No tasks found.</p>}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="p-4 border rounded-lg shadow bg-white">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-700">Course: {task.courseCode}</p>
            <p className="text-gray-700">Deadline: {new Date(task.dueDate).toLocaleString()}</p>
            <p className="text-sm font-medium text-blue-600">
              Importance Score: {task.importanceScore}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SmartTodoPage = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <SmartTodoContent />
        {/* AI Chat Window */}
        <AIChatWindow />
      </Layout>
    </ProtectedRoute>
  );
};

export default SmartTodoPage;
