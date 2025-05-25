import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../features/auth/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Events() {
  const { user, isProduction } = useAuth();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Career Fair',
      date: '2024-03-15',
      time: '10:00 AM - 2:00 PM',
      location: 'Main Campus Hall',
      description: 'Annual career fair with top tech companies.',
    },
    {
      id: 2,
      title: 'Hackathon',
      date: '2024-03-20',
      time: '9:00 AM - 9:00 PM',
      location: 'Engineering Building',
      description: '24-hour coding competition with prizes.',
    },
    {
      id: 3,
      title: 'Guest Lecture',
      date: '2024-03-25',
      time: '2:00 PM - 4:00 PM',
      location: 'Room 101',
      description: 'AI and Machine Learning in Modern Applications.',
    },]);
  // Call API and set events for user 
  // Production will show events on API
  // Development will show events hardcoded above
  useEffect(() => {
    if (!user || !isProduction) return; // Wait for user to be loaded, Only run in production
    apiRequest('/v1/events/upcoming', {}, user)
    .then(data => setEvents(data.events || []))
    .catch(console.error);
  }, [user, isProduction]);

  return (
  <ProtectedRoute>
    <Layout>
      <div className="events-container">
        <h1 className="events-title">Upcoming Events</h1>
        <div className="events-list">
          {events.length === 0 ? (
            <p className='event-title'>You have no upcoming events.</p>
          ): (
            events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <div className="event-info">
                    <h2 className="event-title">{event.title}</h2>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <p className="event-detail">
                        <span className="event-detail-label">Due Date:</span> {event.dueDate}
                      </p>
                      <p className="event-detail">
                        <span className="event-detail-label">Course Code:</span> {event.courseCode}
                      </p>
                      <p className="event-detail">
                        <span className="event-detail-label">type:</span> {event.type}
                      </p>
                    </div>
                  </div>
                  <button className="event-register-button">Register</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
