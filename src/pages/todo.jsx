import React from 'react';
import ProtectedRoute from '../componentShared/ProtectedRoute';
import Layout from '../componentShared/Layout';
import AIChatWindow from '../componentShared/AIChatWindow';
import SmartTodoContent from '../features/smartTodo/SmartTodoContent';

export default function SmartTodoPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <SmartTodoContent />
        <AIChatWindow />
      </Layout>
    </ProtectedRoute>
  );
}
