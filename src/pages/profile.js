import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

// UI Components - simplified versions of shadcn/ui components
const Avatar = ({ className, children }) => {
  return <div className={`relative flex items-center justify-center ${className}`}>{children}</div>;
};

const AvatarFallback = ({ className, children }) => {
  return (
    <div className={`flex items-center justify-center w-full h-full rounded-full ${className}`}>
      {children}
    </div>
  );
};

const AvatarImage = ({ src, alt = 'Avatar' }) => {
  return src ? (
    <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
  ) : null;
};

const Button = ({ className, children, onClick }) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

const Card = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

const CardContent = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

const CheckCircle2 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 ml-2"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
};

const Skeleton = ({ className }) => {
  return <div className={className}></div>;
};

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        lastLogin: 'February 10 2025',
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <Layout>
      <div className="profile-container">
        {/* User Profile Card */}
        <div className="profile-card">
          <h1 className="profile-title">User Profile</h1>

          <div className="profile-content">
            {/* User Icon */}
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-circle">
                <Avatar className="profile-avatar">
                  <AvatarFallback className="profile-avatar-text">JD</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* User Information */}
            <div className="profile-info">
              <div className="profile-info-row">
                <span className="profile-info-text">Name: {user.name}</span>
              </div>

              <div className="profile-info-row">
                <span className="profile-info-text">Email: {user.email}</span>
                <CheckCircle2 />
              </div>

              <div className="profile-info-row">
                <span className="profile-info-text">Last Login Date: {user.lastLogin}</span>
              </div>

              <div className="profile-action-row">
                <Button className="profile-button">Change Password</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
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
                <img
                  src="/placeholder-image.png"
                  alt="Goal Progress"
                  className="profile-goals-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    document.getElementById('fallback-text')?.classList.remove('hidden');
                  }}
                />
                <div id="fallback-text" className="profile-goals-fallback hidden">
                  <p className="profile-goals-fallback-text">The image you are</p>
                  <p className="profile-goals-fallback-text">requesting does not exist</p>
                  <p className="profile-goals-fallback-text">or is no longer available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function ProfileSkeleton() {
  return (
    <Layout>
      <div className="profile-container">
        {/* Main Content Skeleton */}
        <Skeleton className="profile-skeleton profile-skeleton-main" />

        <div className="profile-stats">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="profile-skeleton profile-skeleton-card" />
          ))}
        </div>
      </div>
    </Layout>
  );
}
