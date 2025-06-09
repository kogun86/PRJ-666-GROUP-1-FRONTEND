import { useState } from 'react';
import { useAuth } from '../features/auth';

export function ChangePasswordForm({ onSuccess, onCancel }) {
  const { isProduction } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    // Form validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    // Password strength validation
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      if (isProduction) {
        console.log('Attempting to change password in production mode');

        try {
          // For AWS Amplify v6, use the updatePassword function
          const { updatePassword } = await import('aws-amplify/auth');
          console.log('Imported updatePassword function:', updatePassword);

          // Use updatePassword with the correct parameter format
          await updatePassword({
            oldPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          });

          console.log('Password changed successfully');
          setSuccess(true);

          setTimeout(() => {
            if (onSuccess && typeof onSuccess === 'function') {
              onSuccess();
            }
          }, 1500);
        } catch (amplifyError) {
          console.error('Error with Amplify updatePassword:', amplifyError);
          setError(amplifyError.message || 'Failed to change password. Please try again.');
        }
      } else {
        // In development, just simulate success
        console.log('Dev mode: Simulating password change success');
        setSuccess(true);

        setTimeout(() => {
          if (onSuccess && typeof onSuccess === 'function') {
            onSuccess();
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      if (error.name === 'NotAuthorizedException') {
        setError('Current password is incorrect');
      } else {
        setError(error.message || 'Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="modal-error">{error}</div>}
      {success && <div className="modal-success">Password changed successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div className="modal-form-group">
          <label htmlFor="currentPassword" className="modal-label">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="modal-input"
            disabled={isLoading}
          />
        </div>

        <div className="modal-form-group">
          <label htmlFor="newPassword" className="modal-label">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="modal-input"
            disabled={isLoading}
          />
        </div>

        <div className="modal-form-group">
          <label htmlFor="confirmPassword" className="modal-label">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="modal-input"
            disabled={isLoading}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onCancel}
            className="modal-button modal-cancel-button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" className="modal-button modal-submit-button" disabled={isLoading}>
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
