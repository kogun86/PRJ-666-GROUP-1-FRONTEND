import React from 'react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import AIChatWindow from '../components/AIChatWindow';
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
