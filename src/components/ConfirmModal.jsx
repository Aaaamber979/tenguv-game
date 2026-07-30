import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText = '确认', cancelText = '取消' }) => {
  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
