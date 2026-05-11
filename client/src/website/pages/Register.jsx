import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight,
  HiOutlineEye, HiOutlineEyeOff
} from 'react-icons/hi';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return addToast('Error', 'Passwords do not match', 'error');
    }
    setLoading(true);
    try {
      const data = await signup(form.name, form.email, form.password);
      if (data.success) {
        addToast('Welcome to LuxuryStay', 'Your elite membership has been created.', 'success');
        navigate('/');
      }
    } catch (err) {
      addToast('Registration Failed', err.response?.data?.message || 'Check your details', 'error');
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
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80" alt="Luxury Resort" />
          <div className="ws-auth-visual-content">
            <div className="ws-logo">
              <span className="ws-logo-icon">🏨</span>
              <span className="ws-logo-text">LuxuryStay</span>
            </div>
            <h1>Join the <br/> <span className="ws-accent">Elite Elite</span></h1>
            <p>Become a member of the world's most prestigious hospitality network. Unlock personalized stays and royal treatments.</p>
          </div>
        </div>

        {/* Right Side: Professional Form */}
        <div className="ws-auth-form-side">
          <div className="ws-auth-form-card glass-card">
            <div className="ws-auth-header">
              <h2>Create <span className="ws-accent">Account</span></h2>
              <p>Start your journey with LuxuryStay today.</p>
            </div>

            <form onSubmit={handleSubmit} className="ws-form">
              <div className="ws-input-group">
                <label><HiOutlineUser /> Full Name</label>
                <input name="name" type="text" placeholder="Elite Guest" value={form.name} onChange={handleChange} required />
              </div>
              <div className="ws-input-group">
                <label><HiOutlineMail /> Email Address</label>
                <input name="email" type="email" placeholder="guest@luxury.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="ws-input-group">
                <label><HiOutlineLockClosed /> Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={handleChange} 
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
              <div className="ws-input-group">
                <label><HiOutlineLockClosed /> Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    name="confirmPassword" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    value={form.confirmPassword} 
                    onChange={handleChange} 
                    required 
                    style={{ width: '100%', paddingRight: '45px' }}
                  />
                </div>
              </div>
              
              <button type="submit" className="ws-btn ws-btn-primary ws-btn-full" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Processing...' : 'Create Membership'} <HiOutlineArrowRight />
              </button>
            </form>

            <div className="ws-auth-footer">
              <p>Already a member? <Link to="/login" className="ws-accent">Login Instead</Link></p>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        /* Reuse styles from Login.jsx or put them in website.css */
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
          height: auto;
          min-height: 750px;
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
        .ws-input-group { margin-bottom: 1.2rem; }
        .ws-input-group label { display: flex; align-items: center; gap: 8px; color: var(--ws-text-muted); margin-bottom: 6px; font-size: 0.9rem; }
        .ws-input-group input { width: 100%; padding: 12px 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: white; outline: none; transition: 0.3s; }
        .ws-input-group input:focus { border-color: var(--ws-accent); background: rgba(255,255,255,0.06); }
        .ws-auth-footer { margin-top: 2rem; text-align: center; color: var(--ws-text-muted); font-size: 0.9rem; }
        
        @media (max-width: 992px) {
          .ws-auth-visual { display: none; }
          .ws-auth-container { max-width: 500px; }
        }
      `}</style>
    </div>
  );
};

export default Register;
