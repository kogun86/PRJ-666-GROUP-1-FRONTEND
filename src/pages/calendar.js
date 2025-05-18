import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Demo events - in a real app, these would come from an API
  const events = [
    {
      id: 1,
      date: new Date(2023, currentMonth.getMonth(), 10),
      title: 'Assignment Due',
      type: 'deadline',
    },
    {
      id: 2,
      date: new Date(2023, currentMonth.getMonth(), 15),
      title: 'PRJ566 Lecture',
      type: 'lecture',
    },
    {
      id: 3,
      date: new Date(2023, currentMonth.getMonth(), 17),
      title: 'Group Meeting',
      type: 'lab',
    },
    {
      id: 4,
      date: new Date(2023, currentMonth.getMonth(), 20),
      title: 'Midterm',
      type: 'deadline',
    },
    {
      id: 5,
      date: new Date(2023, currentMonth.getMonth(), 15),
      title: 'Study Session',
      type: 'lab',
    },
  ];

  // Generate calendar days for the current month view
  useEffect(() => {
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
  }, [currentMonth]);

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Get month and year string for display
  const monthYearString = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Find events for a specific day
  const getEventsForDay = (date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Handle day click
  const handleDayClick = (day) => {
    console.log('Day clicked:', day.date);
    // Future feature: open modal with day details or event form
  };

  return (
    <Layout>
      <div className="calendar-container">
        <h1 className="calendar-title">Calendar</h1>

        <div className="calendar-card">
          {/* Calendar Header with Navigation */}
          <div className="calendar-header">
            <div className="calendar-month">{monthYearString}</div>
            <div className="calendar-nav">
              <button className="calendar-nav-button" onClick={prevMonth}>
                &lt;
              </button>
              <button className="calendar-nav-button" onClick={nextMonth}>
                &gt;
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
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
                  {day.isCurrentMonth && (
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
