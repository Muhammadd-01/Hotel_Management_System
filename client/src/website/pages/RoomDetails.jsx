import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineWifi, HiOutlineDesktopComputer, HiOutlineCube, 
  HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineSparkles,
  HiOutlineArrowLeft, HiOutlineCheckCircle
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const ROOM_DATA = {
  'standard': {
    name: 'Executive Standard',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80',
    description: 'Perfect for business travelers and short stays, our Executive Standard room offers a blend of functionality and luxury. Designed with a modern minimalist aesthetic, it provides a quiet sanctuary to rest and recharge.',
    size: '350 sq ft',
    bed: 'King Size',
    view: 'City Skyline',
    amenities: ['High-speed AI WiFi', '4K Smart TV', 'Climate Control', 'Premium Minibar', '24/7 Room Service', 'Rain Shower']
  },
  'deluxe': {
    name: 'Panoramic Deluxe',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
    description: 'Elevate your stay in our Panoramic Deluxe suites. Featuring floor-to-ceiling windows, these rooms offer breathtaking views of the ocean and the city. Each room is equipped with custom-made furniture and Italian marble bathrooms.',
    size: '550 sq ft',
    bed: 'California King',
    view: 'Panoramic Ocean',
    amenities: ['Nespresso Machine', 'Personal Butler', 'Luxury Bathrobe', 'Evening Turndown', 'Bluetooth Sound System', 'Jacuzzi Access']
  },
  'royal': {
    name: 'The Royal Penthouse',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    description: 'The pinnacle of global hospitality. The Royal Penthouse is more than a suite; it is a private estate. Occupying the entire top floor, it features a private infinity pool, a state-of-the-art cinema, and a dedicated culinary team.',
    size: '2500 sq ft',
    bed: 'Royal Emperor Bed',
    view: '360° City & Ocean',
    amenities: ['Private Pool', 'Personal Chef', 'Cinema Room', 'Helipad Access', 'Executive Security', 'Private Elevator']
  }
};

const RoomDetails = () => {
  const { type } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const room = ROOM_DATA[type] || ROOM_DATA['standard'];

  const handleBookingClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      document.getElementById('auth-notice').classList.add('open');
    }
  };

  return (
    <div className="ws-room-details">
      {/* ====== HEADER ====== */}
      <section className="ws-room-hero" style={{ height: '70vh', position: 'relative', overflow: 'hidden' }}>
        <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="ws-hero-overlay" style={{ background: 'linear-gradient(transparent, rgba(11,15,26,1))' }}></div>
        <div className="ws-container" style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <Link to="/rooms-explore" className="ws-btn ws-btn-ghost" style={{ marginBottom: '2rem' }}><HiOutlineArrowLeft /> Back to Collection</Link>
          <span className="ws-section-tag">Signature Suite</span>
          <h1 style={{ fontSize: '4rem', marginBottom: '10px' }}>{room.name}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--ws-accent)', fontWeight: 'bold' }}>Starting from Rs. {room.price?.toLocaleString()} / night</p>
        </div>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-room-info-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '5rem' }}>
            
            <div className="reveal">
              <h2 style={{ marginBottom: '2rem' }}>About This <span className="ws-accent">Sanctuary</span></h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--ws-text-muted)', lineHeight: '1.8', marginBottom: '3rem' }}>{room.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <HiOutlineUserGroup size={24} color="var(--ws-accent)" />
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', marginTop: '8px' }}>Capacity</p>
                  <strong>2-4 Guests</strong>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <HiOutlineCube size={24} color="var(--ws-accent)" />
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', marginTop: '8px' }}>Room Size</p>
                  <strong>{room.size}</strong>
                </div>
                <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <HiOutlineSparkles size={24} color="var(--ws-accent)" />
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', marginTop: '8px' }}>Bed Type</p>
                  <strong>{room.bed}</strong>
                </div>
              </div>

              <h3 style={{ marginBottom: '2rem' }}>Premium <span className="ws-accent">Amenities</span></h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {room.amenities.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                    <HiOutlineCheckCircle color="var(--ws-accent)" size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card" style={{ position: 'sticky', top: '120px', padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Reservation Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--ws-glass-border)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>Best Available Rate</p>
                    <h2 className="ws-accent">Rs. {room.price?.toLocaleString()} <span style={{ fontSize: '1rem', color: 'white' }}>/ night</span></h2>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}><HiOutlineShieldCheck color="var(--ws-accent)" /> Free Cancellation</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}><HiOutlineWifi color="var(--ws-accent)" /> complimentary High-Speed AI WiFi</div>
                  </div>

                  <Link 
                    to={`/book-room?type=${type}`} 
                    className="ws-btn ws-btn-primary" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                    onClick={handleBookingClick}
                  >
                    Proceed to Booking
                  </Link>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>No payment required today. Secure your stay instantly.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="ws-section" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="ws-container">
          <div className="ws-section-header reveal">
            <span className="ws-section-tag">Visuals</span>
            <h2>Suite <span className="ws-accent">Gallery</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', height: '500px' }}>
            <img className="reveal" src={room.image} alt="Gallery 1" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <img className="reveal" src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80" alt="Gallery 2" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', animationDelay: '0.1s' }} />
              <img className="reveal" src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80" alt="Gallery 3" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomDetails;
