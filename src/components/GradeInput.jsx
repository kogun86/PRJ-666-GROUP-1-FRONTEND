import React, { useState } from 'react';

function GradeInput({ initialGrade, onSave, onCancel }) {
  const [grade, setGrade] = useState(initialGrade || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = grade.trim();

    // Check if it's a number
    const parsed = parseInt(trimmed, 10);

    if (trimmed === '' || isNaN(parsed) || parsed < 0 || parsed > 100 || !/^\d+$/.test(trimmed)) {
      setError('Please enter a valid integer between 0 and 100.');
    } else {
      setError('');
      onSave(parsed);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '8px' }}>
      <input
        type="text"
        value={grade}
        onChange={(e) => {
          setGrade(e.target.value);
          if (error) setError('');
        }}
        placeholder="Enter grade"
        autoFocus
        style={{ marginRight: '8px' }}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: '4px' }}>
        Cancel
      </button>
      {error && <div style={{ color: 'red', marginTop: '4px' }}>{error}</div>}
    </form>
  );
}

export default GradeInput;
