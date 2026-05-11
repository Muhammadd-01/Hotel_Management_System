// main.jsx - React entry point with Global Providers
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// ============ GLOBAL LUXURY ERROR HANDLING ============
// This prevents raw code errors from showing and instead uses our branded toast
const setupGlobalErrorHandler = () => {
  const showError = (message) => {
    window.dispatchEvent(new CustomEvent('luxury-error', { detail: message }));
  };

  window.onerror = (message, source, lineno, colno, error) => {
    console.error("Global Error:", message);
    showError("A temporary service issue occurred. Our staff is looking into it.");
    return true; // Prevents default browser error
  };

  window.onunhandledrejection = (event) => {
    console.error("Promise Rejection:", event.reason);
    showError(event.reason?.message || "Sync error. Please check your connection.");
  };
};

setupGlobalErrorHandler();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  </React.StrictMode>
);
