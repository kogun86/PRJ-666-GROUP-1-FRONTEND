import { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { convertToSeconds } from '../utils/timeUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCourseSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitCourse = async (formattedData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let headers = {
        'Content-Type': 'application/json',
      };

      // In development mode, use mock token and ensure userId is 'dev'
      if (process.env.NODE_ENV === 'development') {
        headers.Authorization = 'Bearer mock-id-token';
        // Ensure userId is 'dev' in development mode to match Thunder Client requests
        formattedData = { ...formattedData, userId: 'dev' };
      } else {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error('No ID token available');
        headers.Authorization = `Bearer ${idToken}`;
      }

      // Ensure time fields are properly converted to seconds
      const dataToSubmit = {
        ...formattedData,
        instructor: {
          ...formattedData.instructor,
          availableTimeSlots: formattedData.instructor.availableTimeSlots.map((slot) => ({
            ...slot,
            startTime:
              typeof slot.startTime === 'string'
                ? convertToSeconds(slot.startTime)
                : slot.startTime,
            endTime:
              typeof slot.endTime === 'string' ? convertToSeconds(slot.endTime) : slot.endTime,
          })),
        },
        schedule: formattedData.schedule.map((item) => ({
          ...item,
          startTime:
            typeof item.startTime === 'string' ? convertToSeconds(item.startTime) : item.startTime,
          endTime: typeof item.endTime === 'string' ? convertToSeconds(item.endTime) : item.endTime,
        })),
      };

      console.log('📤 Submitting course to:', `${API_BASE_URL}/v1/courses`);
      console.log('🔐 Headers:', headers);
      console.log('📦 Data:', JSON.stringify(dataToSubmit, null, 2));

      const response = await fetch(`${API_BASE_URL}/v1/courses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData?.errors?.join(', ') || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          console.warn('⚠️ Failed to parse error response:', e);
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('📥 Course created response:', responseData);

      setSuccess(true);
      return {
        success: true,
        courseId: responseData.course?._id || responseData._id,
        course: responseData.course || responseData,
      };
    } catch (err) {
      console.error('❌ Error submitting course:', err);
      setError(err.message);
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
