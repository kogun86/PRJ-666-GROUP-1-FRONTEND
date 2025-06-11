import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProfile } from '../hooks/useProfile';
import LoadingAnimation from '../../animations/LoadingAnimation';

const Card = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

const CardContent = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

export default function ProfileStats() {
  const { isLoading, upcomingEvent, completionPercentage, hasEvents, formatEventDate } =
    useProfile();

  // Add state for animated percentage
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(283); // Starting with full offset (empty circle)

  // Animation effect
  useEffect(() => {
    if (!isLoading && completionPercentage > 0) {
      // Reset to 0 when data loads
      setAnimatedPercentage(0);
      setAnimatedOffset(283);

      const duration = 3000; // 3 seconds
      const startTime = Date.now();
      const initialOffset = 283; // Full circle offset
      const targetOffset = 283 - (283 * completionPercentage) / 100;

      const animateProgress = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < duration) {
          // Calculate current percentage based on elapsed time
          const currentPercentage = Math.min(
            Math.floor((elapsed / duration) * completionPercentage),
            completionPercentage
          );

          // Calculate current circle offset
          const currentOffset =
            initialOffset - ((initialOffset - targetOffset) * elapsed) / duration;

          setAnimatedPercentage(currentPercentage);
          setAnimatedOffset(currentOffset);

          // Continue animation
          requestAnimationFrame(animateProgress);
        } else {
          // Ensure we end exactly at the target values
          setAnimatedPercentage(completionPercentage);
          setAnimatedOffset(targetOffset);
        }
      };

      // Start animation
      requestAnimationFrame(animateProgress);
    }
  }, [isLoading, completionPercentage]);

  return (
    <div className="profile-stats">
      {/* Study Sessions */}
      <Card className="profile-card">
        <CardContent className="profile-card-content">
          <div className="profile-card-header">Study Sessions</div>
          {isLoading ? (
            <div className="profile-session-content flex justify-center items-center py-4">
              <LoadingAnimation size="small" />
            </div>
          ) : upcomingEvent ? (
            <div className="profile-session-content">
              <div className="profile-session-time">{formatEventDate(upcomingEvent.start)}</div>
              <div className="profile-session-title">{upcomingEvent.title}</div>
              <div className="profile-session-details">
                {upcomingEvent.type === 'assignment' ? 'Assignment' : 'Event'} -{' '}
                {upcomingEvent.course?.code}
              </div>
            </div>
          ) : (
            <div className="profile-session-content">
              <div className="profile-session-title">No upcoming events</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Completed */}
      <Card className="profile-card">
        <CardContent className="profile-card-content">
          <div className="profile-card-header">Tasks Completed</div>
          {isLoading ? (
            <div className="profile-tasks-content flex justify-center items-center py-4">
              <LoadingAnimation size="small" />
            </div>
          ) : (
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
                    strokeDasharray="283"
                    strokeDashoffset={animatedOffset}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="profile-chart-percentage">{animatedPercentage}%</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goal Progress */}
      <Card className="profile-card">
        <CardContent className="profile-card-content">
          <div className="profile-card-header">Goal Progress</div>
          {isLoading ? (
            <div className="profile-goals-content flex justify-center items-center py-4">
              <LoadingAnimation size="small" />
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
