// AuthContext.jsx - Manages the global authentication state for the entire application
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

// Create Auth context to share user state throughout the app
const AuthContext = createContext(null);

// ============ AUTH PROVIDER COMPONENT ============
// Provides authentication state and functions to its children
export const AuthProvider = ({ children }) => {
  // User state - stores the logged-in user's data
  const [user, setUser] = useState(null);
  // Loading state - tracks if the user's session is being verified
  const [loading, setLoading] = useState(true);

  // ============ INITIAL AUTH CHECK ============
  // Check for existing session in localStorage when the app loads
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify token validity with the server and fetch full profile
          const res = await API.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } catch (error) {
          // Clear session data if token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  // ============ FETCH LATEST USER DATA ============
  const fetchMe = async () => {
    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  // ============ LOGIN FUNCTION ============
  // Authenticates a user and saves session data
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      // Persist token and user data in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  // ============ SIGNUP FUNCTION ============
  // Registers a new guest account
  const signup = async (name, email, password) => {
    const res = await API.post('/auth/signup', { name, email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  // ============ UPDATE PROFILE FUNCTION ============
  // Updates the personal details of the current user
  const updateProfile = async (profileData) => {
    const res = await API.put('/auth/update-profile', profileData);
    if (res.data.success) {
      // Refresh local user state with updated data
      setUser(prev => ({ ...prev, ...res.data.user }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data.user }));
    }
    return res.data;
  };

  // ============ LOGOUT FUNCTION ============
  // Terminates the user session and clears local data
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Pass authentication functions and state through context
  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    fetchMe,
    loading,
    isAdmin: user?.role === 'superadmin',
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============ CUSTOM HOOK ============
// Access the auth state from any functional component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
