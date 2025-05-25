import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../features/auth/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventCard from '@/components/EventCard';
import EventTabs from '@/components/EventTabs';

export default function Events() {
  const { user, isProduction } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) return;

    if (isProduction) {
      apiRequest('/v1/events/upcoming', {}, user)
        .then((data) => setEvents(data.events || []))
        .catch(console.error);
    } else {
      setEvents();
    }
  }, [user, isProduction]);

  return (
    <ProtectedRoute>
      <Layout>
        <EventTabs />
      </Layout>
    </ProtectedRoute>
  );
}
