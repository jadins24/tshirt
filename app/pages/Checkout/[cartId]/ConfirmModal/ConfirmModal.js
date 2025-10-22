import React from 'react';
import "./ConfirmModal.scss";


const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-modal-actions">
          <button className="cancel" onClick={onCancel}>Cancel</button>
          <button className="confirm" onClick={onConfirm}>Pay</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

