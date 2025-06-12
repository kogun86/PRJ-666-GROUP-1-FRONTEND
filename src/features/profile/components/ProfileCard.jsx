import React, { useRef, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { SeedButton } from '../../seed';
import LoadingAnimation from '../../animations/LoadingAnimation';
import { useAuth } from '../../auth';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';

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

// Helper function to format date with timezone adjustment
const formatDisplayDate = (dateString) => {
  if (!dateString) return 'Not set';

  // Parse the date string
  const date = new Date(dateString);

  // Add the timezone offset to get the correct date
  const timezoneOffset = date.getTimezoneOffset() * 60000; // convert to milliseconds
  const adjustedDate = new Date(date.getTime() + timezoneOffset);

  // Format for display
  return adjustedDate.toLocaleDateString();
};

export default function ProfileCard({
  user,
  getInitials,
  onEditProfile,
  onChangePassword,
  isLoading,
}) {
  const fileInputRef = useRef(null);
  const { isProduction, Auth } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const { isConfirmationOpen, confirmationData, openConfirmation, closeConfirmation } =
    useConfirmation();

  // Fetch avatar URL from dedicated endpoint
  useEffect(() => {
    const fetchAvatarUrl = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

        // Get authorization headers
        let headers = { 'Content-Type': 'application/json' };

        if (isProduction) {
          try {
            // In production, get the current user for auth headers
            const currentUser = await Auth.getCurrentUser();
            if (currentUser && currentUser.authorizationHeaders) {
              headers = currentUser.authorizationHeaders();
            }
          } catch (error) {
            console.error('Error getting current user for avatar fetch:', error);
            return;
          }
        } else {
          // In development, use mock token
          headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-id-token',
          };
        }

        const response = await fetch(`${API_BASE_URL}/v1/profile/avatar`, {
          method: 'GET',
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.avatarURL) {
            setAvatarUrl(data.avatarURL);
          }
        }
      } catch (error) {
        console.error('Error fetching avatar URL:', error);
      }
    };

    fetchAvatarUrl();
  }, [isProduction, Auth]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      // Step 1: Get signature from backend
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      let headers = { 'Content-Type': 'application/json' };
      if (isProduction) {
        try {
          const currentUser = await Auth.getCurrentUser();
          if (currentUser && currentUser.authorizationHeaders) {
            headers = currentUser.authorizationHeaders();
          }
        } catch (error) {
          setIsUploading(false);
          openConfirmation({
            title: 'Authentication Error',
            message: 'Authentication error. Please log in again.',
            confirmText: 'OK',
            cancelText: '',
            onConfirm: () => {},
            confirmButtonClass: 'modal-danger-button',
          });
          return;
        }
      } else {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
      }

      const signatureRes = await fetch(`${API_BASE_URL}/v1/profile/avatar/signature`, {
        method: 'POST',
        headers,
      });
      if (!signatureRes.ok) {
        throw new Error('Failed to get upload signature');
      }
      const signatureData = await signatureRes.json();
      const { signature, timestamp, apiKey, folder, cloudName } = signatureData;

      // Step 2: Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', apiKey);
      formData.append('folder', folder);
      formData.append('transformation', 'c_thumb,g_face,h_256,w_256');

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }
      const uploadData = await uploadRes.json();

      // Step 3: Save avatar URL to user profile
      const saveRes = await fetch(`${API_BASE_URL}/v1/profile/avatar`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          avatarURL: uploadData.secure_url,
          assetId: uploadData.public_id,
          width: uploadData.width,
          height: uploadData.height,
        }),
      });
      if (!saveRes.ok) {
        throw new Error('Failed to save avatar');
      }
      const saveData = await saveRes.json();
      setAvatarUrl(uploadData.secure_url);
      setIsUploading(false);
      openConfirmation({
        title: 'Success',
        message: 'Avatar uploaded successfully!',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {},
        confirmButtonClass: 'modal-success-button',
      });
      // Optionally refetch the avatar URL from the server
      try {
        const avatarResponse = await fetch(`${API_BASE_URL}/v1/profile/avatar`, {
          method: 'GET',
          headers,
        });
        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json();
          if (avatarData.avatarURL) {
            setAvatarUrl(avatarData.avatarURL);
          }
        }
      } catch (error) {
        // Ignore refetch error
      }
    } catch (error) {
      setIsUploading(false);
      openConfirmation({
        title: 'Upload Failed',
        message: error.message || 'Failed to upload avatar. Please try again.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {},
        confirmButtonClass: 'modal-danger-button',
      });
    }
  };

  return (
    <div className="profile-card profile-user-card">
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <SeedButton />
      </div>

      <div className="profile-content">
        {/* User Icon */}
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar-circle">
            <Avatar className="profile-avatar">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={user?.name || 'User'} />
              ) : (
                <AvatarFallback className="profile-avatar-text">
                  {getInitials(user?.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <button
              onClick={handleUploadClick}
              className="profile-avatar-upload-button"
              title="Upload avatar"
              aria-label="Upload avatar"
            >
              📷
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* User Information */}
        <div className="profile-info">
          {isLoading ? (
            <div className="w-full flex justify-center items-center py-4">
              <LoadingAnimation size="small" />
            </div>
          ) : (
            <>
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
                    Date of Birth: {formatDisplayDate(user.dateOfBirth)}
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
                  className="profile-button profile-edit-button px-4 py-2 rounded-lg ml-3 mr-3"
                  onClick={onEditProfile}
                  disabled={isLoading}
                >
                  Edit Profile
                </Button>
                <Button
                  className="profile-button px-4 py-2 rounded-lg"
                  onClick={onChangePassword}
                  disabled={isLoading}
                >
                  Change Password
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {isUploading && (
        <div
          className="avatar-upload-loading-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(255,255,255,0.7)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LoadingAnimation size="large" />
        </div>
      )}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        title={confirmationData.title}
        message={confirmationData.message}
        confirmText={confirmationData.confirmText}
        cancelText={confirmationData.cancelText}
        onConfirm={confirmationData.onConfirm}
        confirmButtonClass={confirmationData.confirmButtonClass}
      />
    </div>
  );
}
