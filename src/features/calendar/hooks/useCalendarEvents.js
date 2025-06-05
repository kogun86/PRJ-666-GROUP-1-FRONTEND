import { useState } from 'react';

export function useCalendarEvents() {
  const [weeklyEvents, setWeeklyEvents] = useState({});

  // Demo events - in a real app, these would come from an API
  const events = [
    {
      id: 1,
      date: new Date(2025, new Date().getMonth(), 10),
      title: 'Assignment Due',
      type: 'deadline',
      startTime: '14:00', // 2pm
      endTime: '15:00', // 3pm
    },
    {
      id: 2,
      date: new Date(2025, new Date().getMonth(), 15),
      title: 'PRJ566 Lecture',
      type: 'lecture',
      startTime: '10:00', // 10am
      endTime: '12:00', // 12pm
    },
    {
      id: 3,
      date: new Date(2023, new Date().getMonth(), 17),
      title: 'Group Meeting',
      type: 'lab',
      startTime: '13:00', // 1pm
      endTime: '14:00', // 2pm
    },
    {
      id: 4,
      date: new Date(2023, new Date().getMonth(), 20),
      title: 'Midterm',
      type: 'deadline',
      startTime: '15:00', // 3pm
      endTime: '17:00', // 5pm
    },
    {
      id: 5,
      date: new Date(2023, new Date().getMonth(), 15),
      title: 'Study Session',
      type: 'lab',
      startTime: '16:00', // 4pm
      endTime: '18:00', // 6pm
    },
  ];

  return {
    events,
    weeklyEvents,
    setWeeklyEvents,
  };
}
