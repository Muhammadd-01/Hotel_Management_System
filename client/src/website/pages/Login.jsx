import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight, 
  HiOutlineSparkles, HiOutlineEye, HiOutlineEyeOff 
} from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Load remembered email
  useState(() => {
    const savedEmail = localStorage.getItem('luxury_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    addToast('Reset Requested', 'An email with reset instructions has been sent to your registered address (Simulated).', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.success) {
        if (rememberMe) {
          localStorage.setItem('luxury_remember_email', email);
        } else {
          localStorage.removeItem('luxury_remember_email');
        }

        addToast('Welcome Back', `Welcome back, ${data.user.name}.`, 'success');
        
        // Role based redirection
        const staffRoles = ['superadmin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'staff'];
        if (staffRoles.includes(data.user.role)) {
          navigate('/dashboard');
        } else {
          navigate('/'); // Guests stay on website
        }
      }
    } catch (err) {
      addToast('Login Failed', err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ws-auth-page">
      <div className="ws-auth-container">
        {/* Left Side: Brand Experience */}
        <div className="ws-auth-visual">
          <div className="ws-auth-overlay"></div>
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80" alt="Luxury Interior" />
          <div className="ws-auth-visual-content">
            <div className="ws-logo">
              <span className="ws-logo-icon">🏨</span>
              <span className="ws-logo-text">LuxuryStay</span>
            </div>
            <h1>Step Into <br/> <span className="ws-accent">Excellence</span></h1>
            <p>Your journey to unrivaled luxury begins here. Access your personalized concierge and exclusive benefits.</p>
            <div className="ws-auth-badges">
              <div className="ws-badge">✨ Elite Membership</div>
              <div className="ws-badge">🛡️ Secure Session</div>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Form */}
        <div className="ws-auth-form-side">
          <div className="ws-auth-form-card glass-card">
            <div className="ws-auth-header">
              <h2>Member <span className="ws-accent">Login</span></h2>
              <p>Enter your credentials to continue your experience.</p>
            </div>

            <form onSubmit={handleSubmit} className="ws-form">
              <div className="ws-input-group">
                <label><HiOutlineMail /> Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@luxury.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="ws-input-group">
                <label><HiOutlineLockClosed /> Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ width: '100%', paddingRight: '45px' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--ws-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="ws-form-options">
                <label><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Remember Me</label>
                <a href="#" className="ws-forgot-pass" onClick={handleForgotPassword}>Forgot Password?</a>
              </div>

              <button type="submit" className="ws-btn ws-btn-primary ws-btn-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In Now'} <HiOutlineArrowRight />
              </button>
            </form>

            <div className="ws-auth-footer">
              <p>Not a member yet? <Link to="/register" className="ws-accent">Join the Elite</Link></p>
            </div>

            <div className="ws-auth-demo">
              <p><strong>Demo:</strong> admin@hotel.com | admin123</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .ws-auth-page {
          min-height: 100vh;
          background: #050810;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .ws-auth-container {
          width: 100%;
          max-width: 1100px;
          height: 700px;
          display: flex;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 50px 100px rgba(0,0,0,0.5);
          background: #0b0f1a;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .ws-auth-visual {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          padding: 60px;
          overflow: hidden;
        }
        .ws-auth-visual img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          transform: scale(1.1);
          animation: slowMove 20s linear infinite alternate;
        }
        .ws-auth-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(5,8,16,0.4), rgba(5,8,16,0.9));
          z-index: 1;
        }
        .ws-auth-visual-content {
          position: relative;
          z-index: 2;
        }
        .ws-auth-visual-content h1 {
          font-size: 3.5rem;
          line-height: 1.1;
          margin: 2rem 0;
          color: white;
        }
        .ws-auth-badges {
          display: flex;
          gap: 15px;
          margin-top: 2rem;
        }
        .ws-badge {
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 100px;
          font-size: 0.8rem;
          color: white;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .ws-auth-form-side {
          flex: 0.9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: #0b0f1a;
        }
        .ws-auth-form-card {
          width: 100%;
          max-width: 450px;
          padding: 40px !important;
          border-radius: 30px !important;
        }
        .ws-auth-header h2 { font-size: 2.2rem; margin-bottom: 10px; }
        .ws-auth-header p { color: var(--ws-text-muted); margin-bottom: 2.5rem; }
        .ws-input-group { margin-bottom: 1.5rem; }
        .ws-input-group label { display: flex; align-items: center; gap: 8px; color: var(--ws-text-muted); margin-bottom: 8px; font-size: 0.9rem; }
        .ws-input-group input { width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: white; outline: none; transition: 0.3s; }
        .ws-input-group input:focus { border-color: var(--ws-accent); background: rgba(255,255,255,0.06); }
        .ws-form-options { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; margin-bottom: 2rem; color: var(--ws-text-muted); }
        .ws-forgot-pass { color: var(--ws-accent); text-decoration: none; }
        .ws-auth-footer { margin-top: 2rem; text-align: center; color: var(--ws-text-muted); }
        .ws-auth-demo { margin-top: 2rem; font-size: 0.75rem; color: #444; text-align: center; }
        
        @media (max-width: 992px) {
          .ws-auth-visual { display: none; }
          .ws-auth-container { max-width: 500px; height: auto; }
        }
      `}</style>
    </div>
  );
};

export default Login;
