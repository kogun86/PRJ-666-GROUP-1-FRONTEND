import { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useClassDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteClass = async (classId) => {
    console.log('🗑️ Starting class deletion for ID:', classId);
    setIsDeleting(true);
    setError(null);
    setSuccess(false); // Reset success state at the beginning

    try {
      // Validate classId
      if (!classId) {
        console.error('ClassID is null or undefined');
        throw new Error('Invalid class ID: Cannot be null or undefined');
      }

      console.log('deleteClass called with classId:', classId, 'type:', typeof classId);

      let headers = {
        'Content-Type': 'application/json',
      };

      // Use mock token in development mode
      if (process.env.NODE_ENV === 'development') {
        headers.Authorization = 'Bearer mock-id-token';
      } else {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error('No ID token available');
        headers.Authorization = `Bearer ${idToken}`;
      }

      // Add debugging information
      console.log('Environment:', process.env.NODE_ENV);
      console.log('API Base URL:', API_BASE_URL);
      console.log('Full request URL:', `${API_BASE_URL}/v1/classes/${classId}`);
      console.log('Headers:', JSON.stringify(headers, null, 2));

      // Make the API request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        const response = await fetch(`${API_BASE_URL}/v1/classes/${classId}`, {
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
            const errorMessage = 'Class not found or already deleted';
            setError(errorMessage);
            // Consider this a success since the class is gone
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
        console.log('🗑️ Class deletion successful, setting success state to true');
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
        setError(fetchError.message || 'An error occurred while deleting the class');
        return {
          success: false,
          error: fetchError.message || 'An error occurred while deleting the class',
        };
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Failed to delete class:', error);
      setError(error.message || 'An unexpected error occurred');
      return { success: false, error: error.message || 'An unexpected error occurred' };
    } finally {
      setIsDeleting(false);
      console.log(
        '🗑️ Class deletion process complete, isDeleting set to false, success state:',
        success
      );
    }
  };

  // Helper function to delete class with confirmation
  const confirmClassDelete = (classId, classInfo = {}) => {
    return {
      title: 'Delete Class',
      message: `Are you sure you want to delete this class${classInfo.title ? ` (${classInfo.title})` : ''}? This action cannot be undone.`,
      onConfirm: () => deleteClass(classId),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    };
  };

  return {
    deleteClass,
    confirmClassDelete,
    isDeleting,
    error,
    success,
    resetState: () => {
      console.log('🔄 Resetting class deletion state');
      setError(null);
      setSuccess(false);
    },
  };
}
