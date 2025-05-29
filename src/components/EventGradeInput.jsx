import React, { useState } from 'react';

function EventGradeInput({ initialGrade, onSave, onCancel }) {
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
    <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
      <input
        type="text"
        value={grade}
        onChange={(e) => {
          setGrade(e.target.value);
          if (error) setError('');
        }}
        placeholder="0-100"
        autoFocus
        style={{ marginRight: 8 }}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: 4 }}>
        Cancel
      </button>
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
    </form>
  );
}

export default EventGradeInput;
