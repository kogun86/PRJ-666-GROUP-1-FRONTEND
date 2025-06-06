import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { fetchUpcomingEvents, createEvent } from '../services/eventService';
import { groupTasksByDate, getDateKey } from '../utils/dateUtils';

/**
 * Custom hook for managing events
 * @returns {Object} Events state and methods
 */
export const useEvents = () => {
  const { user, isProduction } = useAuth();
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events on mount
  useEffect(() => {
    if (!user) return;

    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isProduction) {
          const eventsData = await fetchUpcomingEvents();
          setEvents(eventsData);
        } else {
          setEvents([]);
        }
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [user, isProduction]);

  // Group events by date whenever events change
  useEffect(() => {
    setGroups(groupTasksByDate(events));
  }, [events]);

  // Add a new event
  const addEvent = async (eventData) => {
    try {
      setLoading(true);

      // Format the event data for the API
      const newTask = {
        title: eventData.title,
        dueDate: eventData.date,
        courseCode: eventData.courseCode,
        type: eventData.type,
        weight: Number(eventData.weight),
        description: eventData.description || '',
        isCompleted: false,
        grade: 0,
      };

      let createdEvent = null;

      if (isProduction && user) {
        // In production, use the API
        createdEvent = await createEvent(newTask);
      } else {
        // In development, create a mock event
        createdEvent = {
          ...newTask,
          _id: Date.now().toString(),
          userId: 'mock-user-id',
        };
      }

      // Update local state with the created event (using API response or mock)
      const dateKey = getDateKey(createdEvent.dueDate);

      // Format the event for local state
      const localEvent = {
        id: createdEvent._id || Date.now().toString(),
        title: createdEvent.title,
        dueDate: createdEvent.dueDate,
        courseCode: createdEvent.courseCode,
        type: createdEvent.type,
        weight: Number(createdEvent.weight),
        description: createdEvent.description || '',
        isCompleted: createdEvent.isCompleted || false,
        grade: createdEvent.grade || 0,
      };

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
  };
};
