import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-content">{children}</div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(47, 62, 70, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-container {
          background-color: #cad2c5;
          border-radius: 0.5rem;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2f3e46;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .modal-content {
          background-color: #cad2c5;
        }
      `}</style>
    </div>
  );
};

export default Modal;
