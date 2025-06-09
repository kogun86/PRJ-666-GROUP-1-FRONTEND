import { useState, useEffect } from 'react';
import { Auth } from '../../../features/auth/lib/amplifyClient';
import { secondsToTime, getWeekday } from '../utils/timeUtils';
import { transformClasses } from '../utils/classUtils';

export function useCourses() {
  const [myCourses, setMyCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses and classes from the backend
  useEffect(() => {
    fetchCoursesAndClasses();
  }, []);

  const fetchCoursesAndClasses = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      console.log('🔗 API_BASE_URL:', API_BASE_URL);

      let headers;
      // In development mode, use mock headers
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
        console.log('🔐 Using development mock headers');
      } else {
        // Production mode - use real auth
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to view courses.');
        }
        headers = user.authorizationHeaders();
        console.log('🔐 Auth Headers:', headers);
      }

      //  Fetch courses
      const courseRes = await fetch(`${API_BASE_URL}/v1/courses?active=true`, {
        headers,
      });
      if (!courseRes.ok) {
        throw new Error(`HTTP error! status: ${courseRes.status}`);
      }
      const courseData = await courseRes.json();
      console.log('📥 Courses response:', courseData);
      const courses = courseData.courses || [];

      const fetchedCourses = courses.map((course) => ({
        _id: course._id, // Store the course ID for delete operations
        title: course.title,
        code: course.code,
        section: course.section || 'A',
        professor: course.instructor?.name,
        color: course.color || '#cad2c5',
        grade: 0,
        schedule: course.schedule.map((s) => ({
          time: `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`,
          weekDay: getWeekday(s.weekday),
        })),
      }));
      setMyCourses(fetchedCourses);

      //  Fetch classes
      const classRes = await fetch(`${API_BASE_URL}/v1/classes`, {
        headers,
      });
      if (!classRes.ok) {
        throw new Error(`HTTP error! status: ${classRes.status}`);
      }
      const classData = await classRes.json();
      console.log('📥 Classes response:', classData);
      const classes = classData.classes || [];

      // Transform classes for the schedule view
      const transformedSchedule = transformClasses(classes, courses);
      setSchedule(transformedSchedule);
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Refresh class data after a class is deleted
  const refreshClasses = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      let headers;
      // In development mode, use mock headers
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
        console.log('🔄 Using development mock headers for class refresh');
      } else {
        // Production mode - use real auth
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to view courses.');
        }
        headers = user.authorizationHeaders();
      }

      const classRes = await fetch(`${API_BASE_URL}/v1/classes`, {
        headers,
      });
      if (!classRes.ok) {
        throw new Error(`HTTP error! status: ${classRes.status}`);
      }

      const classData = await classRes.json();
      console.log('🔄 Refreshed classes data:', classData);
      const courses = myCourses.map((course) => ({
        _id: course._id,
        title: course.title,
        code: course.code,
        instructor: { name: course.professor },
        color: course.color,
      }));
      const transformedSchedule = transformClasses(classData.classes, courses);
      setSchedule(transformedSchedule);
    } catch (err) {
      console.error('Failed to refresh classes after delete:', err.message);
    }
  };

  // Refresh course data after a course is deleted or added
  const refreshCourses = async () => {
    try {
      console.log('🔄 Starting course refresh');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      let headers;
      // In development mode, use mock headers
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
        console.log('🔄 Using development mock headers for refresh');
      } else {
        // Production mode - use real auth
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to view courses.');
        }
        headers = user.authorizationHeaders();
      }

      const courseRes = await fetch(`${API_BASE_URL}/v1/courses?active=true`, {
        headers,
      });
      if (!courseRes.ok) {
        throw new Error(`HTTP error! status: ${courseRes.status}`);
      }
      const courseData = await courseRes.json();
      console.log('🔄 Refreshed courses data:', courseData);
      const courses = courseData.courses || [];

      // Check if the courses array is the same as the current state to prevent unnecessary updates
      if (
        JSON.stringify(courses.map((c) => c._id)) === JSON.stringify(myCourses.map((c) => c._id))
      ) {
        console.log('🔄 Course IDs unchanged, skipping update');
        return;
      }

      const fetchedCourses = courses.map((course) => ({
        _id: course._id,
        title: course.title,
        code: course.code,
        section: course.section || 'A',
        professor: course.instructor?.name,
        color: course.color || '#cad2c5',
        grade: 0,
        schedule: course.schedule.map((s) => ({
          time: `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`,
          weekDay: getWeekday(s.weekday),
        })),
      }));
      console.log('🔄 Setting myCourses with new data:', fetchedCourses);
      setMyCourses(fetchedCourses);
      console.log('🔄 Course refresh complete');
    } catch (err) {
      console.error('Failed to refresh courses after delete:', err.message);
    }
  };

  // Add a new course to the local state
  const addCourse = (course) => {
    setMyCourses((prev) => [...prev, course]);
  };

  return {
    myCourses,
    schedule,
    isLoading,
    error,
    setMyCourses,
    setSchedule,
    fetchCoursesAndClasses,
    refreshClasses,
    refreshCourses,
    addCourse,
  };
}
