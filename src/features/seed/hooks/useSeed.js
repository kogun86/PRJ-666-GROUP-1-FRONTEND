import { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { courses, generateEvents } from '../data/seedData';
import { createCourse, createEvent } from '../services/seedService';

export function useSeed() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState({ total: 0, completed: 0 });

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
   * Fetch all courses from the backend to get their IDs
   */
  const fetchCourses = async () => {
    try {
      const API_BASE_URL =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8080/api/v1'
          : `${process.env.NEXT_PUBLIC_API_URL}/v1`;

      // Get proper authorization headers
      const headers = await getHeaders();

      console.log('🔍 Fetching all courses to get IDs');
      console.log('🔍 API URL:', `${API_BASE_URL}/courses?active=true`);
      console.log('🔍 Headers:', JSON.stringify(headers, null, 2));

      const response = await fetch(`${API_BASE_URL}/courses?active=true`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Fetched courses:', data);

      // Return the course IDs
      return data.courses || [];
    } catch (err) {
      console.error('❌ Error fetching courses:', err);
      throw err;
    }
  };

  /**
   * Seed the database with courses and events
   */
  const seedData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Calculate total items to track progress
    const totalItems = courses.length + 15; // 6 courses + 15 events
    setProgress({ total: totalItems, completed: 0 });

    try {
      console.log('🌱 Starting seed process');

      // Step 1: Create courses
      console.log(`🌱 Creating ${courses.length} courses`);
      const createdCourseNames = [];

      for (let i = 0; i < courses.length; i++) {
        try {
          const course = courses[i];
          console.log(`🌱 Creating course ${i + 1}/${courses.length}: ${course.title}`);

          const response = await createCourse(course);
          console.log(`✅ Created course: ${course.title}`, response);
          createdCourseNames.push(course.title);

          // Update progress
          setProgress((prev) => ({
            ...prev,
            completed: prev.completed + 1,
          }));
        } catch (courseError) {
          console.error(`❌ Error creating course ${i + 1}:`, courseError);
          // Continue with other courses even if one fails
        }
      }

      // Step 2: Fetch all courses to get their IDs
      console.log('🔍 Fetching created courses to get their IDs');
      const fetchedCourses = await fetchCourses();
      console.log('🔍 Fetched courses:', fetchedCourses);

      // Filter courses to get only the ones we just created
      const ourCourses = fetchedCourses.filter((course) =>
        createdCourseNames.includes(course.title)
      );

      console.log('🔍 Our created courses:', ourCourses);

      // Check if we found any of our courses
      if (ourCourses.length === 0) {
        throw new Error('Failed to find any of the courses we created. Cannot create events.');
      }

      // Extract the course IDs
      const courseIds = ourCourses.map((course) => course._id);
      console.log('🔍 Course IDs for events:', courseIds);

      // Step 3: Generate and create events with the actual course IDs
      console.log(`🌱 Creating events for ${courseIds.length} courses`);
      const events = generateEvents(courseIds);
      console.log(
        `🌱 Generated ${events.length} events:`,
        events.map((e) => e.title)
      );

      // Get the auth headers before creating events
      const headers = await getHeaders();

      for (let i = 0; i < events.length; i++) {
        try {
          const event = events[i];
          console.log(`🌱 Creating event ${i + 1}/${events.length}: ${event.title}`);

          // Format exactly like the example provided
          const formattedEvent = {
            title: event.title,
            courseID: event.courseID,
            type: event.type,
            description: event.description || 'Event description',
            weight: Number(event.weight || 0),
            grade: null,
            isCompleted: false,
            start: event.start,
            end: event.end,
            location: event.location || 'Online',
            color: event.color || '#4A90E2',
          };

          console.log(`🌱 Formatted event data:`, formattedEvent);

          // Use the actual event service
          const createdEvent = await createEvent(formattedEvent);
          console.log(`✅ Created event: ${event.title}`, createdEvent);

          // Update progress
          setProgress((prev) => ({
            ...prev,
            completed: prev.completed + 1,
          }));
        } catch (eventError) {
          console.error(`❌ Error creating event ${i + 1}:`, eventError);
          // Continue with other events even if one fails
        }
      }

      console.log('🌱 Seed process completed successfully');
      setSuccess(true);
    } catch (err) {
      console.error('❌ Seed process failed:', err);
      setError(err.message || 'An unknown error occurred during seeding');
    } finally {
      setLoading(false);
    }
  };

  return {
    seedData,
    loading,
    error,
    success,
    progress,
  };
}
