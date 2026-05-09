// ConfirmModal.jsx - Ek premium glassmorphic confirmation popup
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal glass-card animate-fade-in" style={{ maxWidth: '400px' }}>
        <div className="p-24 text-center">
          <div className="modal-icon-wrapper" style={{ color: 'var(--error)', marginBottom: '16px' }}>
            <HiOutlineExclamationCircle size={54} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>{title}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{message}</p>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              {cancelText}
            </button>
            <button className="btn btn-danger" onClick={onConfirm} style={{ flex: 1, background: 'var(--error)', color: 'white' }}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
