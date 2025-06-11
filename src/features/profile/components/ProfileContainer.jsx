import React from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileCard from './ProfileCard';
import ProfileStats from './ProfileStats';
import Modal from '../../../componentShared/Modal';
import { ChangePasswordForm } from './ChangePasswordForm';
import EditProfileForm from './EditProfileForm';
import { SeedButton } from '../../seed';
import LoadingAnimation from '../../animations/LoadingAnimation';

export default function ProfileContainer() {
  const {
    user,
    passwordModalOpen,
    editProfileModalOpen,
    profileData,
    error,
    isLoading,
    handleOpenPasswordModal,
    handleClosePasswordModal,
    handleOpenEditProfileModal,
    handleCloseEditProfileModal,
    handleProfileInputChange,
    handleProfileUpdate,
    getInitials,
  } = useProfile();

  // If user is not available and still loading, show a loading state
  if (!user && isLoading) {
    return (
      <div className="profile-loading flex justify-center items-center h-96">
        <LoadingAnimation size="medium" />
      </div>
    );
  }

  // If user is not available after loading, show an error
  if (!user && !isLoading) {
    return <div className="profile-error">Unable to load user data. Please try again later.</div>;
  }

  return (
    <div className="profile-container">
      {/* User Profile Card */}
      <ProfileCard
        user={user}
        getInitials={getInitials}
        onEditProfile={handleOpenEditProfileModal}
        onChangePassword={handleOpenPasswordModal}
        isLoading={isLoading}
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
