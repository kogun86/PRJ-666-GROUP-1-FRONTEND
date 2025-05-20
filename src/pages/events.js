import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../features/auth/context/AuthContext'
import { authorizationHeaders } from '@/features/auth/lib/amplifyClient';
import { getCurrentUser } from '@aws-amplify/auth';

export default function Events() {

  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return; // Wait for user to be loaded
    apiRequest('/v1/events/upcoming', {}, user)
    .then(data => setEvents(data.events || []))
    .catch(console.error);
  }, [user]);

  // const events = [
  //   {
  //     id: 1,
  //     title: 'Career Fair',
  //     date: '2024-03-15',
  //     time: '10:00 AM - 2:00 PM',
  //     location: 'Main Campus Hall',
  //     description: 'Annual career fair with top tech companies.',
  //   },
  //   {
  //     id: 2,
  //     title: 'Hackathon',
  //     date: '2024-03-20',
  //     time: '9:00 AM - 9:00 PM',
  //     location: 'Engineering Building',
  //     description: '24-hour coding competition with prizes.',
  //   },
  //   {
  //     id: 3,
  //     title: 'Guest Lecture',
  //     date: '2024-03-25',
  //     time: '2:00 PM - 4:00 PM',
  //     location: 'Room 101',
  //     description: 'AI and Machine Learning in Modern Applications.',
  //   },
  // ];

  return (
    <Layout>
      <div className="events-container">
        <h1 className="events-title">Upcoming Events</h1>
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <div className="event-info">
                  <h2 className="event-title">{event.title}</h2>
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    <p className="event-detail">
                      <span className="event-detail-label">Date:</span> {event.date}
                    </p>
                    <p className="event-detail">
                      <span className="event-detail-label">Time:</span> {event.time}
                    </p>
                    <p className="event-detail">
                      <span className="event-detail-label">Location:</span> {event.location}
                    </p>
                  </div>
                </div>
                <button className="event-register-button">Register</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
