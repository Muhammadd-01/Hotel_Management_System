// api.js - Creates Axios instance for backend communication
import axios from 'axios';

// Create Axios instance for backend API
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============ REQUEST INTERCEPTOR ============
// Automatically add JWT token to every request
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============ RESPONSE INTERCEPTOR ============
// Global response interceptor for session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized access (expired or invalid token)
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
