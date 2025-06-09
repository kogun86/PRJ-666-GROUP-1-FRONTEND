import dynamic from 'next/dynamic';
import Layout from '@/componentShared/Layout';
import ProtectedRoute from '@/componentShared/ProtectedRoute';
import EventsLoading from '@/features/events/components/EventsLoading';

// Dynamically import the Events component with no SSR
const Events = dynamic(() => import('@/features/events/components/Events'), {
  ssr: false,
  loading: () => <EventsLoading />,
});

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="courses-container">
          <Events />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
