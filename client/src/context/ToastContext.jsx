// Toast.jsx - Premium dynamic notifications
import { useState, useEffect, createContext, useContext } from 'react';
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts([...toasts, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  // ============ SOCKET.IO INITIALIZATION ============
  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && user) {
      // Join user-specific room
      socket.emit('join', user.id);

      // Listen for notifications
      socket.on('notification', (data) => {
        addToast(data.title || 'Notification', data.message, 'info');
      });

      // Listen for room updates (optional: can trigger data refresh)
      socket.on('roomUpdate', (data) => {
        addToast('Room Status Change', `Room status updated for room ID: ${data.roomId}`, 'info');
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
        socket.off('roomUpdate');
      }
    };
  }, [socket, user]);

  // ============ GLOBAL ERROR INTERCEPTOR ============
  useEffect(() => {
    const handleGlobalError = (event) => {
      addToast('Royal Service Notice', event.detail || 'A synchronization issue occurred.', 'error');
    };
    window.addEventListener('luxury-error', handleGlobalError);
    return () => window.removeEventListener('luxury-error', handleGlobalError);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type} animate-fade-in`}>
            <div className="toast-icon">
              {t.type === 'success' && <HiCheckCircle />}
              {t.type === 'error' && <HiExclamationCircle />}
              {t.type === 'info' && <HiInformationCircle />}
            </div>
            <div className="toast-content">
              <h4>{t.title}</h4>
              <p>{t.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
