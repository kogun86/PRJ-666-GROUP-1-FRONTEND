import { fetchAuthSession } from 'aws-amplify/auth';

// Make sure the API URL format matches the other services EXACTLY
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
    console.log('🌱 Seed: Using development mock token');
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
 * Creates a new course
 * @param {Object} courseData - Course data to create
 * @returns {Promise} Promise resolving to created course data
 */
export const createCourse = async (courseData) => {
  try {
    const headers = await getHeaders();

    console.log('🌱 Creating course:', courseData.title);
    console.log('🌱 API URL:', `${API_BASE_URL}/courses`);
    console.log('🌱 Course data:', JSON.stringify(courseData, null, 2));

    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers,
      body: JSON.stringify(courseData),
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.errors?.join(', ') || errorMessage;
      } catch (e) {
        console.warn('⚠️ Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log('🌱 Course created response:', responseData);
    return responseData;
  } catch (error) {
    console.error('❌ Error creating course:', error);
    throw error;
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

    // Format the event data according to the API requirements - using same structure as the real service
    const formattedEvent = {
      title: eventData.title,
      courseID: eventData.courseID,
      type: eventData.type,
      description: eventData.description || '',
      weight: Number(eventData.weight || 0),
      isCompleted: false,
      end: eventData.end,
      start: eventData.start || eventData.end,
      location: eventData.location || '',
      color: eventData.color || '#E74C3C',
      grade: null,
    };

    console.log('🌱 Creating event:', formattedEvent.title);

    // Use the exact same endpoint as in the eventService.js
    const eventApiUrl = `${API_BASE_URL}/events`;
    console.log('🌱 API URL:', eventApiUrl);
    console.log('🌱 Event data:', JSON.stringify(formattedEvent, null, 2));

    // Set up timeout just like in the original service
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(eventApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedEvent),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('🌱 Event response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.errors?.join(', ') || errorMessage;
        } catch (e) {
          // Try to get text instead
          try {
            const errorText = await response.text();
            console.warn('⚠️ Response not JSON:', errorText);
            errorMessage = `${errorMessage}: ${errorText}`;
          } catch (e2) {
            console.warn('⚠️ Failed to parse error response:', e);
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('🌱 Event created response:', data);
      return data.event || data;
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - The server took too long to respond');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('❌ Error creating event:', error);
    throw error;
  }
};
