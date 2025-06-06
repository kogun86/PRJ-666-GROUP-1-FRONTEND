import { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCourseSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitCourse = async (formattedData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) throw new Error('No ID token available');

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      };

      console.log('📤 Submitting course to:', `${API_BASE_URL}/courses`);
      console.log('🔐 Headers:', headers);
      console.log('📦 Data:', JSON.stringify(formattedData, null, 2));

      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.errors?.join(', ') || 'Unknown error');
      }

      setSuccess(true);
      return { success: true };
    } catch (err) {
      console.error(' Error submitting course:', err);
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
