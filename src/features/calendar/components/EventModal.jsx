import React from 'react';

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format times
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get start and end dates
  const startDate = event.start || new Date(event.start);
  const endDate = event.end || new Date(event.end);

  // Check if this is a multi-day event
  const isMultiDayEvent = startDate.toDateString() !== endDate.toDateString();

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="password-modal">
          <h2 className="password-modal-title">{event.title}</h2>

          <div className="event-details-content">
            <div className="password-form-group">
              <label className="password-label">Date</label>
              <div className="password-input">
                {isMultiDayEvent
                  ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                  : formatDate(startDate)}
              </div>
            </div>

            {!event.allDay && (
              <div className="password-form-group">
                <label className="password-label">Time</label>
                <div className="password-input">
                  {`${formatTime(startDate)} - ${formatTime(endDate)}`}
                </div>
              </div>
            )}

            {event.courseID && (
              <div className="password-form-group">
                <label className="password-label">Course ID</label>
                <div className="password-input">{event.courseID}</div>
              </div>
            )}

            {event.type && (
              <div className="password-form-group">
                <label className="password-label">Type</label>
                <div className="password-input">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </div>
              </div>
            )}

            {event.location && (
              <div className="password-form-group">
                <label className="password-label">Location</label>
                <div className="password-input">{event.location}</div>
              </div>
            )}

            {typeof event.weight !== 'undefined' && (
              <div className="password-form-group">
                <label className="password-label">Weight</label>
                <div className="password-input">{event.weight}%</div>
              </div>
            )}

            {event.isCompleted && typeof event.grade !== 'undefined' && (
              <div className="password-form-group">
                <label className="password-label">Grade</label>
                <div className="password-input">{event.grade}%</div>
              </div>
            )}

            {event.description && (
              <div className="password-form-group">
                <label className="password-label">Description</label>
                <div className="password-input">{event.description}</div>
              </div>
            )}

            <div className="password-actions">
              <button onClick={onClose} className="password-cancel-button">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
