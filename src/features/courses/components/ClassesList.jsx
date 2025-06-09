import React from 'react';
import { LoadingAnimation } from '../../../components/ui';

export default function ClassesList({ schedule, handleDeleteClass, isDeletingClass }) {
  if (schedule.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">You don't have any classes scheduled.</p>
      </div>
    );
  }

  return (
    <>
      {schedule.map(({ date, sessions }) => (
        <div key={date} className="class-group">
          <h4 className="class-group-title">{date}</h4>
          <div className="session-container">
            {sessions.map((s, idx) => (
              <div key={`${s.code}-${idx}`} className="session-card">
                <div className="session-actions">
                  <button
                    className="delete-class-button"
                    onClick={() => handleDeleteClass(s.id)}
                    disabled={isDeletingClass}
                  >
                    {isDeletingClass ? (
                      <LoadingAnimation size="small" style={{ width: 24, height: 24 }} />
                    ) : (
                      '×'
                    )}
                  </button>
                </div>
                <h5 className="session-title">{s.title || s.code}</h5>
                <div className="session-meta">
                  <div className="session-time">
                    <strong>Time:</strong> {s.from} - {s.until}
                  </div>
                  <div className="session-type">
                    <span className="session-type-badge">{s.type}</span>
                  </div>
                </div>
                <div className="session-details">
                  <div>
                    <strong>Room:</strong> {s.room}
                  </div>
                  <div>
                    <strong>Code:</strong> {s.code}
                  </div>
                  <div>
                    <strong>Section:</strong> {s.section}
                  </div>
                  <div>
                    <strong>Professor:</strong> {s.professor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
