import React from 'react';

export default function EditProfileForm({
  error,
  profileData,
  onInputChange,
  onSubmit,
  onCancel,
  isUpdating,
}) {
  return (
    <>
      {error && <div className="modal-error">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="modal-form-group">
          <label htmlFor="name" className="modal-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={onInputChange}
            className="modal-input"
            disabled={isUpdating}
          />
        </div>

        <div className="modal-form-group">
          <label htmlFor="email" className="modal-label">
            Email (cannot be modified)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            className="modal-input modal-input-disabled"
            disabled={true}
            readOnly
          />
          <small className="modal-field-note">
            Email changes require verification and are not supported at this time.
          </small>
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
            onChange={onInputChange}
            className="modal-input"
            disabled={isUpdating}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onCancel}
            className="modal-button modal-cancel-button"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button type="submit" className="modal-button modal-submit-button" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </>
  );
}
