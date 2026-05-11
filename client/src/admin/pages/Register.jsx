// Register.jsx - Naye guests ke liye registration page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await signup(name, email, password);
      if (data.success) {
        addToast('Account Created', 'Aapka guest account ban gaya hai. Welcome!', 'success');
        navigate('/dashboard'); // Guest dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration nahi ho saki. Email check karein.');
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
            <h1>Join LuxuryStay</h1>
            <p>Create an account to manage your bookings and enjoy premium services.</p>
            <div className="brand-features">
              <div className="feature-item">✓ Fast Online Reservations</div>
              <div className="feature-item">✓ Manage Guest Preferences</div>
              <div className="feature-item">✓ Access to AI Assistant</div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <h2>Guest Registration</h2>
            <p className="login-subtitle">Apni details enter karein account banane ke liye.</p>
            
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="guest@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength="6"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up as Guest'}
              </button>
            </form>

            <div className="login-footer">
              <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
