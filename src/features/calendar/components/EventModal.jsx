import React from 'react';

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="password-modal">
          <h2 className="password-modal-title">{event.title}</h2>

          <div className="event-details-content">
            <div className="password-form-group">
              <label className="password-label">Date</label>
              <div className="password-input">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            <div className="password-form-group">
              <label className="password-label">Time (UTC)</label>
              <div className="password-input">
                {event.isUTC
                  ? `${event.formattedStartTime} - ${event.formattedEndTime}`
                  : event.originalStartTime
                    ? `${new Date(event.originalStartTime).toUTCString().slice(17, 22)} - ${new Date(event.originalEndTime).toUTCString().slice(17, 22)}`
                    : 'N/A'}
              </div>
            </div>

            <div className="password-form-group">
              <label className="password-label">Time (Your Local Time)</label>
              <div className="password-input">
                {event.startTime
                  ? `${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'N/A'}
              </div>
            </div>

            {event.courseCode && (
              <div className="password-form-group">
                <label className="password-label">Course</label>
                <div className="password-input">{event.courseCode}</div>
              </div>
            )}

            {event.type && (
              <div className="password-form-group">
                <label className="password-label">Type</label>
                <div className="password-input">{event.type}</div>
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
