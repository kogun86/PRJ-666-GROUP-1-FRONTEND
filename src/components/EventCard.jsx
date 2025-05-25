import React from 'react';

function EventCard({ task, onToggle, onSetGrade }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <div className="task-card">
        <div className="card-content">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-meta">
            <div>
              <span>Due date: {task.dueDate || task.date}</span>
              {task.weight && <span> · Weight: {task.weight}</span>}
            </div>
            <div>
              <span className="course-code">{task.courseCode}</span>
              <span className="task-type">{task.type}</span>
              {task.completed && (
                <p style={{ marginTop: '0.3rem', fontWeight: '600' }}>
                  Grade: {task.grade || 'Not graded'}
                </p>
              )}
            </div>
          </div>
          {task.description && <p className="task-description">{task.description}</p>}
          {task.topics && (
            <ul className="topics-list">
              {task.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <button
        className="complete-btn"
        onClick={task.completed ? onSetGrade : onToggle}
        style={{ marginTop: '0.5rem' }}
      >
        {task.completed ? 'Set Grade' : 'Mark as Complete'}
      </button>
    </div>
  );
}

export default EventCard;
