import { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCalendarData() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getHeaders = async () => {
    try {
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
      console.error(' Error getting ID token:', err);
      throw new Error('Failed to get access token');
    }
  };

  const fetchData = async (abortController) => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getHeaders();

      //  Fetch classes
      const classesResponse = await fetch(`${API_BASE_URL}/classes`, {
        method: 'GET',
        headers,
        signal: abortController.signal,
      });

      if (!classesResponse.ok) {
        throw new Error(
          `Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`
        );
      }

      const classesData = await classesResponse.json();

      //  Fetch events
      const eventsResponse = await fetch(`${API_BASE_URL}/events/completed`, {
        method: 'GET',
        headers,
        signal: abortController.signal,
      });

      if (!eventsResponse.ok) {
        throw new Error(
          `Failed to fetch events: ${eventsResponse.status} ${eventsResponse.statusText}`
        );
      }

      const eventsData = await eventsResponse.json();

      //  Transform both
      const transformedClasses = classesData.classes.map((cls) => {
        const startDate = new Date(cls.startTime);
        const endDate = new Date(cls.endTime);

        const formatTime = (date) => {
          const hours = date.getUTCHours().toString().padStart(2, '0');
          const minutes = date.getUTCMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        };

        return {
          id: cls._id,
          title: cls.classType.toUpperCase(),
          type: cls.classType,
          startTime: cls.startTime,
          endTime: cls.endTime,
          formattedStartTime: formatTime(startDate),
          formattedEndTime: formatTime(endDate),
          date: startDate,
          isUTC: true,
          courseCode: cls.courseCode || '',
          description: cls.description || '',
        };
      });

      const transformedEvents = eventsData.events.map((event) => {
        const eventDate = new Date(event.date);
        return {
          id: event._id,
          title: 'Completed',
          type: 'completed',
          date: eventDate,
          startTime: '00:00',
          endTime: '23:59',
          description: event.description || '',
        };
      });

      if (!abortController.signal.aborted) {
        setClasses(transformedClasses);
        setEvents(transformedEvents);
        setIsLoading(false);
      }
    } catch (err) {
      if (err.name !== 'AbortError' && !abortController.signal.aborted) {
        setError(err.message);
        console.error(' Error fetching calendar data:', err);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController);
    return () => abortController.abort();
  }, []);

  return {
    calendarEvents: [...classes, ...events],
    isLoading,
    error,
    refetch: () => fetchData(new AbortController()),
  };
}
