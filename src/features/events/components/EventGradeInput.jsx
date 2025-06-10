import React, { useState } from 'react';
import { LoadingAnimation } from '../../animations';

function EventGradeInput({ initialGrade, onSave, onCancel, isLoading = false }) {
  const [grade, setGrade] = useState(initialGrade || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = grade.trim();

    if (!/^\d+$/.test(value)) {
      setError('Enter a whole number');
      return;
    }

    const number = parseInt(value, 10);
    if (number < 0 || number > 100) {
      setError('Must be between 0 and 100');
      return;
    }

    setError('');
    onSave(number);
  };

  return (
    <form onSubmit={handleSubmit} className="event-grade-form">
      <div className="event-grade-field">
        <label className="event-grade-label">Grade:</label>
        <input
          type="text"
          value={grade}
          onChange={(e) => {
            setGrade(e.target.value);
            if (error) setError('');
          }}
          placeholder="0-100"
          autoFocus
          className="event-grade-input"
          disabled={isLoading}
        />
      </div>

      {error && <div className="event-grade-error">{error}</div>}

      <div className="event-grade-actions">
        <button type="submit" className="event-action-button" disabled={isLoading}>
          {isLoading ? (
            <div className="button-loading">
              <LoadingAnimation size="small" style={{ width: 16, height: 16 }} />
              <span>Saving</span>
            </div>
          ) : (
            'Save'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="event-action-button event-action-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EventGradeInput;
