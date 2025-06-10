import { convertToUTCSeconds } from '../../courses/utils/timeUtils';

// Helper to generate realistic dates in the coming months
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

// Create dates within the next 3 months
const getDateInMonths = (monthsAhead, day) => {
  const date = new Date(currentYear, currentMonth + monthsAhead, day);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Course colors
const COURSE_COLORS = [
  '#2E86C1', // Blue
  '#8E44AD', // Purple
  '#27AE60', // Green
  '#D35400', // Orange
  '#C0392B', // Red
  '#16A085', // Teal
];

// Semester start and end dates
const SEMESTER_START = getDateInMonths(0, 1);
const SEMESTER_END = getDateInMonths(3, 30);

// Course data
export const courses = [
  {
    title: 'Web Development',
    code: 'WEB666',
    section: 'A',
    status: 'active',
    startDate: SEMESTER_START,
    endDate: SEMESTER_END,
    color: COURSE_COLORS[0],
    instructor: {
      name: 'Dr. John Smith',
      email: 'john.smith@example.com',
      availableTimeSlots: [
        {
          weekday: 2, // Tuesday
          startTime: convertToUTCSeconds('13:00', 2),
          endTime: convertToUTCSeconds('15:00', 2),
        },
        {
          weekday: 4, // Thursday
          startTime: convertToUTCSeconds('10:00', 4),
          endTime: convertToUTCSeconds('12:00', 4),
        },
      ],
    },
    schedule: [
      {
        classType: 'lecture',
        weekday: 1, // Monday
        startTime: convertToUTCSeconds('10:00', 1),
        endTime: convertToUTCSeconds('12:00', 1),
        location: 'Room 301',
      },
      {
        classType: 'lab',
        weekday: 3, // Wednesday
        startTime: convertToUTCSeconds('14:00', 3),
        endTime: convertToUTCSeconds('16:00', 3),
        location: 'Computer Lab 2',
      },
    ],
  },
  {
    title: 'Database Systems',
    code: 'DBS555',
    section: 'B',
    status: 'active',
    startDate: SEMESTER_START,
    endDate: SEMESTER_END,
    color: COURSE_COLORS[1],
    instructor: {
      name: 'Prof. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      availableTimeSlots: [
        {
          weekday: 1, // Monday
          startTime: convertToUTCSeconds('14:00', 1),
          endTime: convertToUTCSeconds('16:00', 1),
        },
        {
          weekday: 3, // Wednesday
          startTime: convertToUTCSeconds('10:00', 3),
          endTime: convertToUTCSeconds('12:00', 3),
        },
      ],
    },
    schedule: [
      {
        classType: 'lecture',
        weekday: 2, // Tuesday
        startTime: convertToUTCSeconds('09:00', 2),
        endTime: convertToUTCSeconds('11:00', 2),
        location: 'Room 202',
      },
      {
        classType: 'lab',
        weekday: 4, // Thursday
        startTime: convertToUTCSeconds('13:00', 4),
        endTime: convertToUTCSeconds('15:00', 4),
        location: 'Database Lab',
      },
    ],
  },
  {
    title: 'Mobile App Development',
    code: 'MAD444',
    section: 'A',
    status: 'active',
    startDate: SEMESTER_START,
    endDate: SEMESTER_END,
    color: COURSE_COLORS[2],
    instructor: {
      name: 'Dr. Michael Lee',
      email: 'michael.lee@example.com',
      availableTimeSlots: [
        {
          weekday: 2, // Tuesday
          startTime: convertToUTCSeconds('15:00', 2),
          endTime: convertToUTCSeconds('17:00', 2),
        },
        {
          weekday: 5, // Friday
          startTime: convertToUTCSeconds('09:00', 5),
          endTime: convertToUTCSeconds('11:00', 5),
        },
      ],
    },
    schedule: [
      {
        classType: 'lecture',
        weekday: 3, // Wednesday
        startTime: convertToUTCSeconds('16:00', 3),
        endTime: convertToUTCSeconds('18:00', 3),
        location: 'Room 105',
      },
      {
        classType: 'lab',
        weekday: 5, // Friday
        startTime: convertToUTCSeconds('13:00', 5),
        endTime: convertToUTCSeconds('15:00', 5),
        location: 'Mobile Lab',
      },
    ],
  },
  {
    title: 'Software Project',
    code: 'PRJ666',
    section: 'C',
    status: 'active',
    startDate: SEMESTER_START,
    endDate: SEMESTER_END,
    color: COURSE_COLORS[3],
    instructor: {
      name: 'Prof. David Wilson',
      email: 'david.wilson@example.com',
      availableTimeSlots: [
        {
          weekday: 3, // Wednesday
          startTime: convertToUTCSeconds('14:00', 3),
          endTime: convertToUTCSeconds('16:00', 3),
        },
        {
          weekday: 5, // Friday
          startTime: convertToUTCSeconds('11:00', 5),
          endTime: convertToUTCSeconds('13:00', 5),
        },
      ],
    },
    schedule: [
      {
        classType: 'lecture',
        weekday: 2, // Tuesday
        startTime: convertToUTCSeconds('16:00', 2),
        endTime: convertToUTCSeconds('18:00', 2),
        location: 'Room 305',
      },
      {
        classType: 'lab',
        weekday: 4, // Thursday
        startTime: convertToUTCSeconds('09:00', 4),
        endTime: convertToUTCSeconds('11:00', 4),
        location: 'Project Space',
      },
    ],
  },
  {
    title: 'Network Security',
    code: 'SEC777',
    section: 'A',
    status: 'active',
    startDate: SEMESTER_START,
    endDate: SEMESTER_END,
    color: COURSE_COLORS[4],
    instructor: {
      name: 'Dr. Emily Chen',
      email: 'emily.chen@example.com',
      availableTimeSlots: [
        {
          weekday: 1, // Monday
          startTime: convertToUTCSeconds('11:00', 1),
          endTime: convertToUTCSeconds('13:00', 1),
        },
        {
          weekday: 4, // Thursday
          startTime: convertToUTCSeconds('15:00', 4),
          endTime: convertToUTCSeconds('17:00', 4),
        },
      ],
    },
    schedule: [
      {
        classType: 'lecture',
        weekday: 1, // Monday
        startTime: convertToUTCSeconds('14:00', 1),
        endTime: convertToUTCSeconds('16:00', 1),
        location: 'Room 401',
      },
      {
        classType: 'lab',
        weekday: 3, // Wednesday
        startTime: convertToUTCSeconds('09:00', 3),
        endTime: convertToUTCSeconds('11:00', 3),
        location: 'Security Lab',
      },
    ],
  },
  {
    title: 'Artificial Intelligence',
    code: 'AI888',
    section: 'B',
    status: 'active',
    startDate: SEMESTER_START,
    endDate: SEMESTER_END,
    color: COURSE_COLORS[5],
    instructor: {
      name: 'Prof. Robert Brown',
      email: 'robert.brown@example.com',
      availableTimeSlots: [
        {
          weekday: 2, // Tuesday
          startTime: convertToUTCSeconds('10:00', 2),
          endTime: convertToUTCSeconds('12:00', 2),
        },
        {
          weekday: 4, // Thursday
          startTime: convertToUTCSeconds('16:00', 4),
          endTime: convertToUTCSeconds('18:00', 4),
        },
      ],
    },
    schedule: [
      {
        classType: 'lecture',
        weekday: 2, // Tuesday
        startTime: convertToUTCSeconds('13:00', 2),
        endTime: convertToUTCSeconds('15:00', 2),
        location: 'Room 201',
      },
      {
        classType: 'lab',
        weekday: 5, // Friday
        startTime: convertToUTCSeconds('15:00', 5),
        endTime: convertToUTCSeconds('17:00', 5),
        location: 'AI Lab',
      },
    ],
  },
];

// Event data - Create 15 events distributed across the next 3 months
// with a mix of assignments, exams, and presentations
export const generateEvents = (courseIds) => {
  if (!courseIds || courseIds.length === 0) {
    console.error('No course IDs provided to generate events');
    return [];
  }

  console.log('Generating events for course IDs:', courseIds);

  // Valid event types that the API accepts
  const validEventTypes = ['assignment', 'exam', 'project', 'quiz', 'test', 'homework'];
  const events = [];

  // Helper to get a random date in the next 3 months
  const getRandomDate = () => {
    const monthOffset = Math.floor(Math.random() * 3); // 0, 1, or 2 months ahead
    const day = Math.floor(Math.random() * 28) + 1; // Day 1-28 (avoiding month end issues)
    const date = new Date(currentYear, currentMonth + monthOffset, day);
    // Get time component for the date (between 9am and 5pm)
    const hour = 9 + Math.floor(Math.random() * 8);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  };

  // Assignment 1 for each course (6 events)
  courseIds.forEach((courseId, index) => {
    if (index >= courses.length) return;

    // First assignment due in about 2-3 weeks
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14 + Math.floor(Math.random() * 7));
    dueDate.setHours(23, 59, 0, 0); // Due at the end of the day

    events.push({
      title: `Assignment 1: ${courses[index].code}`,
      description: `First assignment for ${courses[index].title}. Please submit on time.`,
      courseID: courseId,
      type: 'assignment',
      weight: 10,
      grade: null,
      isCompleted: false,
      end: dueDate.toISOString(),
      start: dueDate.toISOString(),
      location: 'Online Submission',
      color: '#4A90E2',
    });
  });

  // Mid-term exams (3 events)
  for (let i = 0; i < 3 && i < courseIds.length && i < courses.length; i++) {
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 30 + Math.floor(Math.random() * 10)); // Around 1 month from now
    examDate.setHours(10 + i, 0, 0, 0); // Different times for each exam

    events.push({
      title: `Midterm Exam: ${courses[i].code}`,
      description: `Midterm examination for ${courses[i].title}. Covers all material from weeks 1-6.`,
      courseID: courseIds[i],
      type: 'exam',
      weight: 25,
      grade: null,
      isCompleted: false,
      end: examDate.toISOString(),
      start: examDate.toISOString(),
      location: `Room ${200 + Math.floor(Math.random() * 100)}`,
      color: '#E74C3C',
    });
  }

  // Final projects (3 events)
  for (let i = 3; i < 6 && i < courseIds.length && i < courses.length; i++) {
    const projectDate = new Date();
    projectDate.setDate(projectDate.getDate() + 60 + Math.floor(Math.random() * 20)); // Around 2-2.5 months from now
    projectDate.setHours(13 + (i - 3), 0, 0, 0); // Different times for each project

    events.push({
      title: `Final Project: ${courses[i].code}`,
      description: `Final project for ${courses[i].title}. Prepare a 15-minute presentation.`,
      courseID: courseIds[i],
      type: 'project',
      weight: 30,
      grade: null,
      isCompleted: false,
      end: projectDate.toISOString(),
      start: projectDate.toISOString(),
      location: `Room ${300 + Math.floor(Math.random() * 100)}`,
      color: '#27AE60',
    });
  }

  // Additional random assignments (3 events)
  for (let i = 0; i < 3 && i < courseIds.length && i < courses.length; i++) {
    const courseIndex = Math.floor(Math.random() * Math.min(courseIds.length, courses.length));
    if (courseIndex >= courses.length) continue;

    const assignmentDate = new Date();
    assignmentDate.setDate(assignmentDate.getDate() + 40 + Math.floor(Math.random() * 30)); // 1.5-2.5 months from now
    assignmentDate.setHours(23, 59, 0, 0); // Due at the end of the day

    events.push({
      title: `Assignment 2: ${courses[courseIndex].code}`,
      description: `Second assignment for ${courses[courseIndex].title}. Group work allowed.`,
      courseID: courseIds[courseIndex],
      type: 'assignment',
      weight: 15,
      grade: null,
      isCompleted: false,
      end: assignmentDate.toISOString(),
      start: assignmentDate.toISOString(),
      location: 'Online Submission',
      color: '#8E44AD',
    });
  }

  return events;
};
