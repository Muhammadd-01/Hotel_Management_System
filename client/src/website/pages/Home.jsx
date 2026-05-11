import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { 
  HiOutlineArrowRight, HiOutlineShieldCheck, HiOutlineSparkles, 
  HiOutlineStar, HiOutlineGlobe, HiOutlineClock, 
  HiOutlineHeart, HiOutlineTicket, HiOutlineCamera,
  HiOutlineMusicNote, HiOutlineLightningBolt
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

// Counting Animation Hook
const useCountUp = (end, duration = 3000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start, isVisible]);

  return { count, elementRef };
};

const StatItem = ({ end, label, suffix = '' }) => {
  const { count, elementRef } = useCountUp(end);
  return (
    <div className="ws-hero-stat" ref={elementRef}>
      <h3>{count}{suffix}</h3>
      <p>{label}</p>
    </div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/rooms');
        if (res.data.success) {
          // Get first 3 available rooms
          setFeaturedRooms(res.data.rooms.filter(r => r.status === 'Available').slice(0, 3));
        }
      } catch (err) {
        console.error('Home rooms fetch error:', err);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleAuthNotice = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      document.getElementById('auth-notice').classList.add('open');
    }
  };

  const ROOM_IMAGES = {
    'Single': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
    'Double': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
    'Deluxe': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    'default': 'https://images.unsplash.com/photo-1590490360182-c33d955c4644?w=600&q=80'
  };

  return (
    <div className="ws-home">
      {/* ... rest of the component remains same until Signature Accommodations ... */}
      {/* ====== REFINED CINEMATIC HERO ====== */}
      <section className="ws-hero-centered">
        {/* Single High-Quality Cinematic Video */}
        <div className="ws-hero-video-bg">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="ws-hero-video-full"
            poster="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-hotel-lobby-with-a-large-chandelier-42352-large.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="ws-hero-overlay-dark"></div>
        
        <div className="ws-container ws-hero-centered-content">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <span className="ws-hero-tag-v2">
              <HiOutlineSparkles /> Excellence in Hospitality
            </span>
            <h1 className="ws-hero-main-title">
              Redefining <span className="ws-accent-glow-text">Luxury</span> For You
            </h1>
            <p className="ws-hero-main-desc">
              Immerse yourself in a sanctuary of elegance. At LuxuryStay, we combine timeless sophistication with modern AI-driven comfort to craft your perfect escape.
            </p>

            {/* Stats Section in the Middle */}
            <div className="ws-hero-stats-middle glass-card">
              <StatItem end={500} label="Elite Rooms" suffix="+" />
              <div className="ws-stat-v-divider"></div>
              <StatItem end={50} label="Royal Guests" suffix="K+" />
              <div className="ws-stat-v-divider"></div>
              <StatItem end={4} label="Satisfaction" suffix=".9/5" />
              <div className="ws-stat-v-divider"></div>
              <StatItem end={100} label="AI Support" suffix="%" />
            </div>

            <div className="ws-hero-centered-actions">
              <Link to="/rooms-explore" className="ws-btn ws-btn-primary ws-btn-lg">
                Explore Our Rooms <HiOutlineArrowRight />
              </Link>
              <Link to="/gallery" className="ws-btn ws-btn-outline-white ws-btn-lg">
                Virtual Tour
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CORE FEATURES ====== */}
      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-section-header reveal">
            <span className="ws-section-tag">Unrivaled Excellence</span>
            <h2>The <span className="ws-accent">LuxuryStay</span> Experience</h2>
            <p>We redefine hospitality through a perfect blend of human touch and technological innovation.</p>
          </div>
          <div className="ws-features-grid">
            {[
              { icon: <HiOutlineSparkles />, title: 'Premium Amenities', desc: 'From rooftop infinity pools to Michelin-star dining, experience the pinnacle of lifestyle.' },
              { icon: <HiOutlineShieldCheck />, title: 'Unmatched Security', desc: 'Your privacy is our priority. Advanced encryption and 24/7 elite security ensure total peace of mind.' },
              { icon: <HiOutlineStar />, title: 'Global Recognition', desc: 'Winner of 20+ International Hospitality Awards for service excellence and architectural design.' },
              { icon: <HiOutlineGlobe />, title: 'Strategic Location', desc: 'Nestled in the city center with panoramic views and direct access to cultural landmarks.' },
              { icon: <HiOutlineLightningBolt />, title: 'Smart Integration', desc: 'AI-powered room settings, automated check-ins, and personalized digital concierge at your service.' },
              { icon: <HiOutlineHeart />, title: 'Bespoke Services', desc: 'Personalized guest preferences remembered across all our global locations for a tailored stay.' }
            ].map((feature, i) => (
              <div key={i} className="glass-card ws-feature-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="ws-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== EXCLUSIVE OFFERS ====== */}
      <section className="ws-section ws-section-alt" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="ws-container">
          <div className="ws-section-header reveal">
            <span className="ws-section-tag">Exclusive Deals</span>
            <h2>Limited Time <span className="ws-accent">Offers</span></h2>
            <p>Unlock premium benefits and special rates by booking directly through our website.</p>
          </div>
          <div className="ws-features-grid">
            <Link to="/book-room" className="glass-card reveal" onClick={handleAuthNotice} style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80" alt="Offer 1" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h3 style={{ color: 'var(--ws-accent)', marginBottom: '8px' }}>Early Bird Special</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ws-text-muted)' }}>Book 30 days in advance and save up to 25% on your total stay.</p>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'white' }}>
                  Learn More <HiOutlineArrowRight />
                </div>
              </div>
            </Link>
            <Link to="/book-room" className="glass-card reveal" onClick={handleAuthNotice} style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', animationDelay: '0.1s' }}>
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80" alt="Offer 2" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h3 style={{ color: 'var(--ws-accent)', marginBottom: '8px' }}>Spa & Wellness Package</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ws-text-muted)' }}>Complimentary 60-min massage and wellness session with every 3-night stay.</p>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'white' }}>
                  Learn More <HiOutlineArrowRight />
                </div>
              </div>
            </Link>
            <Link to="/book-room" className="glass-card reveal" onClick={handleAuthNotice} style={{ padding: 0, overflow: 'hidden', textDecoration: 'none', animationDelay: '0.2s' }}>
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" alt="Offer 3" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h3 style={{ color: 'var(--ws-accent)', marginBottom: '8px' }}>Romantic Getaway</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ws-text-muted)' }}>Champagne on arrival, private rooftop dinner, and late checkout for couples.</p>
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'white' }}>
                  Learn More <HiOutlineArrowRight />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== SIGNATURE ACCOMMODATIONS ====== */}
      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-section-header reveal">
            <span className="ws-section-tag">Signature Rooms</span>
            <h2>Luxury <span className="ws-accent">Rooms</span></h2>
            <p>Each room is a masterpiece of design, offering unparalleled comfort and breathtaking views.</p>
          </div>
          <div className="ws-rooms-grid">
            {featuredRooms.map((room, i) => (
              <div key={room._id} className="ws-room-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="ws-room-card-img">
                  <img src={room.images?.[0] || ROOM_IMAGES[room.type] || ROOM_IMAGES['default']} alt={room.type} />
                  <span className="ws-room-type-badge">{room.type}</span>
                  <div className="ws-room-price-tag">Rs. {room.price?.toLocaleString()}</div>
                </div>
                <div className="ws-room-card-body">
                  <h3>{room.type} Room</h3>
                  <p>{room.description || 'Experience ultimate luxury in our meticulously designed space.'}</p>
                  <div className="ws-room-amenities" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ws-text-muted)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}>Room {room.roomNumber}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ws-text-muted)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}>Premium View</div>
                  </div>
                  <Link to={`/book-room?roomId=${room._id}`} className="ws-btn ws-btn-primary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}>Reserve Now</Link>
                </div>
              </div>
            ))}
            {featuredRooms.length === 0 && !loadingRooms && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px' }}>
                <p style={{ color: 'var(--ws-text-muted)' }}>Check back soon for available luxury rooms.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====== LOCAL EXPERIENCES ====== */}
      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-section-header reveal">
            <span className="ws-section-tag">Explore The City</span>
            <h2>Curated <span className="ws-accent">Experiences</span></h2>
            <p>Discover the soul of the city with our handpicked local tours and cultural events.</p>
          </div>
          <div className="ws-features-grid">
            <div className="glass-card reveal" style={{ textAlign: 'center' }}>
              <HiOutlineCamera size={40} color="var(--ws-accent)" style={{ marginBottom: '1rem' }} />
              <h3>City Heritage Tour</h3>
              <p>Explore historic landmarks with a private historian. Direct transfers included.</p>
              <Link to="/amenities" style={{ color: 'var(--ws-accent)', textDecoration: 'none', fontSize: '0.9rem', marginTop: '1rem', display: 'inline-block' }}>Request Service →</Link>
            </div>
            <div className="glass-card reveal" style={{ textAlign: 'center', animationDelay: '0.1s' }}>
              <HiOutlineMusicNote size={40} color="var(--ws-accent)" style={{ marginBottom: '1rem' }} />
              <h3>Jazz Night Evenings</h3>
              <p>Live jazz every Friday night at our Rooftop Lounge. Reservations recommended.</p>
              <Link to="/amenities" style={{ color: 'var(--ws-accent)', textDecoration: 'none', fontSize: '0.9rem', marginTop: '1rem', display: 'inline-block' }}>View Schedule →</Link>
            </div>
            <div className="glass-card reveal" style={{ textAlign: 'center', animationDelay: '0.2s' }}>
              <HiOutlineTicket size={40} color="var(--ws-accent)" style={{ marginBottom: '1rem' }} />
              <h3>Exclusive Art Access</h3>
              <p>Private after-hours access to the National Art Gallery for our premium guests.</p>
              <Link to="/amenities" style={{ color: 'var(--ws-accent)', textDecoration: 'none', fontSize: '0.9rem', marginTop: '1rem', display: 'inline-block' }}>Get Tickets →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <section className="ws-cta ws-section" style={{ background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80") center/cover fixed' }}>
        <div className="ws-container">
          <div className="ws-section-header reveal" style={{ marginBottom: 0 }}>
            <h2 style={{ color: 'white' }}>Begin Your <span className="ws-accent">Royal</span> Journey</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '3rem' }}>Join the ranks of the world's most discerning travelers. Experience the future of hospitality at LuxuryStay.</p>
            <div className="ws-hero-btns" style={{ justifyContent: 'center' }}>
              <Link to="/rooms-explore" className="ws-btn ws-btn-primary">Reserve Your Room</Link>
              <Link to="/register" className="ws-btn ws-btn-outline-white">Join Membership</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .ws-hero-centered {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #050810;
        }
        .ws-hero-video-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .ws-hero-video-full {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.1);
          animation: slowMove 20s linear infinite alternate;
        }
        @keyframes slowMove {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .ws-hero-overlay-dark {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(5,8,16,0.3) 0%, rgba(5,8,16,0.9) 100%);
          z-index: 1;
        }
        .ws-hero-centered-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 1000px;
        }
        .ws-hero-tag-v2 {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
          margin-bottom: 2.5rem;
        }
        .ws-hero-main-title {
          font-size: clamp(3.5rem, 10vw, 6rem);
          line-height: 1;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -3px;
        }
        .ws-hero-main-desc {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 750px;
          line-height: 1.6;
          margin: 0 auto 3.5rem;
        }
        .ws-hero-stats-middle {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          max-width: 900px;
          padding: 2rem;
          margin: 0 auto 4rem;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .ws-stat-v-divider {
          width: 1px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
        }
        .ws-hero-centered-actions {
          display: flex;
          gap: 24px;
          justify-content: center;
        }
        .ws-accent-glow-text {
          color: var(--ws-accent);
          text-shadow: 0 0 30px var(--ws-accent-glow);
        }
        @media (max-width: 768px) {
          .ws-hero-stats-middle {
            display: none;
          }
          .ws-hero-main-title { font-size: 3rem; letter-spacing: -1px; }
          .ws-hero-centered-actions { flex-direction: column; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Home;
