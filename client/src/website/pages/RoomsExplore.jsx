import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
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
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

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
      <section className="ws-page-banner reveal" style={{ padding: '120px 0', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <span className="ws-section-tag">Luxurious Stays</span>
        <h1 style={{ fontSize: '4rem' }}>Our <span className="ws-accent">Collections</span></h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--ws-text-muted)' }}>From executive suites to royal penthouses, discover a room that resonates with your taste and style.</p>
      </section>

      <div className="ws-container ws-section">
        <div className="ws-filters reveal" style={{ marginBottom: '4rem' }}>
          <div className="ws-search-box" style={{ background: 'var(--ws-glass)', border: '1px solid var(--ws-glass-border)', padding: '12px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <HiOutlineSearch size={20} color="var(--ws-accent)" />
            <input type="text" placeholder="Search room types or numbers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', width: '100%', outline: 'none' }} />
          </div>
          <div className="ws-filter-chips" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button className={`ws-btn ${filter === 'all' ? 'ws-btn-primary' : 'ws-btn-outline-white'}`} onClick={() => setFilter('all')} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>All Collection</button>
            {roomTypes.map(type => (
              <button key={type} className={`ws-btn ${filter === type ? 'ws-btn-primary' : 'ws-btn-outline-white'}`} onClick={() => setFilter(type)} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>{type}</button>
            ))}
          </div>
        </div>

        <div className="ws-rooms-grid">
          {filteredRooms.map((room, i) => (
            <div key={room._id} className="ws-room-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <Link to={`/book-room?roomId=${room._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="ws-room-card-img">
                  <img src={ROOM_IMAGES[room.type?.toLowerCase()] || ROOM_IMAGES['default']} alt={room.type} />
                  <span className="ws-room-type-badge">{room.type}</span>
                  <div className="ws-room-price-tag">Rs. {room.price?.toLocaleString()}</div>
                </div>
              </Link>
              <div className="ws-room-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>Room {room.roomNumber}</h3>
                  <span style={{ color: 'var(--ws-accent)', fontWeight: 'bold', fontSize: '0.8rem' }}>{room.status.toUpperCase()}</span>
                </div>
                <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Experience sheer luxury in this {room.type?.toLowerCase()} sanctuary, featuring modern aesthetics and premium comfort.</p>
                
                <div className="ws-room-amenities" style={{ display: 'flex', gap: '15px', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--ws-text-muted)' }}><HiOutlineWifi /> WiFi</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--ws-text-muted)' }}><HiOutlineDesktopComputer /> Smart TV</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--ws-text-muted)' }}><HiOutlineCube /> AC</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--ws-text-muted)' }}><HiOutlineUserGroup /> 2 Guests</div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link to={`/book-room?roomId=${room._id}`} className="ws-btn ws-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Book Now</Link>
                  <Link to="/gallery" className="ws-btn ws-btn-outline-white" style={{ padding: '0 15px' }} title="View Gallery"><HiOutlineArrowRight /></Link>
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
