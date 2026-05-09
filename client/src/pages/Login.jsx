// Login.jsx - Yeh app ka entry point hai jahan staff login karta hai
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState(''); // Email input state
  const [password, setPassword] = useState(''); // Password input state
  const [error, setError] = useState(''); // Error handling
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // Auth context se login function lana
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ============ LOGIN SUBMIT KARNE KA LOGIC ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Auth context wala login function use karein jo API call handle karta hai
      const data = await login(email, password);
      
      if (data.success) {
        // Dashboard par bhej dena
        addToast('Login Successful', `Welcome back, ${data.user.name}!`, 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login nahi ho saka. Email ya password check karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Brand Branding */}
        <div className="login-brand">
          <div className="brand-content">
            <span className="brand-icon">🏨</span>
            <h1>LuxuryStay HMS</h1>
            <p>The Ultimate AI-Powered Solution for Luxury Hospitality Management.</p>
            <div className="brand-features">
              <div className="feature-item">✓ AI-Powered Room Search</div>
              <div className="feature-item">✓ Automated Billing & Tax</div>
              <div className="feature-item">✓ Staff & Task Management</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Apne credentials ke saath login karein.</p>
            
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="admin@hotel.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Sign In to Dashboard'}
              </button>
            </form>

            <div className="login-footer">
              <p>New Guest? <Link to="/register">Create an account</Link></p>
            </div>

            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials (testing ke liye):</p>
              <p><strong>Admin:</strong> admin@hotel.com / admin123</p>
              <p><strong>Staff:</strong> staff@hotel.com / staff123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
