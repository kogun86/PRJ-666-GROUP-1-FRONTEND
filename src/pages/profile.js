import { useState } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import { useAuth } from '../features/auth';
import ProtectedRoute from '../components/ProtectedRoute';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import AIChatWindow from '../components/AIChatWindow';
import Modal from '../components/Modal';

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
    <div className="w-full h-full rounded-full relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100px, 200px"
        style={{ objectFit: 'cover' }}
        className="rounded-full"
      />
    </div>
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

function ProfileContent() {
  const { user, logout, isProduction } = useAuth();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth || '',
  });
  const [error, setError] = useState('');

  // If user is not available, show a loading state
  if (!user) {
    return <div className="profile-loading">Loading user data...</div>;
  }

  const handleOpenPasswordModal = () => {
    setPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  const handleOpenEditProfileModal = () => {
    setEditProfileModalOpen(true);
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      dateOfBirth: user.dateOfBirth || '',
    });
    setError('');
  };

  const handleCloseEditProfileModal = () => {
    setEditProfileModalOpen(false);
    setError('');
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    // Form validation
    if (!profileData.name || !profileData.email) {
      setError('Name and email are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Here you would typically call an API to update the profile
    // For this example, we'll just update the local state
    setTimeout(() => {
      // Make sure user exists before updating
      if (user) {
        // Update local user data
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            name: profileData.name,
            email: profileData.email,
            dateOfBirth: profileData.dateOfBirth,
          })
        );
      }

      // In a real application, you would update the context state
      // but for this demo we'll just reload the page
      window.location.reload();

      handleCloseEditProfileModal();
    }, 500);
  };

  // Get initials for the avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-container">
      {/* User Profile Card */}
      <div className="profile-card profile-user-card">
        <div className="profile-header">
          <h1 className="profile-title">User Profile</h1>
        </div>

        <div className="profile-content">
          {/* User Icon */}
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-circle">
              <Avatar className="profile-avatar">
                <AvatarFallback className="profile-avatar-text">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* User Information */}
          <div className="profile-info">
            <div className="profile-info-row">
              <span className="profile-info-text">Name: {user?.name || 'Not set'}</span>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-text">Email: {user?.email || 'Not set'}</span>
              <CheckCircle2 />
            </div>

            {user?.dateOfBirth && (
              <div className="profile-info-row">
                <span className="profile-info-text">
                  Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="profile-info-row">
              <span className="profile-info-text">
                Last Login Date:{' '}
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Unknown'}
              </span>
            </div>

            <div className="profile-action-row">
              <Button
                className="profile-button profile-edit-button px-4 py-2 rounded-lg mr-3"
                onClick={handleOpenEditProfileModal}
              >
                Edit Profile
              </Button>
              <Button
                className="profile-button px-4 py-2 rounded-lg"
                onClick={handleOpenPasswordModal}
              >
                Change Password
              </Button>
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

      {/* AI Chat Window */}
      <AIChatWindow />

      {/* Password Change Modal - Use new component */}
      <Modal isOpen={passwordModalOpen} onClose={handleClosePasswordModal} title="Change Password">
        <ChangePasswordForm
          onSuccess={handleClosePasswordModal}
          onCancel={handleClosePasswordModal}
        />
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editProfileModalOpen}
        onClose={handleCloseEditProfileModal}
        title="Edit Profile"
      >
        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleProfileUpdate}>
          <div className="modal-form-group">
            <label htmlFor="name" className="modal-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleProfileInputChange}
              className="modal-input"
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="email" className="modal-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileInputChange}
              className="modal-input"
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="dateOfBirth" className="modal-label">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={profileData.dateOfBirth}
              onChange={handleProfileInputChange}
              className="modal-input"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleCloseEditProfileModal}
              className="modal-button modal-cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="modal-button modal-submit-button">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="profile-page">
          <ProfileContent />
        </div>
        <style jsx>{`
          .profile-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
        `}</style>
      </Layout>
    </ProtectedRoute>
  );
}
