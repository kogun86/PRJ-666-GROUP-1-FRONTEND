import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { fetchCourses } from '../services/eventService';

/**
 * Custom hook for fetching and managing courses
 * @returns {Object} Courses state and loading state
 */
export const useCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (err) {
        setError('Failed to load courses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user]);

  return {
    courses,
    loading,
    error,
  };
};
