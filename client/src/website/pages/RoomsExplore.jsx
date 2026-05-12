import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUserGroup, HiOutlineArrowRight, HiOutlineSearch, HiOutlineFilter, HiOutlineWifi, HiOutlineDesktopComputer, HiOutlineCube, HiOutlineShieldCheck } from 'react-icons/hi';

const ROOM_IMAGES = {
  'standard': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
  'deluxe': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  'suite': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'presidential': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1590490360182-c33d955c4644?w=800&q=80'
};

const AMENITIES_ICONS = {
  'wifi': <HiOutlineWifi />,
  'tv': <HiOutlineDesktopComputer />,
  'ac': <HiOutlineCube />,
  'security': <HiOutlineShieldCheck />
};

const RoomsExplore = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('roomType') || 'all');
  const [search, setSearch] = useState('');

  // Extract search params from Home page
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '1';

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        if (res.data.success) {
          // Display only Available rooms
          setRooms(res.data.rooms.filter(r => r.status === 'Available'));
        }
      } catch (error) {
        console.error('Fetch rooms error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const roomTypes = [...new Set(rooms.map(r => r.type))];
  
  const filteredRooms = rooms.filter(r => {
    const matchesFilter = filter === 'all' || r.type === filter;
    const matchesSearch = r.roomNumber?.toString().includes(search) || r.type?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="ws-rooms-page">
      <section className="ws-page-banner reveal">
        <div className="ws-hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=1920&q=80" 
            alt="Luxury Rooms Sanctuary"
            className="ws-hero-image-element"
          />
          <div className="ws-hero-gradient-overlay"></div>
        </div>
        <div className="ws-container">
          <span className="ws-section-tag">Luxurious Stays</span>
          <h1 style={{ fontSize: '4rem' }}>Our <span className="ws-accent">Collections</span></h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--ws-text-muted)' }}>From executive rooms to royal penthouses, discover a space that resonates with your taste and style.</p>
        </div>
      </section>

      <div className="ws-container ws-section">
        <div className="ws-filters reveal" style={{ marginBottom: '4rem' }}>
          <div className="ws-search-box" style={{ background: 'var(--ws-glass)', border: '1px solid var(--ws-glass-border)', padding: '12px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <HiOutlineSearch size={20} color="var(--ws-accent)" />
            <input type="text" placeholder="Search room types or numbers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', width: '100%', outline: 'none' }} />
          </div>
        </div>

        <div className="ws-rooms-grid">
          {filteredRooms.map((room, i) => (
            <div key={room._id} className="ws-room-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="ws-room-card-img">
                <img src={room.images?.[0] || ROOM_IMAGES[room.type?.toLowerCase()] || ROOM_IMAGES['default']} alt={room.type} />
                <span className="ws-room-type-badge">{room.type}</span>
                <Link to={`/room-details/${room._id}`} className="ws-room-wishlist"><HiOutlineArrowRight /></Link>
                <div className="ws-room-price-tag">Rs. {room.price?.toLocaleString()}</div>
              </div>
              <div className="ws-room-card-body">
                <h3>{room.type} Sanctuary</h3>
                <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{room.description || `Experience sheer luxury in this ${room.type?.toLowerCase()} sanctuary, featuring modern aesthetics and premium comfort.`}</p>
                
                <div className="ws-room-amenities" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ws-text-muted)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}><HiOutlineWifi color="var(--ws-accent)" /> Ultra-Fast WiFi</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ws-text-muted)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}><HiOutlineDesktopComputer color="var(--ws-accent)" /> 4K Smart TV</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ws-text-muted)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}><HiOutlineCube color="var(--ws-accent)" /> Climate Control</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--ws-text-muted)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}><HiOutlineUserGroup color="var(--ws-accent)" /> Up to 4 Guests</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <Link to={`/room-details/${room._id}`} className="ws-btn ws-btn-outline-white" style={{ flex: 1, justifyContent: 'center' }}>View Details</Link>
                  <button 
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate(`/book-room?roomId=${room._id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
                      } else {
                        navigate('/login');
                      }
                    }} 
                    className="ws-btn ws-btn-primary" 
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="ws-empty" style={{ textAlign: 'center', padding: '100px 0' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Rooms Found</h3>
            <p style={{ color: 'var(--ws-text-muted)' }}>Try adjusting your search or filters to explore other luxury collections.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsExplore;
