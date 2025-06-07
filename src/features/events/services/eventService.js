import { apiRequest } from '../../../lib/api.js';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useAuth } from '@/features/auth';

// Use the same format as in the courses hook for consistency
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

    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', `${API_BASE_URL}/events`);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in again');
        }

        if (response.status === 404) {
          throw new Error('API endpoint not found - Please check server configuration');
        }

        let errorText = '';
        try {
          errorText = await response.text();
          console.error('Error response body:', errorText);

          // Try to parse as JSON if possible
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(
              errorData.errors?.join(', ') ||
                errorData.message ||
                `Server error: ${response.status} - ${response.statusText}`
            );
          } catch (parseError) {
            // If not JSON, use text directly
            throw new Error(
              `Server error: ${response.status} - ${errorText || response.statusText}`
            );
          }
        } catch (textError) {
          if (textError !== errorText) throw textError;
          throw new Error(`Server error: ${response.status} - ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data.events || [];
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - The server took too long to respond');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
};

/**
 * Fetches all courses for the user
 * @returns {Promise} Promise resolving to courses data
 */
export const fetchCourses = async () => {
  try {
    const headers = await getHeaders();

    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', `${API_BASE_URL}/courses`);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in again');
        }

        if (response.status === 404) {
          throw new Error('API endpoint not found - Please check server configuration');
        }

        let errorText = '';
        try {
          errorText = await response.text();
          console.error('Error response body:', errorText);

          // Try to parse as JSON if possible
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(
              errorData.errors?.join(', ') ||
                errorData.message ||
                `Server error: ${response.status} - ${response.statusText}`
            );
          } catch (parseError) {
            // If not JSON, use text directly
            throw new Error(
              `Server error: ${response.status} - ${errorText || response.statusText}`
            );
          }
        } catch (textError) {
          if (textError !== errorText) throw textError;
          throw new Error(`Server error: ${response.status} - ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data.courses || [];
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - The server took too long to respond');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to fetch courses:', error);
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
      courseID: eventData.courseID,
      type: eventData.type,
      description: eventData.description || '',
      weight: Number(eventData.weight),
      isCompleted: false,
      end: eventData.end,
      start: eventData.start || null,
      location: eventData.location || '',
      color: eventData.color || '#E74C3C',
      grade: eventData.grade ? Number(eventData.grade) : null,
    };

    // Add debugging information
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', `${API_BASE_URL}/events`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Event data (formatted):', JSON.stringify(formattedEvent, null, 2));

    // Make the API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedEvent),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log(
        'Response headers:',
        JSON.stringify(Object.fromEntries([...response.headers.entries()]), null, 2)
      );

      if (!response.ok) {
        // Handle different error scenarios
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in again');
        }

        if (response.status === 404) {
          throw new Error('API endpoint not found - Please check server configuration');
        }

        let errorText = '';
        try {
          errorText = await response.text();
          console.error('Error response body:', errorText);

          // Try to parse as JSON if possible
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(
              errorData.errors?.join(', ') ||
                errorData.message ||
                `Server error: ${response.status} - ${response.statusText}`
            );
          } catch (parseError) {
            // If not JSON, use text directly
            throw new Error(
              `Server error: ${response.status} - ${errorText || response.statusText}`
            );
          }
        } catch (textError) {
          if (textError !== errorText) throw textError;
          throw new Error(`Server error: ${response.status} - ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data.event;
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - The server took too long to respond');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to save event:', error);
    throw error;
  }
};
