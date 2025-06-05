import { useState } from 'react';
import { EventDetailsModal } from './EventDetailsModal';

// Hours for the weekly view (8am to 4pm)
const timeSlots = Array.from({ length: 9 }, (_, i) => i + 8);

export default function WeekView({ calendarDays, weeklyEvents }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Get events for a specific day and time slot in weekly view
  const getEventsForTimeSlot = (dayIndex, hour) => {
    const timeSlotKey = `${dayIndex}-${hour}`;
    return weeklyEvents[timeSlotKey] || [];
  };

  // Format hour to AM/PM
  const formatHour = (hour) => {
    return hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  // Format date for header
  const formatHeaderDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
    });
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  return (
    <>
      <div className="week-view-container">
        <div className="week-view-header">
          <div className="time-header"></div>
          {calendarDays.map((day, index) => (
            <div key={index} className={`day-header ${day.isToday ? 'current' : ''}`}>
              {formatHeaderDate(day.date)}
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
                        onClick={(e) => handleEventClick(e, event)}
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

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay">
          <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
      )}
    </>
  );
}
