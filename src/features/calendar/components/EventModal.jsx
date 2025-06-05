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
              <label className="password-label">Time</label>
              <div className="password-input">{`${event.startTime} - ${event.endTime}`}</div>
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
