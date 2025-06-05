// Hours for the weekly view (10am to 6pm)
const timeSlots = Array.from({ length: 9 }, (_, i) => i + 10);

export default function WeekView({ calendarDays, weeklyEvents }) {
  // Get events for a specific day and time slot in weekly view
  const getEventsForTimeSlot = (dayIndex, hour) => {
    const timeSlotKey = `${dayIndex}-${hour}`;
    return weeklyEvents[timeSlotKey] || [];
  };

  // Format hour to AM/PM
  const formatHour = (hour) => {
    return hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  return (
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
  );
}
