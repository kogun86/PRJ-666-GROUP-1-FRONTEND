import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Dynamically import the Calendar component with no SSR
const Calendar = dynamic(() => import('@/features/calendar/components/Calendar'), {
  ssr: false,
  loading: () => (
    <div className="calendar-loading">
      <div className="spinner"></div>
      <p>Loading calendar...</p>
    </div>
  ),
});

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <Calendar />
      </Layout>
    </ProtectedRoute>
  );
}
