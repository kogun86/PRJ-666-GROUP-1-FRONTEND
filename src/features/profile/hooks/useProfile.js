import { useState, useEffect } from 'react';
import { useAuth } from '../../auth';
import { Auth } from '../../auth/lib/amplifyClient';

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
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [hasEvents, setHasEvents] = useState(false);

  // Fetch profile data from the API
  useEffect(() => {
    fetchProfileData();
  }, []);

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
