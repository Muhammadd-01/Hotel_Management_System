import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineUserCircle, HiOutlineMenu, HiOutlineX, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import LuxuryConfirmModal from './LuxuryConfirmModal';

const WebsiteLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ====== SCROLL ANIMATION LOGIC ======
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    // Cleanup
    return () => reveals.forEach(el => observer.unobserve(el));
  }, [pathname]); // Re-run on page change

  // ====== NAVBAR SCROLL EFFECT ======
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Signed Out', 'Your session has been securely closed. We look forward to your return.', 'info');
    navigate('/');
    setShowLogoutModal(false);
  };

  return (
    <div className="ws">
      {/* ====== NAVIGATION BAR ====== */}
      <nav className={`ws-nav ${isScrolled ? 'ws-nav-scrolled' : ''}`}>
        <div className="ws-nav-inner">
          <Link to="/" className="ws-logo">
            <span className="ws-logo-icon">🏨</span>
            <span className="ws-logo-text">LuxuryStay</span>
          </Link>

          <div className={`ws-nav-links ${isMenuOpen ? 'ws-nav-open' : ''}`}>
            {[
              { path: '/', label: 'Home' },
              { path: '/rooms-explore', label: 'Suites' },
              { path: '/amenities', label: 'Amenities' },
              { path: '/gallery', label: 'Gallery' },
              { path: '/guest-feedback', label: 'Reviews' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' }
            ].map(link => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                end={link.path === '/'} 
                className={({isActive}) => isActive ? 'ws-link ws-link-active' : 'ws-link'} 
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile Actions */}
            <div className="ws-nav-actions-mobile">
              {user ? (
                <Link to="/dashboard" className="ws-btn ws-btn-primary" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              ) : (
                <Link to="/login" className="ws-btn ws-btn-primary" onClick={() => setIsMenuOpen(false)}>Login / Join</Link>
              )}
            </div>
          </div>

          <div className="ws-nav-actions">
            <button onClick={toggleTheme} className="ws-theme-toggle" style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {theme === 'light' ? <HiOutlineMoon size={22} /> : <HiOutlineSun size={22} />}
            </button>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                {user.role === 'admin' && (
                  <Link to="/dashboard" className="ws-link" style={{ fontSize: '0.85rem' }}>Admin Panel</Link>
                )}
                <Link to="/profile" className="ws-profile-trigger" title="Your Royal Profile" style={{ color: 'var(--ws-text)', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <HiOutlineUserCircle size={28} />
                </Link>
                <button onClick={() => setShowLogoutModal(true)} className="ws-btn-ghost" style={{ background: 'transparent', border: 'none', color: 'var(--ws-text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>Logout</button>
              </div>
            ) : (
              <Link to="/login" className="ws-btn ws-btn-primary">Join LuxuryStay</Link>
            )}
          </div>

          <button className="ws-hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
          </button>
        </div>
      </nav>

      {/* ====== MAIN CONTENT ====== */}
      <main className="ws-main">{children}</main>

      {/* ====== LOGOUT CONFIRMATION MODAL ====== */}
      <LuxuryConfirmModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Royal Sign-Out"
        message="Are you certain you wish to conclude your current luxury session? We look forward to your next visit."
        confirmText="Yes, Sign Out"
        cancelText="Remain Signed In"
      />

      {/* ====== UTILITY ACTIONS (AI + Scroll Top) ====== */}
      <div className={`ws-utilities ${isScrolled ? 'scrolled' : ''}`}>
        <div className="ws-ai-concierge">
          <button className="ws-ai-btn" onClick={() => document.getElementById('ai-chat').classList.toggle('open')}>
            <span className="ws-ai-pulse"></span>
            🤖
          </button>
          <div id="ai-chat" className="ws-ai-window glass-card">
            <div className="ws-ai-header">
              <strong>Aura AI Concierge</strong>
              <span className="ws-ai-status">Online</span>
            </div>
            <div className="ws-ai-body">
              <p className="ws-ai-msg">Welcome to LuxuryStay. I am Aura, your digital concierge. How may I assist your journey today?</p>
            </div>
            <div className="ws-ai-footer">
              <input type="text" placeholder="Ask Aura anything..." disabled />
            </div>
          </div>
        </div>

        <button 
          className="ws-btn-top" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </div>

      {/* ====== CUSTOM AUTH NOTICE (Extra Functionality) ====== */}
      <div id="auth-notice" className="ws-auth-notice glass-card">
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✨</div>
        <h3>Join the Elite</h3>
        <p>Login or create an account to unlock premium reservations and personalized inquiries.</p>
        <div className="ws-auth-notice-btns">
          <Link to="/login" className="ws-btn ws-btn-primary" onClick={() => document.getElementById('auth-notice').classList.remove('open')}>Login</Link>
          <Link to="/register" className="ws-btn ws-btn-outline-white" onClick={() => document.getElementById('auth-notice').classList.remove('open')}>Register</Link>
        </div>
        <button className="ws-auth-close" onClick={() => document.getElementById('auth-notice').classList.remove('open')}>×</button>
      </div>

      {/* ====== FOOTER ====== */}
      <footer className="ws-footer">
        <div className="ws-container">
          <div className="ws-footer-top">
            <div className="ws-footer-brand">
              <div className="ws-logo" style={{marginBottom: '20px'}}>
                <span className="ws-logo-icon">🏨</span>
                <span className="ws-logo-text">LuxuryStay</span>
              </div>
              <p>Experience the future of luxury hospitality. Our AI-driven comfort ensures every moment is tailored to your desires.</p>
              <div className="ws-footer-social">
                <a href="#">Fb</a><a href="#">Ig</a><a href="#">Tw</a><a href="#">Li</a>
              </div>
            </div>
            <div className="ws-footer-col">
              <h4>Quick Links</h4>
              <Link to="/">Home</Link>
              <Link to="/rooms-explore">Suites</Link>
              <Link to="/amenities">Experience</Link>
              <Link to="/gallery">Gallery</Link>
            </div>
            <div className="ws-footer-col">
              <h4>Support</h4>
              <Link to="/contact">Help Center</Link>
              <Link to="/book-room">Reservations</Link>
              <Link to="/guest-feedback">Guest Policy</Link>
              <Link to="/about">Our Story</Link>
            </div>
            <div className="ws-footer-col">
              <h4>Contact</h4>
              <p>📍 123 Luxury Ave, Paradise City</p>
              <p>📞 +92 300 1234567</p>
              <p>✉️ info@luxurystay.com</p>
            </div>
          </div>
          <div className="ws-footer-bottom">
            <p>&copy; {new Date().getFullYear()} LuxuryStay International. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx="true">{`
        .ws-nav-scrolled {
          padding: 0.75rem 0 !important;
          background: rgba(11, 15, 26, 0.95) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .ws-hamburger {
          display: none;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          z-index: 1001;
        }

        .ws-nav-actions-mobile { display: none; }

        @media (max-width: 992px) {
          .ws-hamburger { display: block; }
          .ws-nav-links {
            position: fixed;
            top: 0; right: -100%;
            width: 80%; height: 100vh;
            background: var(--ws-bg);
            flex-direction: column;
            padding: 100px 40px;
            transition: 0.5s cubic-bezier(0.77, 0, 0.175, 1);
            z-index: 1000;
            border-left: 1px solid var(--ws-glass-border);
          }
          .ws-nav-open { right: 0 !important; }
          .ws-nav-actions { display: none; }
          .ws-nav-actions-mobile { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default WebsiteLayout;
