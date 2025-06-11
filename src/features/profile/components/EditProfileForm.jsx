import React from 'react';

export default function EditProfileForm({ error, profileData, onInputChange, onSubmit, onCancel }) {
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
          />
        </div>

        <div className="modal-form-group">
          <label htmlFor="email" className="modal-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={onInputChange}
            className="modal-input"
          />
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
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onCancel} className="modal-button modal-cancel-button">
            Cancel
          </button>
          <button type="submit" className="modal-button modal-submit-button">
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
}
