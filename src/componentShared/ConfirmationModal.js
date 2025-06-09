import React from 'react';
import Modal from './Modal';

/**
 * A confirmation modal that uses the shared Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Text for the confirm button
 * @param {string} props.cancelText - Text for the cancel button
 * @param {Function} props.onConfirm - Function to call when the confirm button is clicked
 * @param {string} props.confirmButtonClass - Additional CSS class for the confirm button
 * @returns {JSX.Element} - Confirmation modal component
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  confirmButtonClass = 'modal-danger-button',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirmation-modal">
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-buttons">
          <button className="modal-button modal-cancel-button" onClick={onClose}>
            {cancelText}
          </button>
          <button className={`modal-button ${confirmButtonClass}`} onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <style jsx>{`
        .confirmation-modal {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .confirmation-message {
          font-size: 1rem;
          color: #2f3e46;
          text-align: center;
        }

        .confirmation-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .modal-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.25rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .modal-cancel-button {
          background-color: #84a98c;
          color: white;
        }

        .modal-cancel-button:hover {
          background-color: #52796f;
        }

        .modal-danger-button {
          background-color: #e63946;
          color: white;
        }

        .modal-danger-button:hover {
          background-color: #c1121f;
        }
      `}</style>
    </Modal>
  );
};

export default ConfirmationModal;
