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
        const transformedClasses = classesData.classes.map((cls) => ({
          id: cls._id,
          title: cls.classType.toUpperCase(),
          type: cls.classType,
          date: new Date(cls.startTime),
          startTime: new Date(cls.startTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          endTime: new Date(cls.endTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        }));

        // Transform events data to calendar format
        const transformedEvents = eventsData.events.map((event) => ({
          id: event._id,
          title: 'Completed',
          type: 'completed',
          date: new Date(event.date),
          startTime: '00:00',
          endTime: '23:59',
        }));

        setClasses(transformedClasses);
        setEvents(transformedEvents);
      }
    } catch (err) {
      // Only update error state if the error is not due to abort
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Error fetching calendar data:', err);
      }
    } finally {
      // Only update loading state if not aborted
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Create an AbortController for this effect instance
    const abortController = new AbortController();

    if (user) {
      fetchData(abortController);
    } else {
      // Reset state when user is not available
      setClasses([]);
      setEvents([]);
      setError(null);
      setIsLoading(false);
    }

    // Cleanup function to cancel any pending requests
    return () => {
      abortController.abort();
      // Reset state when component unmounts
      setClasses([]);
      setEvents([]);
      setError(null);
      setIsLoading(false);
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
