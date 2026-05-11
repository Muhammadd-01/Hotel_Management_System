import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  HiOutlineUserCircle, HiOutlineMail, HiOutlinePhone, 
  HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineCreditCard,
  HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineLogout
} from 'react-icons/hi';
import API from '../../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await API.get('/bookings/my-bookings');
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Error fetching bookings', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyBookings();
  }, [user]);

  if (!user) return <div className="ws-container" style={{ padding: '200px 0', textAlign: 'center' }}><h2>Please login to view your profile.</h2></div>;

  return (
    <div className="ws-profile-page">
      <section className="ws-page-banner reveal">
        <span className="ws-section-tag">Elite Membership</span>
        <h1>Guest <span className="ws-accent">Profile</span></h1>
        <p>Manage your luxury preferences and view your royal journey with us.</p>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-profile-grid">
            
            {/* Sidebar: Personal Info */}
            <div className="ws-profile-sidebar reveal">
              <div className="glass-card ws-profile-card">
                <div className="ws-profile-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h3>{user.name}</h3>
                <span className="ws-member-badge">Royal Member</span>
                
                <div className="ws-profile-details">
                  <div className="ws-p-item">
                    <HiOutlineMail /> <span>{user.email}</span>
                  </div>
                  <div className="ws-p-item">
                    <HiOutlinePhone /> <span>+92 300 1234567</span>
                  </div>
                  <div className="ws-p-item">
                    <HiOutlineLocationMarker /> <span>Islamabad, Pakistan</span>
                  </div>
                </div>

                <button onClick={logout} className="ws-btn ws-btn-outline-white ws-btn-full" style={{ marginTop: '2rem' }}>
                  <HiOutlineLogout /> Sign Out
                </button>
              </div>

              <div className="glass-card ws-perks-card">
                <h4><HiOutlineSparkles /> Your Perks</h4>
                <ul>
                  <li>✨ Complementary High-Speed AI WiFi</li>
                  <li>✨ Priority Check-in & Late Checkout</li>
                  <li>✨ Exclusive Spa & Wellness Access</li>
                  <li>✨ Personalized Mini-bar Selection</li>
                </ul>
              </div>
            </div>

            {/* Main Content: Bookings & Activity */}
            <div className="ws-profile-main reveal" style={{ animationDelay: '0.2s' }}>
              <div className="ws-tab-header">
                <h3>Your Royal <span className="ws-accent">Bookings</span></h3>
              </div>

              {loading ? (
                <div className="ws-loading">Discovering your history...</div>
              ) : bookings.length > 0 ? (
                <div className="ws-booking-list">
                  {bookings.map((booking, i) => (
                    <div key={i} className="glass-card ws-booking-item">
                      <div className="ws-booking-info">
                        <div className="ws-room-type-tag">{booking.roomType || 'Deluxe Suite'}</div>
                        <h4>Reservation #{booking._id?.slice(-6).toUpperCase()}</h4>
                        <div className="ws-booking-meta">
                          <span><HiOutlineCalendar /> {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                          <span><HiOutlineCreditCard /> Total: Rs. {booking.totalPrice?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className={`ws-status-badge ${booking.status?.toLowerCase()}`}>
                        {booking.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card ws-no-bookings">
                  <p>You haven't begun your journey yet.</p>
                  <a href="/rooms-explore" className="ws-btn ws-btn-primary">Explore Our Suites</a>
                </div>
              )}

              <div className="ws-security-notice glass-card">
                <div style={{ display: 'flex', gap: '15px' }}>
                  <HiOutlineShieldCheck size={40} color="var(--ws-accent)" />
                  <div>
                    <h4>Enterprise Security Active</h4>
                    <p>Your data is protected by 256-bit military-grade encryption and monitored by our AI security team 24/7.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style jsx="true">{`
        .ws-profile-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .ws-profile-card {
          text-align: center;
          padding: 3rem 2rem !important;
        }
        .ws-profile-avatar {
          width: 100px;
          height: 100px;
          background: var(--ws-accent);
          color: var(--ws-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 auto 1.5rem;
          box-shadow: 0 0 30px var(--ws-accent-glow);
        }
        .ws-member-badge {
          display: inline-block;
          padding: 5px 15px;
          background: var(--ws-accent-soft);
          color: var(--ws-accent);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 2rem;
        }
        .ws-profile-details {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .ws-p-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--ws-text-muted);
          font-size: 0.9rem;
        }
        .ws-perks-card {
          margin-top: 2rem;
          padding: 2rem !important;
        }
        .ws-perks-card h4 { display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; color: var(--ws-accent); }
        .ws-perks-card ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .ws-perks-card li { font-size: 0.85rem; color: var(--ws-text-muted); }

        .ws-tab-header { margin-bottom: 2rem; }
        .ws-booking-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .ws-booking-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem !important;
          transition: 0.3s;
        }
        .ws-booking-item:hover { transform: translateX(10px); border-color: var(--ws-accent); }
        .ws-room-type-tag { font-size: 0.7rem; text-transform: uppercase; color: var(--ws-accent); font-weight: 800; margin-bottom: 5px; }
        .ws-booking-meta { display: flex; gap: 20px; margin-top: 10px; font-size: 0.85rem; color: var(--ws-text-muted); }
        .ws-booking-meta span { display: flex; align-items: center; gap: 6px; }
        
        .ws-status-badge {
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          background: rgba(255,255,255,0.05);
        }
        .ws-status-badge.confirmed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .ws-status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

        .ws-no-bookings {
          padding: 4rem !important;
          text-align: center;
        }
        .ws-no-bookings p { color: var(--ws-text-muted); margin-bottom: 1.5rem; }

        .ws-security-notice {
          margin-top: 3rem;
          padding: 2rem !important;
          background: rgba(0, 209, 255, 0.02);
          border: 1px dashed var(--ws-accent);
        }
        .ws-security-notice h4 { margin-bottom: 5px; color: var(--ws-accent); }
        .ws-security-notice p { font-size: 0.85rem; color: var(--ws-text-muted); }

        @media (max-width: 992px) {
          .ws-profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
