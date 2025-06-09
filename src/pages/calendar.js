import dynamic from 'next/dynamic';
import Layout from '@/componentShared/Layout';
import ProtectedRoute from '@/componentShared/ProtectedRoute';
import { LoadingAnimation } from '@/features/animations';

// Dynamically import the Calendar component with no SSR
const Calendar = dynamic(() => import('@/features/calendar/components/Calendar'), {
  ssr: false,
  loading: () => (
    <div className="calendar-loading">
      <LoadingAnimation size="large" />
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
