import { apiRequest } from '../utils/api.js';
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
  const baseHeaders = {
    'Content-Type': 'application/json',
  };

  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    // Development headers with mock token
    console.log('Using development mock token');
    return {
      ...baseHeaders,
      Authorization: 'Bearer mock-id-token',
    };
  }

  // Production mode - get real token
  try {
    // Get the current session
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('No ID token available');
    }

    return {
      ...baseHeaders,
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

/**
 * Fetches pending events for the user
 * @returns {Promise} Promise resolving to events data
 */
export const fetchPendingEvents = async () => {
  try {
    const headers = await getHeaders();

    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', `${API_BASE_URL}/events/pending`);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/events/pending`, {
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
    console.error('Failed to fetch pending events:', error);
    return [];
  }
};

/**
 * Fetches completed events for the user
 * @returns {Promise} Promise resolving to events data
 */
export const fetchCompletedEvents = async () => {
  try {
    const headers = await getHeaders();

    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', `${API_BASE_URL}/events/completed`);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/events/completed`, {
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
    console.error('Failed to fetch completed events:', error);
    return [];
  }
};

/**
 * Updates an event's completion status
 * @param {string} eventId - The ID of the event to update
 * @param {boolean} isCompleted - The new completion status
 * @returns {Promise} Promise resolving to updated event data
 */
export const updateEventStatus = async (eventId, isCompleted) => {
  try {
    // Validate eventId
    if (!eventId) {
      console.error('EventID is null or undefined');
      return { success: false, error: 'Invalid event ID: Cannot be null or undefined' };
    }

    console.log('updateEventStatus called with eventId:', eventId, 'type:', typeof eventId);

    const headers = await getHeaders();

    // Use the correct URL format based on the isCompleted value
    const statusPath = isCompleted ? 'completed' : 'pending';
    const requestUrl = `${API_BASE_URL}/events/${eventId}/status/${statusPath}`;

    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', requestUrl);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(requestUrl, {
        method: 'PATCH',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: 'Unauthorized - Please log in again' };
        }

        if (response.status === 404) {
          return { success: true, message: 'Event not found - It may have been deleted' };
        }

        if (response.status === 500) {
          console.error('Server returned 500 error');
          return {
            success: false,
            error: 'Internal server error occurred. The server team has been notified.',
          };
        }

        let errorText = '';
        try {
          errorText = await response.text();
          console.error('Error response body:', errorText);

          // Try to parse as JSON if possible
          try {
            const errorData = JSON.parse(errorText);
            return {
              success: false,
              error:
                errorData.errors?.join(', ') ||
                errorData.message ||
                `Server error: ${response.status} - ${response.statusText}`,
            };
          } catch (parseError) {
            // If not JSON, use text directly
            return {
              success: false,
              error: `Server error: ${response.status} - ${errorText || response.statusText}`,
            };
          }
        } catch (textError) {
          if (textError !== errorText) throw textError;
          return {
            success: false,
            error: `Server error: ${response.status} - ${response.statusText}`,
          };
        }
      }

      const data = await response.json();
      console.log('Success response:', data);
      return { success: true, event: data.event || data };
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out - The server took too long to respond',
        };
      }
      return { success: false, error: fetchError.message || 'Unknown error occurred' };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to update event status:', error);
    return { success: false, error: error.message || 'Failed to update event status' };
  }
};

/**
 * Deletes an event by ID
 * @param {string} eventId - ID of the event to delete
 * @returns {Promise<Object>} Promise resolving to success response
 */
export const deleteEvent = async (eventId) => {
  try {
    // Validate eventId
    if (!eventId) {
      console.error('EventID is null or undefined');
      return { success: false, error: 'Invalid event ID: Cannot be null or undefined' };
    }

    console.log('deleteEvent called with eventId:', eventId, 'type:', typeof eventId);

    const headers = await getHeaders();

    // Add debugging information
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', `${API_BASE_URL}/events/${eventId}`);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    // Make the API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (!response.ok) {
        // Special handling for 500 errors
        if (response.status === 500) {
          console.error('Server returned 500 error');

          try {
            // Try to parse the error response
            const errorText = await response.text();
            console.error('Error response body:', errorText);

            try {
              // Try to parse as JSON
              const errorData = JSON.parse(errorText);
              return {
                success: false,
                error:
                  errorData.errors?.join(', ') ||
                  errorData.message ||
                  'Internal server error occurred. The server team has been notified.',
              };
            } catch (jsonError) {
              // If not valid JSON
              return {
                success: false,
                error: 'Internal server error occurred. The server team has been notified.',
              };
            }
          } catch (textError) {
            // If we can't even get the response text
            return {
              success: false,
              error: 'Internal server error occurred. The server team has been notified.',
            };
          }
        }

        if (response.status === 401) {
          return { success: false, error: 'Unauthorized - Please log in again' };
        }

        if (response.status === 404) {
          console.log('Event not found or already deleted - treating as success');
          return { success: true, message: 'Event not found or already deleted' };
        }

        let errorText = '';
        try {
          errorText = await response.text();
          console.error('Error response body:', errorText);

          // Try to parse as JSON if possible
          try {
            const errorData = JSON.parse(errorText);
            return {
              success: false,
              error:
                errorData.errors?.join(', ') ||
                errorData.message ||
                `Server error: ${response.status} - ${response.statusText}`,
            };
          } catch (parseError) {
            // If not JSON, use text directly
            return {
              success: false,
              error: `Server error: ${response.status} - ${errorText || response.statusText}`,
            };
          }
        } catch (textError) {
          if (textError !== errorText) throw textError;
          return {
            success: false,
            error: `Server error: ${response.status} - ${response.statusText}`,
          };
        }
      }

      const data = await response.json();
      console.log('Success response:', data);
      return { success: true, data };
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out - The server took too long to respond',
        };
      }
      return { success: false, error: fetchError.message || 'Unknown error occurred' };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to delete event:', error);
    return { success: false, error: error.message || 'Failed to delete event' };
  }
};
