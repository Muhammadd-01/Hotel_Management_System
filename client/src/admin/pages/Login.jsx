// Login.jsx - Primary authentication entry point for management personnel and guests
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState(''); // Email input state
  const [password, setPassword] = useState(''); // Password input state
  const [error, setError] = useState(''); // Local error handling
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // Access login utility from Global Auth Context
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ============ AUTHENTICATION SUBMISSION LOGIC ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Execute authentication via context provider which handles session storage
      const data = await login(email, password);
      
      if (data.success) {
        addToast('Authentication Successful', `Welcome back to LuxuryStay, ${data.user.name}!`, 'success');
        navigate('/dashboard'); // Direct user to their role-specific dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Brand Identity Section */}
        <div className="login-brand">
          <div className="brand-content">
            <span className="brand-icon">🏨</span>
            <h1>LuxuryStay HMS</h1>
            <p>The Ultimate AI-Powered Ecosystem for Premium Hospitality Management.</p>
            <div className="brand-features">
              <div className="feature-item">✓ AI-Driven Guest Insights</div>
              <div className="feature-item">✓ Real-time Inventory Analytics</div>
              <div className="feature-item">✓ Automated Billing & Revenue Management</div>
            </div>
          </div>
        </div>

        {/* Credential Entry Section */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <h2>Portal Access</h2>
            <p className="login-subtitle">Enter your authorized credentials to continue.</p>
            
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Institutional Email</label>
                <input type="email" placeholder="personnel@luxurystay.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Security Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Verifying Identity...' : 'Authorize & Sign In'}
              </button>
            </form>

            <div className="login-footer">
              <p>Planning a stay? <Link to="/register">Register as a Guest</Link></p>
            </div>

            <div className="demo-credentials">
              <p className="demo-title">System Administrator Access:</p>
              <p><strong>SuperAdmin:</strong> admin@hotel.com / admin123</p>
              <p><strong>Operational Staff:</strong> staff@hotel.com / staff123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
