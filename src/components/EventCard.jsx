import React from 'react';

function EventCard({ task, onToggle, onSetGrade }) {
  return (
    <div className="task-card">
      <h3 className="task-title">{task.title}</h3>
      <div className="task-meta">
        <div>
          <span>Due date: {task.dueDate || task.date}</span>
          {task.weight && <span> · Weight: {task.weight}</span>}
        </div>
        <div>
          <span className="course-code">{task.courseCode}</span>
          <span className="task-type">{task.type}</span>
        </div>
      </div>
      <p className="task-description">{task.description}</p>
      {task.isCompleted && (
        <p className="task-description">
          Grade: <strong>{task.grade != null ? task.grade : 'Not set'}</strong>
        </p>
      )}
      <div style={{ marginTop: 'auto' }}>
        {onToggle && !task.isCompleted && (
          <button className="complete-btn" onClick={onToggle} style={{ marginTop: '0.5rem' }}>
            Mark Complete
          </button>
        )}
        {onSetGrade && task.isCompleted && (
          <button className="complete-btn completed" onClick={onSetGrade}>
            Set Grade
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;
