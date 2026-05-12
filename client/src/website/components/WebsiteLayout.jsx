import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineUserCircle, HiOutlineMenu, HiOutlineX, 
  HiOutlineOfficeBuilding, HiOutlineChatAlt2 
} from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LuxuryConfirmModal from './LuxuryConfirmModal';

const WebsiteLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
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

  // ====== CHATBOT LOGIC ======
  const [messages, setMessages] = useState([
    { text: 'Welcome to LuxuryStay. I am Aura, your digital concierge. How may I assist your journey today?', isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getAuraResponse = (input) => {
    const text = input.toLowerCase();
    if (text.includes('room') || text.includes('stay') || text.includes('booking')) 
      return "We offer Single, Double, Deluxe, and Royal Suites. Each is a masterpiece of design. You can view them in our 'Rooms' collection.";
    if (text.includes('price') || text.includes('cost') || text.includes('rate')) 
      return "Our rates are dynamic and start from Rs. 15,000. For the most accurate pricing, please visit our 'Reservations' page.";
    if (text.includes('amenit') || text.includes('pool') || text.includes('gym') || text.includes('spa')) 
      return "Our sanctuary features a rooftop infinity pool, a state-of-the-art wellness center, and Michelin-star dining experiences.";
    if (text.includes('location') || text.includes('where') || text.includes('address')) 
      return "We are located at 123 Luxury Ave, Paradise City. We offer private chauffeur services for our esteemed guests.";
    if (text.includes('contact') || text.includes('phone') || text.includes('call') || text.includes('email')) 
      return "You may reach our executive desk at +92 300 1234567 or email us at concierge@luxurystay.com.";
    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) 
      return "Greetings! How may I enhance your LuxuryStay experience today?";
    if (text.includes('thank')) 
      return "It is my absolute pleasure to assist you. Is there anything else you require?";
    
    return "That is an interesting inquiry. While I gather more data on that, would you like me to connect you with our human concierge team?";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { text: inputText, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = { text: getAuraResponse(inputText), isBot: true };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="ws">
      {/* ====== NAVIGATION BAR ====== */}
      <nav className={`ws-nav ${isScrolled ? 'ws-nav-scrolled' : ''}`}>
        <div className="ws-nav-inner">
          <Link to="/" className="ws-logo">
            <span className="ws-logo-icon"><HiOutlineOfficeBuilding /></span>
            <span className="ws-logo-text">LuxuryStay</span>
          </Link>

          <div className={`ws-nav-links ${isMenuOpen ? 'ws-nav-open' : ''}`}>
            {[
              { path: '/', label: 'Home' },
              { path: '/about', label: 'About' },
              { path: '/rooms-explore', label: 'Rooms' },
              { path: '/amenities', label: 'Amenities' },
              { path: '/gallery', label: 'Gallery' },
              { path: '/guest-feedback', label: 'Reviews' },
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
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                {['superadmin', 'manager', 'receptionist', 'housekeeping', 'maintenance', 'staff'].includes(user.role) && (
                  <Link to="/dashboard" className="ws-link" style={{ fontSize: '0.85rem' }}>Management Panel</Link>
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
            <HiOutlineChatAlt2 size={24} />
          </button>
          <div id="ai-chat" className="ws-ai-window glass-card">
            <div className="ws-ai-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="ws-ai-avatar">A</div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>Aura AI Concierge</strong>
                  <span className="ws-ai-status">Online & Ready</span>
                </div>
              </div>
              <button className="ws-ai-close" onClick={() => document.getElementById('ai-chat').classList.remove('open')}>×</button>
            </div>
            <div className="ws-ai-body" id="chat-body">
              {messages.map((msg, i) => (
                <div key={i} className={`ws-ai-msg-wrapper ${msg.isBot ? 'bot' : 'user'}`}>
                  <div className={`ws-ai-msg ${msg.isBot ? 'bot' : 'user'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="ws-ai-msg-wrapper bot">
                  <div className="ws-ai-msg bot typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>
            <form className="ws-ai-footer" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Ask Aura about rooms, prices, or amenities..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" disabled={!inputText.trim()}>Send</button>
            </form>
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
                <span className="ws-logo-icon"><HiOutlineOfficeBuilding /></span>
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
              <Link to="/rooms-explore">Rooms</Link>
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

        /* CHATBOT STYLES */
        .ws-ai-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          border: 1px solid var(--ws-glass-border);
          background: rgba(11, 15, 26, 0.95);
        }
        .ws-ai-window.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .ws-ai-header {
          padding: 1.5rem;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid var(--ws-glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ws-ai-avatar {
          width: 35px; height: 35px;
          background: var(--ws-accent);
          color: #0b0f1a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .ws-ai-status {
          font-size: 0.7rem;
          color: var(--ws-accent);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .ws-ai-status::before {
          content: '';
          width: 6px; height: 6px;
          background: var(--ws-accent);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        .ws-ai-close {
          background: transparent;
          border: none;
          color: var(--ws-text-muted);
          font-size: 1.5rem;
          cursor: pointer;
        }
        .ws-ai-body {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .ws-ai-msg-wrapper {
          display: flex;
          width: 100%;
        }
        .ws-ai-msg-wrapper.user { justify-content: flex-end; }
        .ws-ai-msg-wrapper.bot { justify-content: flex-start; }
        
        .ws-ai-msg {
          max-width: 80%;
          padding: 0.8rem 1.2rem;
          border-radius: 18px;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .ws-ai-msg.bot {
          background: rgba(255,255,255,0.05);
          color: white;
          border-bottom-left-radius: 4px;
        }
        .ws-ai-msg.user {
          background: var(--ws-accent);
          color: #0b0f1a;
          border-bottom-right-radius: 4px;
          font-weight: 500;
        }
        .ws-ai-footer {
          padding: 1rem;
          background: rgba(0,0,0,0.2);
          display: flex;
          gap: 10px;
        }
        .ws-ai-footer input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--ws-glass-border);
          padding: 10px 15px;
          border-radius: 10px;
          color: white;
          outline: none;
          font-size: 0.85rem;
        }
        .ws-ai-footer button {
          background: var(--ws-accent);
          color: #0b0f1a;
          border: none;
          padding: 0 15px;
          border-radius: 10px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }
        .ws-ai-footer button:disabled { opacity: 0.5; cursor: not-allowed; }

        .typing span {
          width: 6px; height: 6px;
          background: var(--ws-text-muted);
          border-radius: 50%;
          display: inline-block;
          margin-right: 3px;
          animation: typing 1s infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        @media (max-width: 480px) {
          .ws-ai-window {
            width: calc(100vw - 40px);
            right: -10px;
          }
        }
      `}</style>
    </div>
  );
};

export default WebsiteLayout;
