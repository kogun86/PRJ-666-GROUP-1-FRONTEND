import { useState, useCallback } from 'react';

/**
 * Hook for handling confirmation modals
 * @returns {Object} - Confirmation modal state and handlers
 */
export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonClass: 'modal-danger-button',
  });

  const openConfirmation = useCallback(
    ({ title, message, onConfirm, confirmText, cancelText, confirmButtonClass }) => {
      setConfirmationData({
        title: title || 'Confirm Action',
        message: message || 'Are you sure you want to proceed?',
        onConfirm: onConfirm || (() => {}),
        confirmText: confirmText || 'Confirm',
        cancelText: cancelText || 'Cancel',
        confirmButtonClass: confirmButtonClass || 'modal-danger-button',
      });
      setIsOpen(true);
    },
    []
  );

  const closeConfirmation = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isConfirmationOpen: isOpen,
    confirmationData,
    openConfirmation,
    closeConfirmation,
  };
}
