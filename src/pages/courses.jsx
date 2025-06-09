import React from 'react';
import Layout from '../componentShared/Layout';
import ProtectedRoute from '../componentShared/ProtectedRoute';
import AIChatWindow from '../componentShared/AIChatWindow';
import { CoursesContainer } from '../features/courses';

export default function CoursesPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <CoursesContainer />
        {/* AI Chat Window */}
        <AIChatWindow />
      </Layout>
    </ProtectedRoute>
  );
}
