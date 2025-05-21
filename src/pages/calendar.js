import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'weekly'
  const [currentWeekStart, setCurrentWeekStart] = useState(null);
  const [weeklyEvents, setWeeklyEvents] = useState([]);

  // Hours for the weekly view (10am to 6pm)
  const timeSlots = Array.from({ length: 9 }, (_, i) => i + 10);

  // Demo events - in a real app, these would come from an API
  const events = [
    {
      id: 1,
      date: new Date(2023, currentMonth.getMonth(), 10),
      title: 'Assignment Due',
      type: 'deadline',
      startTime: '14:00', // 2pm
      endTime: '15:00', // 3pm
    },
    {
      id: 2,
      date: new Date(2023, currentMonth.getMonth(), 15),
      title: 'PRJ566 Lecture',
      type: 'lecture',
      startTime: '10:00', // 10am
      endTime: '12:00', // 12pm
    },
    {
      id: 3,
      date: new Date(2023, currentMonth.getMonth(), 17),
      title: 'Group Meeting',
      type: 'lab',
      startTime: '13:00', // 1pm
      endTime: '14:00', // 2pm
    },
    {
      id: 4,
      date: new Date(2023, currentMonth.getMonth(), 20),
      title: 'Midterm',
      type: 'deadline',
      startTime: '15:00', // 3pm
      endTime: '17:00', // 5pm
    },
    {
      id: 5,
      date: new Date(2023, currentMonth.getMonth(), 15),
      title: 'Study Session',
      type: 'lab',
      startTime: '16:00', // 4pm
      endTime: '18:00', // 6pm
    },
  ];

  // Initialize current week on component mount
  useEffect(() => {
    const today = new Date();
    // Get the first day of the current week (Sunday)
    const firstDayOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    firstDayOfWeek.setDate(today.getDate() - dayOfWeek);
    setCurrentWeekStart(firstDayOfWeek);
  }, []);

  // Generate calendar days for the current view mode
  useEffect(() => {
    if (viewMode === 'monthly') {
      generateMonthView();
    } else {
      generateWeekView();
    }
  }, [currentMonth, viewMode, currentWeekStart]);

  // Generate month view
  const generateMonthView = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the first calendar day (may be from previous month)
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 6 = Saturday

    const days = [];

    // Add days from previous month if needed
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Add days from current month
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      });
    }

    // Add days from next month if needed to complete the grid (6 rows of 7 days)
    const daysNeeded = 42 - days.length; // 6 rows of 7 days = 42
    for (let i = 1; i <= daysNeeded; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    setCalendarDays(days);
  };

  // Generate week view
  const generateWeekView = () => {
    if (!currentWeekStart) return;

    const days = [];
    const today = new Date();

    // Generate 7 days starting from the current week start
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);

      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      });
    }

    setCalendarDays(days);

    // Process events for the weekly view
    organizeWeeklyEvents(days);
  };

  // Organize events for the weekly view
  const organizeWeeklyEvents = (weekDays) => {
    const weeklyEventsMap = {};

    events.forEach((event) => {
      // Check if the event falls within the current week
      const eventDate = event.date;
      const eventDay = eventDate.getDay(); // 0 = Sunday, 6 = Saturday

      const weekDay = weekDays.find((day, index) => index === eventDay);
      if (!weekDay) return;

      // Check if dates match (ignoring time)
      const isSameDate =
        weekDay.date.getDate() === eventDate.getDate() &&
        weekDay.date.getMonth() === eventDate.getMonth() &&
        weekDay.date.getFullYear() === eventDate.getFullYear();

      if (isSameDate) {
        // Extract time slot information
        const startHour = parseInt(event.startTime.split(':')[0], 10);
        const endHour = parseInt(event.endTime.split(':')[0], 10);

        // Create a unique key for this day and time slot
        for (let hour = startHour; hour < endHour; hour++) {
          const timeSlotKey = `${eventDay}-${hour}`;

          if (!weeklyEventsMap[timeSlotKey]) {
            weeklyEventsMap[timeSlotKey] = [];
          }

          weeklyEventsMap[timeSlotKey].push(event);
        }
      }
    });

    setWeeklyEvents(weeklyEventsMap);
  };

  // Navigate to previous period (month or week)
  const prevPeriod = () => {
    if (viewMode === 'monthly') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    } else {
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(currentWeekStart.getDate() - 7);
      setCurrentWeekStart(newWeekStart);
      setCurrentMonth(new Date(newWeekStart.getFullYear(), newWeekStart.getMonth()));
    }
  };

  // Navigate to next period (month or week)
  const nextPeriod = () => {
    if (viewMode === 'monthly') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    } else {
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(currentWeekStart.getDate() + 7);
      setCurrentWeekStart(newWeekStart);
      setCurrentMonth(new Date(newWeekStart.getFullYear(), newWeekStart.getMonth()));
    }
  };

  // Switch view mode
  const switchToMonthly = () => {
    setViewMode('monthly');
  };

  const switchToWeekly = () => {
    setViewMode('weekly');
  };

  // Get period string for display
  const getPeriodString = () => {
    if (viewMode === 'monthly') {
      return currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } else if (currentWeekStart) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);

      const startStr = currentWeekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const endStr = weekEnd.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return `${startStr} - ${endStr}`;
    }
    return '';
  };

  // Find events for a specific day
  const getEventsForDay = (date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Get events for a specific day and time slot in weekly view
  const getEventsForTimeSlot = (dayIndex, hour) => {
    const timeSlotKey = `${dayIndex}-${hour}`;
    return weeklyEvents[timeSlotKey] || [];
  };

  // Format hour to AM/PM
  const formatHour = (hour) => {
    return hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  // Handle day click
  const handleDayClick = (day) => {
    console.log('Day clicked:', day.date);
    // Future feature: open modal with day details or event form
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="calendar-container">
          <div className="calendar-card">
            {/* Calendar Header with Navigation and View Toggle */}
            <div className="calendar-header">
              <div className="calendar-month">{getPeriodString()}</div>
              <div className="calendar-controls">
                <div className="view-toggle">
                  <button
                    className={`view-toggle-button ${viewMode === 'weekly' ? 'active' : ''}`}
                    onClick={switchToWeekly}
                  >
                    Weekly
                  </button>
                  <button
                    className={`view-toggle-button ${viewMode === 'monthly' ? 'active' : ''}`}
                    onClick={switchToMonthly}
                  >
                    Monthly
                  </button>
                </div>
                <div className="calendar-nav">
                  <button className="calendar-nav-button" onClick={prevPeriod}>
                    &lt;
                  </button>
                  <button className="calendar-nav-button" onClick={nextPeriod}>
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* Render appropriate view based on viewMode */}
            {viewMode === 'monthly' ? (
              <div className="calendar-grid month-view">
                {/* Weekday Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="calendar-weekday">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => {
                  const dayEvents = getEventsForDay(day.date);
                  return (
                    <div
                      key={index}
                      className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'current' : ''}`}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className="calendar-day-number">{day.date.getDate()}</div>

                      {/* Events for this day */}
                      <div className="calendar-events">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`calendar-event event-${event.type}`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="week-view-container">
                <div className="week-view-header">
                  <div className="time-header"></div>
                  {calendarDays.map((day, index) => (
                    <div key={index} className={`day-header ${day.isToday ? 'current' : ''}`}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                      <div className="day-number">{day.date.getDate()}</div>
                    </div>
                  ))}
                </div>

                <div className="week-view-grid">
                  {timeSlots.map((hour) => (
                    <div key={hour} className="time-row">
                      <div className="time-label">{formatHour(hour)}</div>

                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const events = getEventsForTimeSlot(dayIndex, hour);
                        return (
                          <div
                            key={dayIndex}
                            className={`time-cell ${calendarDays[dayIndex]?.isToday ? 'current' : ''}`}
                          >
                            {events.map((event) => (
                              <div
                                key={event.id}
                                className={`week-event event-${event.type}`}
                                title={`${event.title} (${event.startTime} - ${event.endTime})`}
                              >
                                {event.title}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
