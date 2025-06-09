import { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCourseDeletion() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteCourse = async (courseId) => {
    console.log('🗑️ Starting course deletion for ID:', courseId);
    setIsDeleting(true);
    setError(null);
    setSuccess(false); // Reset success state at the beginning

    try {
      // Validate courseId
      if (!courseId) {
        console.error('CourseID is null or undefined');
        throw new Error('Invalid course ID: Cannot be null or undefined');
      }

      console.log('deleteCourse called with courseId:', courseId, 'type:', typeof courseId);

      let headers = {
        'Content-Type': 'application/json',
      };

      // Use mock token in development mode
      if (process.env.NODE_ENV === 'development') {
        headers.Authorization = 'Bearer mock-id-token';
        // In development mode, we're using 'dev' as the userId
        console.log('Using development mode authentication');
      } else {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error('No ID token available');
        headers.Authorization = `Bearer ${idToken}`;
      }

      // Add debugging information
      console.log('Environment:', process.env.NODE_ENV);
      console.log('API Base URL:', API_BASE_URL);
      console.log('Full request URL:', `${API_BASE_URL}/v1/courses/${courseId}`);
      console.log('Headers:', JSON.stringify(headers, null, 2));

      // Make the API request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        const response = await fetch(`${API_BASE_URL}/v1/courses/${courseId}`, {
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
                const errorMessage =
                  errorData.errors?.join(', ') ||
                  errorData.message ||
                  'Internal server error occurred. The server team has been notified.';

                console.error('Parsed error message:', errorMessage);
                setError(errorMessage);
                return { success: false, error: errorMessage };
              } catch (jsonError) {
                // If not valid JSON
                const errorMessage =
                  'Internal server error occurred. The server team has been notified.';
                console.error('Error parsing JSON:', jsonError);
                setError(errorMessage);
                return { success: false, error: errorMessage };
              }
            } catch (textError) {
              // If we can't even get the response text
              const errorMessage =
                'Internal server error occurred. The server team has been notified.';
              console.error('Error getting response text:', textError);
              setError(errorMessage);
              return { success: false, error: errorMessage };
            }
          }

          if (response.status === 401) {
            const errorMessage = 'Unauthorized - Please log in again';
            setError(errorMessage);
            return { success: false, error: errorMessage };
          }

          if (response.status === 404) {
            const errorMessage = 'Course not found or already deleted';
            setError(errorMessage);
            // Consider this a success since the course is gone
            setSuccess(true);
            return { success: true, message: errorMessage };
          }

          let errorText = '';
          try {
            errorText = await response.text();
            console.error('Error response body:', errorText);

            // Try to parse as JSON if possible
            try {
              const errorData = JSON.parse(errorText);
              const errorMessage =
                errorData.errors?.join(', ') ||
                errorData.message ||
                `Server error: ${response.status} - ${response.statusText}`;

              setError(errorMessage);
              return { success: false, error: errorMessage };
            } catch (parseError) {
              // If not JSON, use text directly
              const errorMessage = `Server error: ${response.status} - ${errorText || response.statusText}`;
              setError(errorMessage);
              return { success: false, error: errorMessage };
            }
          } catch (textError) {
            if (textError !== errorText) {
              const errorMessage = textError.message || `Server error: ${response.status}`;
              setError(errorMessage);
              return { success: false, error: errorMessage };
            }
            const errorMessage = `Server error: ${response.status} - ${response.statusText}`;
            setError(errorMessage);
            return { success: false, error: errorMessage };
          }
        }

        const data = await response.json();
        console.log('Success response:', data);
        console.log('🗑️ Course deletion successful, setting success state to true');
        setSuccess(true);
        return { success: true, data };
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          const errorMessage = 'Request timed out - The server took too long to respond';
          console.error(errorMessage);
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
        console.error('Fetch error:', fetchError);
        setError(fetchError.message || 'An error occurred while deleting the course');
        return {
          success: false,
          error: fetchError.message || 'An error occurred while deleting the course',
        };
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
      setError(error.message || 'An unexpected error occurred');
      return { success: false, error: error.message || 'An unexpected error occurred' };
    } finally {
      setIsDeleting(false);
      console.log(
        '🗑️ Course deletion process complete, isDeleting set to false, success state:',
        success
      );
    }
  };

  // Helper function to delete course with confirmation
  const confirmCourseDeletion = (courseId, courseInfo = {}) => {
    return {
      title: 'Delete Course',
      message: `Are you sure you want to delete the course "${courseInfo.title || ''}" (${courseInfo.code || ''})? This will also delete all associated classes and assignments. This action cannot be undone.`,
      onConfirm: () => deleteCourse(courseId),
      confirmText: 'Delete Course',
      cancelText: 'Cancel',
    };
  };

  return {
    deleteCourse,
    confirmCourseDeletion,
    isDeleting,
    error,
    success,
    resetState: () => {
      console.log('🔄 Resetting course deletion state');
      setError(null);
      setSuccess(false);
    },
  };
}
