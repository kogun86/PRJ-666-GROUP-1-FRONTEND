import React, { useRef, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { SeedButton } from '../../seed';
import LoadingAnimation from '../../animations/LoadingAnimation';
import { useAuth } from '../../auth';

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

    console.log('Starting avatar upload process for file:', file.name);

    try {
      // Step 1: Get signature from backend
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
          console.error('Error getting current user:', error);
          alert('Authentication error. Please log in again.');
          return;
        }
      } else {
        // In development, use mock token
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
      console.log('Signature response:', signatureData);

      const { signature, timestamp, apiKey, folder, cloudName } = signatureData;

      // Step 2: Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', apiKey);
      formData.append('folder', folder);
      // Add upload preset for face detection and cropping
      formData.append('transformation', 'c_thumb,g_face,h_256,w_256');

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadRes.json();
      console.log('Cloudinary upload response:', uploadData);

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

      // Log the response for debugging
      const saveData = await saveRes.json();
      console.log('Save avatar response:', saveData);

      // Update avatar URL immediately
      setAvatarUrl(uploadData.secure_url);

      // Show success message
      alert('Avatar uploaded successfully!');

      // Optionally refetch the avatar URL from the server to ensure consistency
      // This is not strictly necessary since we already have the URL, but it ensures
      // we're displaying what's actually stored in the database
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
        console.error('Error refetching avatar URL:', error);
        // Continue with the locally set URL even if refetch fails
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    }
  };

  return (
    <div className="profile-card profile-user-card">
      <div className="profile-header">
        <h1 className="profile-title">User Profile</h1>
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
    </div>
  );
}
