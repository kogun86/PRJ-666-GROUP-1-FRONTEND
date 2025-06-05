import { useState } from 'react';
import { useAuth } from '@/features/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

// Use the same format as in the calendar hook for consistency
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/v1'
    : `${process.env.NEXT_PUBLIC_API_URL}/v1`;

/**
 * Hook for submitting course data to the backend
 * @returns {Object} Methods and state for course submission
 */
export function useCourseSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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

  /**
   * Submit a course to the backend
   * @param {Object} courseData - Course data to submit
   * @returns {Promise<Object>} The response from the server
   */
  const submitCourse = async (courseData) => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, errors: ['User not authenticated'] };
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const headers = await getHeaders();

      // Ensure the course data is properly formatted for the API
      // Make a deep copy to avoid modifying the original data
      const formattedData = JSON.parse(JSON.stringify(courseData));

      // Ensure schedule is an array as expected by the backend
      // The error message said: "Invalid input: expected array, received object at schedule"
      if (!Array.isArray(formattedData.schedule) && formattedData.schedule) {
        console.warn('Schedule is an object, converting back to array');
        formattedData.schedule = [formattedData.schedule];
      }

      // Add more debugging information
      console.log('Environment:', process.env.NODE_ENV);
      console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('API Base URL:', API_BASE_URL);
      console.log('Full request URL:', `${API_BASE_URL}/courses`);
      console.log('Headers:', JSON.stringify(headers, null, 2));
      console.log('Course data (formatted):', JSON.stringify(formattedData, null, 2));

      // Make the API request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        const response = await fetch(`${API_BASE_URL}/courses`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formattedData),
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

        const result = await response.json();
        console.log('Success response:', result);
        setSuccess(true);
        return result;
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out - The server took too long to respond');
        }
        throw fetchError;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error submitting course:', err);
      return { success: false, errors: [err.message] };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitCourse,
    isSubmitting,
    error,
    success,
    resetState: () => {
      setError(null);
      setSuccess(false);
    },
  };
}
