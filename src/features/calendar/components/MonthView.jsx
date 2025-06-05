import { useState } from 'react';
import { EventDetailsModal } from './EventDetailsModal';

export default function MonthView({ calendarDays, events, onDayClick }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Find events for a specific day
  const getEventsForDay = (date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation(); // Prevent day click when clicking on event
    setSelectedEvent(event);
  };

  return (
    <>
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
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${
                day.isToday ? 'current' : ''
              }`}
              onClick={() => onDayClick(day)}
            >
              <div className="calendar-day-content">
                <div className="calendar-day-number">{day.date.getDate()}</div>

                {/* Events for this day */}
                <div className="calendar-events">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`calendar-event event-${event.type}`}
                      title={event.title}
                      onClick={(e) => handleEventClick(e, event)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay">
          <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
      )}
    </>
  );
}
