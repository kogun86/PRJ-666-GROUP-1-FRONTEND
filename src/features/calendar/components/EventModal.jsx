import React from 'react';
import Modal from '../../../componentShared/Modal';

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get start and end dates - ensure they are valid Date objects
  let startDate, endDate;

  try {
    startDate = event.startTime
      ? new Date(event.startTime)
      : event.start
        ? new Date(event.start)
        : null;

    endDate = event.endTime ? new Date(event.endTime) : event.end ? new Date(event.end) : null;
  } catch (error) {
    console.error('Error parsing dates:', error);
    startDate = null;
    endDate = null;
  }

  // Check if this is a multi-day event (safely)
  const isMultiDayEvent =
    startDate && endDate && startDate.toDateString() !== endDate.toDateString();

  // Check if this is a class (from the Calendar component)
  const isClass = event.isClass || event.classType;

  // Get course info for classes
  const courseInfo =
    isClass && event.courseId && typeof event.courseId === 'object' ? event.courseId : null;

  return (
    <Modal isOpen={true} onClose={onClose} title={event.title}>
      <div className="event-details-content">
        <div className="password-form-group">
          <label className="password-label">Date</label>
          <div className="password-input">
            {isMultiDayEvent
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : formatDate(startDate)}
          </div>
        </div>

        {!event.allDay && startDate && endDate && (
          <div className="password-form-group">
            <label className="password-label">Time</label>
            <div className="password-input">
              {`${formatTime(startDate)} - ${formatTime(endDate)}`}
            </div>
          </div>
        )}

        {/* Course information for classes */}
        {isClass && (
          <>
            {courseInfo && courseInfo.code && (
              <div className="password-form-group">
                <label className="password-label">Course Code</label>
                <div className="password-input">{courseInfo.code}</div>
              </div>
            )}

            {courseInfo && courseInfo.title && (
              <div className="password-form-group">
                <label className="password-label">Course Title</label>
                <div className="password-input">{courseInfo.title}</div>
              </div>
            )}

            {event.classType && (
              <div className="password-form-group">
                <label className="password-label">Class Type</label>
                <div className="password-input">
                  {event.classType.charAt(0).toUpperCase() + event.classType.slice(1)}
                </div>
              </div>
            )}

            {event.topics && event.topics.length > 0 && (
              <div className="password-form-group">
                <label className="password-label">Topics</label>
                <div className="password-input">
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {event.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {courseInfo && courseInfo.instructor && (
              <div className="password-form-group">
                <label className="password-label">Instructor</label>
                <div className="password-input">
                  {courseInfo.instructor.name}
                  {courseInfo.instructor.email && (
                    <div>
                      <small>{courseInfo.instructor.email}</small>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Regular event fields */}
        {!isClass && (
          <>
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
          </>
        )}

        {/* Common fields for both events and classes */}
        {(event.location ||
          (courseInfo && courseInfo.schedule && courseInfo.schedule.length > 0)) && (
          <div className="password-form-group">
            <label className="password-label">Location</label>
            <div className="password-input">
              {event.location ||
                (courseInfo && courseInfo.schedule && courseInfo.schedule.length > 0
                  ? courseInfo.schedule.find((s) => s.classType === event.classType)?.location ||
                    'Not specified'
                  : 'Not specified')}
            </div>
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
    </Modal>
  );
}
