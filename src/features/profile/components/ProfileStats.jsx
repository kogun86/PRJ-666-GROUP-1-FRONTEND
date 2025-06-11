import React from 'react';
import Image from 'next/image';

const Card = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

const CardContent = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

export default function ProfileStats() {
  return (
    <div className="profile-stats">
      {/* Study Sessions */}
      <Card className="profile-card">
        <CardContent className="profile-card-content">
          <div className="profile-card-header">Study Sessions</div>
          <div className="profile-session-content">
            <div className="profile-session-time">Feb 11 @ 3PM</div>
            <div className="profile-session-title">Test Study</div>
            <div className="profile-session-details">90 mins PRJ566</div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Completed */}
      <Card className="profile-card">
        <CardContent className="profile-card-content">
          <div className="profile-card-header">Tasks Completed</div>
          <div className="profile-tasks-content">
            <div className="profile-circle-chart">
              <svg className="profile-chart-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2F3E46" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#52796F"
                  strokeWidth="10"
                  strokeDasharray="141.5 141.5"
                  strokeDashoffset="70.75"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="profile-chart-percentage">50%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress */}
      <Card className="profile-card">
        <CardContent className="profile-card-content">
          <div className="profile-card-header">Goal Progress</div>
          <div className="profile-goals-content">
            <div
              className="profile-goals-image-container"
              style={{ position: 'relative', width: '100%', height: '200px' }}
            >
              <Image
                src="/placeholder-image.png"
                alt="Goal Progress"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  document.getElementById('fallback-text')?.classList.remove('hidden');
                }}
              />
            </div>
            <div id="fallback-text" className="profile-goals-fallback hidden">
              <p className="profile-goals-fallback-text">The image you are</p>
              <p className="profile-goals-fallback-text">requesting does not exist</p>
              <p className="profile-goals-fallback-text">or is no longer available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
