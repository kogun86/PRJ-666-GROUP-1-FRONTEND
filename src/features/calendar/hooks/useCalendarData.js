import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/v1'
    : `${process.env.NEXT_PUBLIC_API_URL}/v1`;

export function useCalendarData() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isProduction } = useAuth();

  const getHeaders = async () => {
    if (isProduction) {
      try {
        // Get the current session
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) {
          throw new Error('No ID token available');
        }

        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        };
      } catch (err) {
        console.error('Error getting ID token:', err);
        throw new Error('Failed to get access token');
      }
    } else {
      // Development headers
      return {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-id-token',
      };
    }
  };

  const fetchData = async (abortController) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();

      // Fetch classes
      const classesResponse = await fetch(`${API_BASE_URL}/classes`, {
        headers,
        signal: abortController.signal,
      });
      if (!classesResponse.ok) {
        throw new Error(
          `Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`
        );
      }
      const classesData = await classesResponse.json();

      // Fetch events
      const eventsResponse = await fetch(`${API_BASE_URL}/events/completed`, {
        headers,
        signal: abortController.signal,
      });
      if (!eventsResponse.ok) {
        throw new Error(
          `Failed to fetch events: ${eventsResponse.status} ${eventsResponse.statusText}`
        );
      }
      const eventsData = await eventsResponse.json();

      // Only update state if the component is still mounted
      if (!abortController.signal.aborted) {
        // Transform classes data to calendar format
        const transformedClasses = classesData.classes.map((cls) => {
          const startDate = new Date(cls.startTime);
          const endDate = new Date(cls.endTime);

          return {
            id: cls._id,
            title: cls.classType.toUpperCase(),
            type: cls.classType,
            date: startDate,
            startTime: startDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            endTime: endDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            // Additional fields that might be useful for FullCalendar
            courseCode: cls.courseCode || '',
            description: cls.description || '',
          };
        });

        // Transform events data to calendar format
        const transformedEvents = eventsData.events.map((event) => {
          const eventDate = new Date(event.date);

          return {
            id: event._id,
            title: 'Completed',
            type: 'completed',
            date: eventDate,
            startTime: '00:00',
            endTime: '23:59',
            // Additional fields
            description: event.description || '',
          };
        });

        setClasses(transformedClasses);
        setEvents(transformedEvents);
        setIsLoading(false);
      }
    } catch (err) {
      // Only update error state if the error is not due to abort
      if (err.name !== 'AbortError' && !abortController.signal.aborted) {
        setError(err.message);
        console.error('Error fetching calendar data:', err);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    if (!user) {
      // Reset state when user is not available
      setClasses([]);
      setEvents([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    fetchData(abortController);

    return () => {
      abortController.abort();
    };
  }, [user]);

  // Combine classes and events for the calendar
  const calendarEvents = [...classes, ...events];

  return {
    calendarEvents,
    isLoading,
    error,
    refetch: () => fetchData(new AbortController()),
  };
}
