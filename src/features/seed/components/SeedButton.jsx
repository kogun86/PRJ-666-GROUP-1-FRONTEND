import React, { useState } from 'react';
import { useSeed } from '../hooks/useSeed';

export default function SeedButton() {
  const { seedData, loading, error, success, progress } = useSeed();
  const [showResult, setShowResult] = useState(false);

  const handleSeedClick = async () => {
    if (loading) return;

    setShowResult(true);
    await seedData();

    // Hide result after 5 seconds if successful
    if (success) {
      setTimeout(() => {
        setShowResult(false);
      }, 5000);
    }
  };

  return (
    <div className="seed-button-container">
      <button
        onClick={handleSeedClick}
        disabled={loading}
        className="profile-button px-4 py-2 rounded-lg"
        style={{ backgroundColor: '#27AE60', color: 'white' }}
      >
        {loading ? 'Seeding...' : 'Seed Demo Data'}
      </button>

      {loading && (
        <div className="seed-progress mt-2">
          <div>
            Creating test data ({progress.completed}/{progress.total})...
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.round((progress.completed / progress.total) * 100)}%`,
                backgroundColor: '#27AE60',
                height: '4px',
                transition: 'width 0.3s ease-in-out',
              }}
            />
          </div>
        </div>
      )}

      {showResult && !loading && (
        <div className="seed-result mt-2" style={{ color: error ? '#C0392B' : '#27AE60' }}>
          {error ? `Error: ${error}` : 'Demo data created successfully!'}
        </div>
      )}
    </div>
  );
}
