import React from 'react';

function EventCard({ task, onToggle, onSetGrade }) {
  return (
    <div className="events-task-card">
      <h3 className="events-task-title">{task.title}</h3>
      <div className="events-task-meta">
        <div>
          <span>Due date: {task.dueDate || task.date}</span>
          {task.weight && <span> · Weight: {task.weight}</span>}
        </div>
        <div>
          <span className="events-course-code">{task.courseCode}</span>
          <span className="events-task-type">{task.type}</span>
        </div>
      </div>
      <p className="events-task-description">{task.description}</p>
      {task.isCompleted && (
        <p className="events-task-description">
          Grade: <strong>{task.grade != null ? task.grade : 'Not set'}</strong>
        </p>
      )}
      <div style={{ marginTop: 'auto' }}>
        {onToggle && !task.isCompleted && (
          <button
            className="events-complete-btn"
            onClick={onToggle}
            style={{ marginTop: '0.5rem' }}
          >
            Mark Complete
          </button>
        )}
        {onSetGrade && task.isCompleted && (
          <button className="events-complete-btn completed" onClick={onSetGrade}>
            Set Grade
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;
