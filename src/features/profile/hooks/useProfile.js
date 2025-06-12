import { useState, useEffect } from 'react';
import { useAuth } from '../../auth';
import { Auth } from '../../auth/lib/amplifyClient';

export function useProfile() {
  const { user, isProduction } = useAuth();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dateOfBirth: user?.dateOfBirth || '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [hasEvents, setHasEvents] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper function to adjust date for timezone issues
  const adjustDateForTimezone = (dateString) => {
    if (!dateString) return '';

    // Parse the date string
    const date = new Date(dateString);

    // Add the timezone offset to get the correct date
    const timezoneOffset = date.getTimezoneOffset() * 60000; // convert to milliseconds
    const adjustedDate = new Date(date.getTime() + timezoneOffset);

    // Format as YYYY-MM-DD
    return adjustedDate.toISOString().split('T')[0];
  };

  // Fetch profile data from the API
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Set initial profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        dateOfBirth: adjustDateForTimezone(user.dateOfBirth) || '',
      });
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      console.log('🔗 API_BASE_URL:', API_BASE_URL);

      let headers;
      // In development mode, use mock headers
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
        console.log('🔐 Using development mock headers');
      } else {
        // Production mode - use real auth
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to view profile.');
        }
        headers = user.authorizationHeaders();
        console.log('🔐 Auth Headers:', headers);
      }

      // Fetch profile data
      const profileRes = await fetch(`${API_BASE_URL}/v1/profile`, {
        headers,
      });

      if (!profileRes.ok) {
        throw new Error(`HTTP error! status: ${profileRes.status}`);
      }

      const profileData = await profileRes.json();
      console.log('📥 Profile response:', profileData);

      if (profileData.success) {
        setUpcomingEvent(profileData.upcomingEvent);
        setCompletionPercentage(profileData.completionPercentage);
        setHasEvents(profileData.hasEvents);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error fetching profile data:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

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
      dateOfBirth: adjustDateForTimezone(user?.dateOfBirth) || '',
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setIsUpdating(true);

    try {
      // Form validation
      if (!profileData.name) {
        setError('Name is required');
        setIsUpdating(false);
        return;
      }

      if (isProduction) {
        console.log('Updating user attributes in Cognito...');

        try {
          // Split name into given_name and family_name if it contains a space
          const nameParts = profileData.name.split(' ');
          const given_name = nameParts[0] || '';
          const family_name = nameParts.slice(1).join(' ') || '';

          // Prepare attributes object for Cognito
          const userAttributes = {
            name: profileData.name,
            given_name,
            family_name,
            // Email changes require verification, so we don't update it
            birthdate: profileData.dateOfBirth,
          };

          console.log('Updating user attributes:', userAttributes);

          // Update user attributes in Cognito
          await Auth.updateUserAttributes(userAttributes);

          console.log('User attributes updated successfully in Cognito');

          // Update local user data
          if (user) {
            const updatedUser = {
              ...user,
              name: profileData.name,
              dateOfBirth: profileData.dateOfBirth,
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
          }

          // Close modal and show success
          handleCloseEditProfileModal();

          // Refresh the page to show updated data
          window.location.reload();
        } catch (cognitoError) {
          console.error('Error updating user attributes in Cognito:', cognitoError);
          setError(cognitoError.message || 'Failed to update profile. Please try again.');
        }
      } else {
        // In development mode, just update local storage
        console.log('Development mode: Updating local user data');

        // Make sure user exists before updating
        if (user) {
          // Update local user data
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...user,
              name: profileData.name,
              dateOfBirth: profileData.dateOfBirth,
            })
          );
        }

        // Close modal
        handleCloseEditProfileModal();

        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message || 'An error occurred while updating your profile');
    } finally {
      setIsUpdating(false);
    }
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

  // Format date for display
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${month} ${day} @ ${time}`;
  };

  return {
    user,
    passwordModalOpen,
    editProfileModalOpen,
    profileData,
    error,
    isLoading,
    isUpdating,
    upcomingEvent,
    completionPercentage,
    hasEvents,
    handleOpenPasswordModal,
    handleClosePasswordModal,
    handleOpenEditProfileModal,
    handleCloseEditProfileModal,
    handleProfileInputChange,
    handleProfileUpdate,
    getInitials,
    formatEventDate,
  };
}
