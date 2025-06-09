import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/v1'
    : `${process.env.NEXT_PUBLIC_API_URL}/v1`;

// Helper function to get date range for fetching events
const getDateRangeForFetch = (date, monthsToFetch = 2) => {
  // Instead of calculating a narrow date range, use a wider fixed range that we know works
  // This is a temporary solution to ensure we get events
  return {
    from: '2023-09-01T00:00:00Z',
    to: '2026-12-31T23:59:59Z',
  };
};

export function useCalendarData() {
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fetchedDateRanges, setFetchedDateRanges] = useState([]);
  const { user, isProduction } = useAuth();

  // Debug current state
  useEffect(() => {
    console.log('Current calendar state:', {
      events,
      classes,
      isLoading,
      error,
      currentDate: currentDate.toISOString(),
      fetchedRanges: fetchedDateRanges,
    });
  }, [events, classes, isLoading, error, currentDate, fetchedDateRanges]);

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
        console.error('❌ Error getting ID token:', err);
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

  // Check if a date range is already fetched
  const isDateRangeAlreadyFetched = (from, to) => {
    return fetchedDateRanges.some((range) => {
      const rangeFrom = new Date(range.from);
      const rangeTo = new Date(range.to);
      const checkFrom = new Date(from);
      const checkTo = new Date(to);

      return checkFrom >= rangeFrom && checkTo <= rangeTo;
    });
  };

  const fetchEvents = useCallback(
    async (date, abortController) => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const { from, to } = getDateRangeForFetch(date);
        console.log('Fetching events for date range:', { from, to });

        // Check if we already have data for this range
        if (isDateRangeAlreadyFetched(from, to)) {
          console.log('Date range already fetched, skipping API call');
          setIsLoading(false);
          return;
        }

        const headers = await getHeaders();
        console.log('Using headers:', headers);

        // Use the exact URL format that works in Thunder Client
        const url = `${API_BASE_URL}/events?from=${from}&to=${to}`;
        console.log('Fetching from URL:', url);

        const eventsResponse = await fetch(url, {
          method: 'GET',
          headers,
          signal: abortController.signal,
        });

        if (!eventsResponse.ok) {
          const errorText = await eventsResponse.text();
          console.error('🔍 Backend events response:', errorText);
          throw new Error(
            `Failed to fetch events: ${eventsResponse.status} ${eventsResponse.statusText}`
          );
        }

        const eventsData = await eventsResponse.json();
        console.log('API Response:', eventsData);

        // Only update state if the component is still mounted
        if (!abortController.signal.aborted) {
          // Extract events from the response, handling different possible structures
          let newEvents = [];

          if (eventsData.events && Array.isArray(eventsData.events)) {
            // Standard format: { success: true, events: [...] }
            newEvents = eventsData.events;
          } else if (Array.isArray(eventsData)) {
            // Direct array format: [...]
            newEvents = eventsData;
          } else if (eventsData.data && Array.isArray(eventsData.data)) {
            // Alternative format: { success: true, data: [...] }
            newEvents = eventsData.data;
          } else {
            console.warn('Unexpected API response format:', eventsData);
            // Try to extract any array from the response
            const possibleArrays = Object.values(eventsData).filter((val) => Array.isArray(val));
            if (possibleArrays.length > 0) {
              // Use the first array found
              newEvents = possibleArrays[0];
              console.log('Extracted events from response:', newEvents);
            }
          }

          console.log('Extracted events:', newEvents);

          // Add new events to the existing ones, avoiding duplicates
          setEvents((prevEvents) => {
            if (!Array.isArray(newEvents) || newEvents.length === 0) {
              console.log('No new events to add');
              return prevEvents;
            }

            const existingEventIds = new Set(prevEvents.map((event) => event._id));
            const uniqueNewEvents = newEvents.filter((event) => {
              const eventId = event._id || event.id;
              return eventId && !existingEventIds.has(eventId);
            });

            console.log('Unique new events to add:', uniqueNewEvents);
            return [...prevEvents, ...uniqueNewEvents];
          });

          // Add this date range to our tracked ranges
          setFetchedDateRanges((prevRanges) => [...prevRanges, { from, to }]);
          setIsLoading(false);
        }
      } catch (err) {
        // Only update error state if the error is not due to abort
        if (err.name !== 'AbortError' && !abortController.signal.aborted) {
          setError(err.message);
          console.error('❌ Error fetching calendar data:', err);
          setIsLoading(false);
        }
      }
    },
    [user, fetchedDateRanges]
  );

  const fetchClasses = useCallback(
    async (date, abortController) => {
      if (!user) return;

      try {
        const { from, to } = getDateRangeForFetch(date);
        console.log('Fetching classes for date range:', { from, to });

        const headers = await getHeaders();
        console.log('Using headers for classes fetch:', headers);

        // Fetch classes with course expansion
        const url = `${API_BASE_URL}/classes?expand=course&from=${from}&to=${to}`;
        console.log('Fetching classes from URL:', url);

        const classesResponse = await fetch(url, {
          method: 'GET',
          headers,
          signal: abortController.signal,
        });

        if (!classesResponse.ok) {
          const errorText = await classesResponse.text();
          console.error('🔍 Backend classes response:', errorText);
          throw new Error(
            `Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`
          );
        }

        const classesData = await classesResponse.json();
        console.log('Classes API Response:', classesData);

        // Only update state if the component is still mounted
        if (!abortController.signal.aborted) {
          // Extract classes from the response, handling different possible structures
          let newClasses = [];

          if (classesData.classes && Array.isArray(classesData.classes)) {
            // Standard format: { success: true, classes: [...] }
            newClasses = classesData.classes;
          } else if (Array.isArray(classesData)) {
            // Direct array format: [...]
            newClasses = classesData;
          } else if (classesData.data && Array.isArray(classesData.data)) {
            // Alternative format: { success: true, data: [...] }
            newClasses = classesData.data;
          } else {
            console.warn('Unexpected API response format for classes:', classesData);
            // Try to extract any array from the response
            const possibleArrays = Object.values(classesData).filter((val) => Array.isArray(val));
            if (possibleArrays.length > 0) {
              // Use the first array found
              newClasses = possibleArrays[0];
              console.log('Extracted classes from response:', newClasses);
            }
          }

          console.log('Extracted classes:', newClasses);

          // Add new classes to the existing ones, avoiding duplicates
          setClasses((prevClasses) => {
            if (!Array.isArray(newClasses) || newClasses.length === 0) {
              console.log('No new classes to add');
              return prevClasses;
            }

            const existingClassIds = new Set(prevClasses.map((cls) => cls._id));
            const uniqueNewClasses = newClasses.filter((cls) => {
              const classId = cls._id || cls.id;
              return classId && !existingClassIds.has(classId);
            });

            console.log('Unique new classes to add:', uniqueNewClasses);
            return [...prevClasses, ...uniqueNewClasses];
          });
        }
      } catch (err) {
        // Only update error state if the error is not due to abort
        if (err.name !== 'AbortError' && !abortController.signal.aborted) {
          setError(err.message);
          console.error('❌ Error fetching classes data:', err);
        }
      }
    },
    [user]
  );

  const fetchCalendarData = useCallback(
    async (date) => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      const { from, to } = getDateRangeForFetch(date);

      // Check if we already have data for this range
      if (isDateRangeAlreadyFetched(from, to)) {
        console.log('Date range already fetched, skipping API calls');
        setIsLoading(false);
        return;
      }

      const abortController = new AbortController();

      try {
        // Fetch both events and classes concurrently
        await Promise.all([
          fetchEvents(date, abortController),
          fetchClasses(date, abortController),
        ]);

        // Add this date range to our tracked ranges if not already done by fetchEvents
        setFetchedDateRanges((prevRanges) => {
          if (!prevRanges.some((range) => range.from === from && range.to === to)) {
            return [...prevRanges, { from, to }];
          }
          return prevRanges;
        });

        setIsLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError' && !abortController.signal.aborted) {
          setError(err.message);
          console.error('❌ Error fetching calendar data:', err);
          setIsLoading(false);
        }
      }

      // Return the cleanup function directly, not inside another function
      return () => {
        abortController.abort();
      };
    },
    [user, fetchEvents, fetchClasses, fetchedDateRanges]
  );

  // Fetch events and classes when the component mounts or when the user changes
  useEffect(() => {
    let cleanupFunction = () => {};

    if (!user) {
      // Reset state when user is not available
      setEvents([]);
      setClasses([]);
      setError(null);
      setIsLoading(false);
      return cleanupFunction;
    }

    // Execute fetchCalendarData and store its cleanup function
    fetchCalendarData(currentDate).then((cleanup) => {
      if (cleanup && typeof cleanup === 'function') {
        cleanupFunction = cleanup;
      }
    });

    // Return cleanup function that will be called on unmount
    return () => {
      if (typeof cleanupFunction === 'function') {
        cleanupFunction();
      }
    };
  }, [user, currentDate, fetchCalendarData]);

  // Function to update the current date and fetch events for new date range if needed
  const updateCurrentDate = (newDate) => {
    console.log('Updating current date:', newDate);
    setCurrentDate(newDate);
    fetchCalendarData(newDate);
  };

  return {
    calendarEvents: events,
    calendarClasses: classes,
    isLoading,
    error,
    updateCurrentDate,
    refetch: () => fetchCalendarData(currentDate),
  };
}
