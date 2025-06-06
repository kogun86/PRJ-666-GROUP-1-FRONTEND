import { apiRequest } from '../../../lib/api.js';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/v1'
    : `${process.env.NEXT_PUBLIC_API_URL}/v1`;

/**
 * Get authorization headers for API requests
 * @returns {Promise<Object>} Headers object with authorization
 */
const getHeaders = async () => {
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
};

/**
 * Fetches upcoming events for the user
 * @returns {Promise} Promise resolving to events data
 */
export const fetchUpcomingEvents = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/events/upcoming`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
};

/**
 * Creates a new event
 * @param {Object} eventData - Event data to create
 * @returns {Promise} Promise resolving to created event data
 */
export const createEvent = async (eventData) => {
  try {
    const headers = await getHeaders();

    // Format the event data according to the API requirements
    const formattedEvent = {
      title: eventData.title,
      courseCode: eventData.courseCode,
      weight: Number(eventData.weight),
      dueDate: eventData.dueDate,
      type: eventData.type,
      isCompleted: false,
      grade: eventData.grade ? Number(eventData.grade) : 0,
      description: eventData.description || '',
    };

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers,
      body: JSON.stringify(formattedEvent),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage = data.errors ? data.errors.join(', ') : 'Failed to create event';
      throw new Error(errorMessage);
    }

    return data.event;
  } catch (error) {
    console.error('Failed to save event:', error);
    throw error;
  }
};
