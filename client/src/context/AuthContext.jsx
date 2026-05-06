// AuthContext.jsx - yeh file authentication state manage karti hai poori app mein
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

// Auth context banao - yeh poori app mein user state share karta hai
const AuthContext = createContext(null);

// ============ AUTH PROVIDER COMPONENT ============
// yeh component apne children ko auth state provide karta hai
export const AuthProvider = ({ children }) => {
  // user state - logged in user ka data
  const [user, setUser] = useState(null);
  // loading state - jab tak user verify ho raha hai
  const [loading, setLoading] = useState(true);

  // ============ APP LOAD PE USER CHECK KARO ============
  // jab app load ho to localStorage se user data check karo
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // server se verify karo ke token valid hai
          const res = await API.get('/auth/me');
          setUser(res.data.user);
        } catch (error) {
          // agar token invalid hai to clear karo
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  // ============ LOGIN FUNCTION ============
  // yeh function user ko login karta hai
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      // token aur user data localStorage mein save karo
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  // ============ LOGOUT FUNCTION ============
  // yeh function user ko logout karta hai
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // context value mein saari auth functions aur state pass karo
  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============ CUSTOM HOOK ============
// yeh hook kisi bhi component mein auth state access karne ke liye
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth ko AuthProvider ke andar use karo');
  }
  return context;
};

export default AuthContext;
