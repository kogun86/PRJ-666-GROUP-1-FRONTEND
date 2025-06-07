import React, { useState } from 'react';

export default function CalendarDebug({ events, transformedEvents }) {
  const [showRaw, setShowRaw] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      className="calendar-debug"
      style={{
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        fontSize: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h4 style={{ margin: 0 }}>Calendar Debug</h4>
        <button
          onClick={() => setShowRaw(!showRaw)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#eee',
            border: '1px solid #ccc',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {showRaw ? 'Hide Raw Data' : 'Show Raw Data'}
        </button>
      </div>

      <div>
        <p>Raw events count: {events.length}</p>
        <p>Transformed events count: {transformedEvents.length}</p>

        {events.length === 0 && (
          <div style={{ color: 'red' }}>
            <p>
              <strong>No events found!</strong>
            </p>
            <p>Possible issues:</p>
            <ul>
              <li>API endpoint is not returning events</li>
              <li>Date range parameters are incorrect</li>
              <li>Authentication issues</li>
            </ul>
          </div>
        )}

        {transformedEvents.length === 0 && events.length > 0 && (
          <div style={{ color: 'red' }}>
            <p>
              <strong>Events not transformed correctly!</strong>
            </p>
            <p>Events exist in raw data but weren't transformed for display</p>
          </div>
        )}
      </div>

      {showRaw && (
        <div>
          <h5>Raw Events:</h5>
          <pre
            style={{
              maxHeight: '200px',
              overflow: 'auto',
              backgroundColor: '#eee',
              padding: '5px',
              fontSize: '11px',
            }}
          >
            {JSON.stringify(events, null, 2)}
          </pre>

          <h5>Transformed Events:</h5>
          <pre
            style={{
              maxHeight: '200px',
              overflow: 'auto',
              backgroundColor: '#eee',
              padding: '5px',
              fontSize: '11px',
            }}
          >
            {JSON.stringify(transformedEvents, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
