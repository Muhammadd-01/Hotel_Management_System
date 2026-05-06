// api.js - yeh file Axios instance banati hai jo backend se communicate karta hai
import axios from 'axios';

// Axios instance banao backend API ke liye
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============ REQUEST INTERCEPTOR ============
// har request mein JWT token automatically add karo
API.interceptors.request.use(
  (config) => {
    // localStorage se token nikalo
    const token = localStorage.getItem('token');
    // agar token hai to Authorization header mein daalo
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
// agar 401 error aaye (unauthorized) to logout karo
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // token expire ho gaya ya invalid hai - logout karo
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // agar login page pe nahi hain to redirect karo
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
