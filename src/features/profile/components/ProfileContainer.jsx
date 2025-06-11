import React from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileCard from './ProfileCard';
import ProfileStats from './ProfileStats';
import Modal from '../../../componentShared/Modal';
import { ChangePasswordForm } from './ChangePasswordForm';
import EditProfileForm from './EditProfileForm';
import { SeedButton } from '../../seed';

export default function ProfileContainer() {
  const {
    user,
    passwordModalOpen,
    editProfileModalOpen,
    profileData,
    error,
    handleOpenPasswordModal,
    handleClosePasswordModal,
    handleOpenEditProfileModal,
    handleCloseEditProfileModal,
    handleProfileInputChange,
    handleProfileUpdate,
    getInitials,
  } = useProfile();

  // If user is not available, show a loading state
  if (!user) {
    return <div className="profile-loading">Loading user data...</div>;
  }

  return (
    <div className="profile-container">
      {/* User Profile Card */}
      <ProfileCard
        user={user}
        getInitials={getInitials}
        onEditProfile={handleOpenEditProfileModal}
        onChangePassword={handleOpenPasswordModal}
      />

      {/* Stats Section */}
      <ProfileStats />

      {/* Password Change Modal */}
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
        <EditProfileForm
          error={error}
          profileData={profileData}
          onInputChange={handleProfileInputChange}
          onSubmit={handleProfileUpdate}
          onCancel={handleCloseEditProfileModal}
        />
      </Modal>
    </div>
  );
}
