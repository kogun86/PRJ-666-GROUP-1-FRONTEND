import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { fetchUpcomingEvents, createEvent } from '../services/eventService';
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
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch events
  const fetchEvents = async () => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      const eventsData = await fetchUpcomingEvents();

      // Log the received events data
      console.log('Received events data:', eventsData);

      // Process events to ensure they have valid date fields
      const processedEvents = eventsData.map((event) => {
        return {
          ...event,
          // Ensure dueDate is set for grouping
          dueDate: event.end || event.dueDate || new Date().toISOString(),
        };
      });

      setEvents(processedEvents);
      return true;
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Group events by date whenever events change
  useEffect(() => {
    setGroups(groupTasksByDate(events));
  }, [events]);

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

      // Update local state
      setGroups((prevGroups) => {
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

  return {
    events,
    groups,
    loading,
    error,
    setGroups,
    addEvent,
    fetchEvents,
  };
};
