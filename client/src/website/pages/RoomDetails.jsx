import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineWifi, HiOutlineDesktopComputer, HiOutlineCube, 
  HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineSparkles,
  HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineArrowRight
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const RoomDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await API.get(`/rooms/${id}`);
        if (res.data.success) {
          setRoom(res.data.room);
        }
      } catch (err) {
        console.error('Error fetching room:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  // Slideshow logic
  useEffect(() => {
    if (room?.images?.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % room.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [room]);

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!room) return <div className="ws-container ws-section" style={{ textAlign: 'center' }}><h2>Room not found</h2><Link to="/rooms-explore" className="ws-btn ws-btn-primary">Back to Collection</Link></div>;

  const displayImages = room.images?.length > 0 ? room.images : ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80'];

  const handleBookingClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      // Assuming you have an auth-notice element in your layout or handle it differently
      navigate('/login');
    }
  };

  return (
    <div className="ws-room-details">
      {/* ====== HEADER BACKGROUND SLIDESHOW ====== */}
      <section className="ws-room-hero" style={{ height: '85vh', position: 'relative', overflow: 'hidden' }}>
        {displayImages.map((img, idx) => (
          <div 
            key={idx}
            className="ws-slideshow-img"
            style={{ 
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              opacity: activeIndex === idx ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: activeIndex === idx ? 1 : 0
            }}
          >
            <img src={img} alt={`Slide ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
        
        <div className="ws-hero-overlay" style={{ background: 'linear-gradient(transparent, rgba(11,15,26,1))', zIndex: 2 }}></div>
        
        <div className="ws-container" style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', width: '100%', zIndex: 3 }}>
          <Link to="/rooms-explore" className="ws-btn ws-btn-ghost" style={{ marginBottom: '2rem' }}><HiOutlineArrowLeft /> Back to Collection</Link>
          <span className="ws-section-tag">Elite Experience</span>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '10px', fontWeight: '800' }}>{room.type} <span className="ws-accent">Sanctuary</span></h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--ws-accent)', fontWeight: '700' }}>Starting from Rs. {room.price?.toLocaleString()} / night</p>
        </div>

        {/* Slide Indicators */}
        {displayImages.length > 1 && (
          <div style={{ position: 'absolute', bottom: '40px', right: '50px', display: 'flex', gap: '10px', zIndex: 4 }}>
            {displayImages.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveIndex(idx)}
                style={{ 
                  width: activeIndex === idx ? '30px' : '10px', 
                  height: '10px', 
                  background: activeIndex === idx ? 'var(--ws-accent)' : 'rgba(255,255,255,0.3)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: '0.3s'
                }} 
              />
            ))}
          </div>
        )}
      </section>

      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-room-info-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '5rem' }}>
            
            <div className="reveal">
              <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>The <span className="ws-accent">Description</span></h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--ws-text-muted)', lineHeight: '1.9', marginBottom: '3rem' }}>
                {room.description || `Welcome to Room ${room.roomNumber}, where modern luxury meets timeless elegance. This ${room.type.toLowerCase()} suite is meticulously designed to provide an unparalleled stay, featuring premium materials, smart automation, and breathtaking views.`}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid var(--ws-glass-border)', borderRadius: '24px' }}>
                  <HiOutlineUserGroup size={24} color="var(--ws-accent)" />
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', marginTop: '8px' }}>Capacity</p>
                  <strong style={{ fontSize: '1.1rem' }}>Up to 4 Guests</strong>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid var(--ws-glass-border)', borderRadius: '24px' }}>
                  <HiOutlineCube size={24} color="var(--ws-accent)" />
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', marginTop: '8px' }}>Room No.</p>
                  <strong style={{ fontSize: '1.1rem' }}>{room.roomNumber}</strong>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem', border: '1px solid var(--ws-glass-border)', borderRadius: '24px' }}>
                  <HiOutlineSparkles size={24} color="var(--ws-accent)" />
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', marginTop: '8px' }}>Status</p>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--ws-accent)' }}>{room.status}</strong>
                </div>
              </div>

              <h3 style={{ marginBottom: '2.5rem', fontSize: '1.8rem' }}>Suite <span className="ws-accent">Inclusions</span></h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px' }}>
                  <HiOutlineWifi color="var(--ws-accent)" size={24} />
                  <div>
                    <strong style={{ display: 'block' }}>Gigabit WiFi</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>Unlimited device access</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px' }}>
                  <HiOutlineDesktopComputer color="var(--ws-accent)" size={24} />
                  <div>
                    <strong style={{ display: 'block' }}>Smart Entertainment</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>4K TV with AI Hub</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px' }}>
                  <HiOutlineCube color="var(--ws-accent)" size={24} />
                  <div>
                    <strong style={{ display: 'block' }}>Climate Control</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>Smart adaptive heating</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px' }}>
                  <HiOutlineShieldCheck color="var(--ws-accent)" size={24} />
                  <div>
                    <strong style={{ display: 'block' }}>Private Security</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>Encrypted smart lock</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card" style={{ position: 'sticky', top: '120px', padding: '3rem', border: '1px solid var(--ws-accent-soft)', borderRadius: '32px' }}>
                <h3 style={{ marginBottom: '2rem' }}>Finalize Booking</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ padding: '1.5rem', background: 'rgba(0,194,168,0.05)', borderRadius: '20px', border: '1px solid var(--ws-accent-soft)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ws-text-muted)', marginBottom: '5px' }}>Best Rate Guarantee</p>
                    <h2 className="ws-accent" style={{ fontSize: '2.2rem' }}>Rs. {room.price?.toLocaleString()} <span style={{ fontSize: '1rem', color: 'white', fontWeight: 'normal' }}>/ night</span></h2>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}><HiOutlineCheckCircle color="var(--ws-accent)" /> Free Cancellation within 24h</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem' }}><HiOutlineCheckCircle color="var(--ws-accent)" /> Complimentry AI Concierge</div>
                  </div>

                  <Link 
                    to={`/book-room?roomId=${room._id}`} 
                    className="ws-btn ws-btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', height: '60px', fontSize: '1.1rem' }}
                    onClick={handleBookingClick}
                  >
                    Confirm Reservation <HiOutlineArrowRight />
                  </Link>
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ws-text-muted)' }}>Secure payment. Instant confirmation.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Gallery Section */}
      {displayImages.length > 0 && (
        <section className="ws-section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--ws-glass-border)' }}>
          <div className="ws-container">
            <div className="ws-section-header reveal" style={{ marginBottom: '4rem' }}>
              <span className="ws-section-tag">Visual Gallery</span>
              <h2>Inside the <span className="ws-accent">Sanctuary</span></h2>
            </div>
            
            <div className="ws-dynamic-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
              {displayImages.map((img, idx) => (
                <div key={idx} className="reveal" style={{ animationDelay: `${idx * 0.1}s`, height: '350px', overflow: 'hidden', borderRadius: '28px', border: '1px solid var(--ws-glass-border)' }}>
                  <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} className="ws-gallery-thumb" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Luxury Footer Note */}
      <section className="ws-section" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="ws-container reveal">
          <HiOutlineSparkles size={50} color="var(--ws-accent)" style={{ marginBottom: '2rem', opacity: 0.5 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Experience the <span className="ws-accent">Unmatched</span></h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', color: 'var(--ws-text-muted)' }}>
            Every corner of our {room.type.toLowerCase()} sanctuary is designed to tell a story of elegance and comfort. We look forward to welcoming you to LuxuryStay.
          </p>
        </div>
      </section>

      <style>{`
        .ws-gallery-thumb:hover {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
};

export default RoomDetails;
