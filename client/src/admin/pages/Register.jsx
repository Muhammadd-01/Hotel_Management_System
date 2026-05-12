// Register.jsx - Guest enrollment interface for the LuxuryStay platform
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
  const [name, setName] = useState(''); // Full name input state
  const [email, setEmail] = useState(''); // Email address input state
  const [password, setPassword] = useState(''); // Password input state
  const [error, setError] = useState(''); // Registration error handling
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth(); // Access signup utility from Global Auth Context
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ============ REGISTRATION SUBMISSION LOGIC ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Execute guest registration and establish session
      const data = await signup(name, email, password);
      if (data.success) {
        addToast('Account Created', 'Welcome to LuxuryStay! Your guest account has been successfully initialized.', 'success');
        navigate('/dashboard'); // Direct user to the guest portal
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed. This email address might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Brand Narrative Section */}
        <div className="login-brand">
          <div className="brand-content">
            <span className="brand-icon">🏨</span>
            <h1>Join LuxuryStay</h1>
            <p>Establish your guest profile to manage reservations and unlock premium concierge services.</p>
            <div className="brand-features">
              <div className="feature-item">✓ Expedited Online Check-in</div>
              <div className="feature-item">✓ Personalized Guest Preferences</div>
              <div className="feature-item">✓ 24/7 AI-Powered Concierge Access</div>
            </div>
          </div>
        </div>

        {/* Enrollment Form Section */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <h2>Guest Enrollment</h2>
            <p className="login-subtitle">Enter your details to create a secure personal account.</p>
            
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Full Legal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Johnathan Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="guest@luxurystay.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Security Password</label>
                <input 
                  type="password" 
                  placeholder="Minimum 6 characters" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength="6"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Processing Enrollment...' : 'Create My Guest Account'}
              </button>
            </form>

            <div className="login-footer">
              <p>Already a member? <Link to="/login">Sign in here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
