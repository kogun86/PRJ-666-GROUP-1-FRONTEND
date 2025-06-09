import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import {
  fetchUpcomingEvents,
  createEvent,
  fetchPendingEvents,
  fetchCompletedEvents,
  updateEventStatus,
  deleteEvent,
} from '../services/eventService';
import { groupTasksByDate, getDateKey } from '../utils/dateUtils';

/**
 * Ensure a date value is in ISO string format
 * @param {string|Date} date - Date to format
 * @param {boolean} required - Whether a fallback date should be returned if input is null
 * @returns {string} ISO formatted date string
 */
const formatDateToISO = (date, required = false) => {
  if (date) {
    if (date instanceof Date) return date.toISOString();
    if (typeof date === 'string') {
      // Handle string that might not be in ISO format
      const dateObj = new Date(date);
      return dateObj.toISOString();
    }
  }

  // If required and no date provided, return current date
  return required ? new Date().toISOString() : null;
};

/**
 * Custom hook for managing events
 * @returns {Object} Events state and methods
 */
export const useEvents = () => {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [completedGroups, setCompletedGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch pending events
  const fetchPending = async () => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const eventsData = await fetchPendingEvents();

      // Log the received events data
      console.log('Received pending events data:', eventsData);

      // Process events to ensure they have valid date fields and IDs
      const processedEvents = eventsData.map((event) => {
        return {
          ...event,
          // Ensure ID is accessible via both id and _id for compatibility
          id: event._id || event.id,
          _id: event._id || event.id,
          // Ensure dueDate is set for grouping
          dueDate: event.end || event.dueDate || new Date().toISOString(),
        };
      });

      setPendingEvents(processedEvents);
      return true;
    } catch (err) {
      setError('Failed to load pending events');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch completed events
  const fetchCompleted = async () => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const eventsData = await fetchCompletedEvents();

      // Log the received events data
      console.log('Received completed events data:', eventsData);

      // Process events to ensure they have valid date fields and IDs
      const processedEvents = eventsData.map((event) => {
        return {
          ...event,
          // Ensure ID is accessible via both id and _id for compatibility
          id: event._id || event.id,
          _id: event._id || event.id,
          // Ensure dueDate is set for grouping
          dueDate: event.end || event.dueDate || new Date().toISOString(),
        };
      });

      setCompletedEvents(processedEvents);
      return true;
    } catch (err) {
      setError('Failed to load completed events');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to update an event's completion status
  const toggleEventStatus = async (eventId, isCompleted) => {
    try {
      setLoading(true);

      // Debug the event ID
      console.log(
        'Toggling event status with ID:',
        eventId,
        'Setting isCompleted to:',
        isCompleted
      );

      // Call the API to update the event status
      const result = await updateEventStatus(eventId, isCompleted);

      // Log the result
      console.log('Update event status result:', result);

      if (!result.success) {
        console.error('Failed to update event status:', result.error);
        setError(result.error || 'Failed to update event status');
        return false;
      }

      // If marking as completed, move from pending to completed
      if (isCompleted) {
        // Remove from pending events immediately for better UI responsiveness
        setPendingEvents(
          pendingEvents.filter((event) => {
            const result = event._id !== eventId && event.id !== eventId;
            console.log(
              `Comparing event._id=${event._id} and event.id=${event.id} with eventId=${eventId}. Keep?`,
              result
            );
            return result;
          })
        );

        // Refresh both pending and completed events to ensure UI is up to date
        await Promise.all([fetchPending(), fetchCompleted()]);
      } else {
        // If marking as incomplete, remove from completed events immediately
        setCompletedEvents(
          completedEvents.filter((event) => {
            return event._id !== eventId && event.id !== eventId;
          })
        );

        // Refresh both pending and completed events
        await Promise.all([fetchPending(), fetchCompleted()]);
      }

      return true;
    } catch (err) {
      console.error('Exception during event status update:', err);
      setError(err.message || 'Failed to update event status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Group pending events by date whenever they change
  useEffect(() => {
    setPendingGroups(groupTasksByDate(pendingEvents));
  }, [pendingEvents]);

  // Group completed events by date whenever they change
  useEffect(() => {
    setCompletedGroups(groupTasksByDate(completedEvents));
  }, [completedEvents]);

  // Add a new event
  const addEvent = async (eventData) => {
    try {
      setLoading(true);

      // Ensure the end date is valid
      const endDate = formatDateToISO(eventData.end, true);

      // For start date, if not provided, use the same as end date
      let startDate = formatDateToISO(eventData.start);
      if (!startDate) {
        startDate = endDate;
      }

      // Format the event data for the API
      const newTask = {
        title: eventData.title,
        courseID: eventData.courseID,
        type: eventData.type,
        description: eventData.description || '',
        weight: Number(eventData.weight),
        isCompleted: false,
        end: endDate,
        start: startDate, // This will never be null
        location: eventData.location || '',
        color: eventData.color || '#E74C3C',
        grade: null,
      };

      // Always use the API
      const createdEvent = await createEvent(newTask);

      // Update local state with the created event
      const dateKey = getDateKey(createdEvent.end);

      // Format the event for local state
      const localEvent = {
        id: createdEvent._id || Date.now().toString(),
        title: createdEvent.title,
        dueDate: createdEvent.end, // Make sure this is a valid date string
        courseID: createdEvent.courseID,
        type: createdEvent.type,
        weight: Number(createdEvent.weight),
        description: createdEvent.description || '',
        isCompleted: createdEvent.isCompleted || false,
        grade: createdEvent.grade || null,
      };

      // Log the local event to debug
      console.log('Created local event:', localEvent);

      // Update local state - add to pending events
      setPendingGroups((prevGroups) => {
        const groupIndex = prevGroups.findIndex((g) => g.date === dateKey);
        if (groupIndex > -1) {
          const updatedGroups = [...prevGroups];
          updatedGroups[groupIndex].tasks.push(localEvent);
          return updatedGroups;
        }
        return [...prevGroups, { date: dateKey, tasks: [localEvent] }];
      });

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Failed to add event:', error);
      setError(error.message || 'Failed to add event');
      setLoading(false);
      return false;
    }
  };

  // Function to delete an event
  const deleteEventById = async (eventId) => {
    try {
      setLoading(true);

      // Debug the event ID
      console.log('Deleting event with ID:', eventId);

      // Call the API to delete the event
      const result = await deleteEvent(eventId);

      console.log('Delete event result:', result);

      if (!result.success) {
        console.error('Failed to delete event:', result.error);
        setError(result.error || 'Failed to delete event');
        return false;
      }

      console.log('Event deleted successfully, updating UI');

      // Remove the event from both pending and completed events immediately for better UI responsiveness
      setPendingEvents(
        pendingEvents.filter((event) => event._id !== eventId && event.id !== eventId)
      );

      setCompletedEvents(
        completedEvents.filter((event) => event._id !== eventId && event.id !== eventId)
      );

      // Force refresh of both pending and completed events to ensure UI is up to date
      await Promise.all([fetchPending(), fetchCompleted()]);

      return true;
    } catch (err) {
      console.error('Exception during event deletion:', err);
      setError(err.message || 'Failed to delete event');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    pendingEvents,
    completedEvents,
    pendingGroups,
    completedGroups,
    loading,
    error,
    fetchPending,
    fetchCompleted,
    addEvent,
    toggleEventStatus,
    deleteEventById,
  };
};
