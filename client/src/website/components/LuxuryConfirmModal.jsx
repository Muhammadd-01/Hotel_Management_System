import { HiOutlineExclamationCircle } from 'react-icons/hi';

const LuxuryConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="ws-modal-overlay">
      <div className="ws-modal glass-card reveal visible">
        <div className="ws-modal-content">
          <div className="ws-modal-icon">
            <HiOutlineExclamationCircle size={60} />
          </div>
          <h3>{title}</h3>
          <p>{message}</p>
          
          <div className="ws-modal-actions">
            <button className="ws-btn ws-btn-ghost" onClick={onClose}>
              {cancelText}
            </button>
            <button className="ws-btn ws-btn-primary" onClick={onConfirm} style={{ background: '#ef4444' }}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .ws-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 8, 16, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20000;
          padding: 20px;
        }
        .ws-modal {
          width: 100%;
          max-width: 450px;
          padding: 3rem !important;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 50px 100px rgba(0,0,0,0.5);
        }
        .ws-modal-icon {
          color: #ef4444;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }
        .ws-modal h3 {
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
        }
        .ws-modal p {
          color: var(--ws-text-muted);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .ws-modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .ws-modal-actions .ws-btn {
          flex: 1;
          justify-content: center;
          padding: 12px 24px;
        }

        .light-theme .ws-modal {
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
        }
        .light-theme .ws-modal h3 { color: #0f172a; }
      `}</style>
    </div>
  );
};

export default LuxuryConfirmModal;
