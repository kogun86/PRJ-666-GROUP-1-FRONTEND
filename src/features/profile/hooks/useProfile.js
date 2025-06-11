import { useState } from 'react';
import { useAuth } from '../../auth';

export function useProfile() {
  const { user } = useAuth();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth || '',
  });
  const [error, setError] = useState('');

  const handleOpenPasswordModal = () => {
    setPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
  };

  const handleOpenEditProfileModal = () => {
    setEditProfileModalOpen(true);
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      dateOfBirth: user?.dateOfBirth || '',
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

  return {
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
  };
}
