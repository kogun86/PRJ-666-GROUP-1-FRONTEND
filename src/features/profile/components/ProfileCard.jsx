import React from 'react';
import { Avatar, AvatarFallback } from './avatar';
import { Button } from './button';
import { SeedButton } from '../../seed';

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

export default function ProfileCard({ user, getInitials, onEditProfile, onChangePassword }) {
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
              className="profile-button profile-edit-button px-4 py-2 rounded-lg ml-3 mr-3"
              onClick={onEditProfile}
            >
              Edit Profile
            </Button>
            <Button className="profile-button px-4 py-2 rounded-lg" onClick={onChangePassword}>
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
