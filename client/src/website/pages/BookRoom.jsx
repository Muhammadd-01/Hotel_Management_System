import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { HiOutlineCalendar, HiOutlineUserGroup, HiOutlineCreditCard, HiOutlineCheckCircle, HiOutlineInformationCircle } from 'react-icons/hi';

const BookRoom = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedRoomId = searchParams.get('roomId');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    selectedExtras: [] // Array of selected extra services
  });

  const [availableExtras, setAvailableExtras] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const [roomsRes, addonsRes] = await Promise.all([
          API.get('/rooms'),
          API.get('/addons')
        ]);
        
        if (roomsRes.data.success) {
          setRooms(roomsRes.data.rooms.filter(r => r.status === 'Available'));
        }
        if (addonsRes.data.success) {
          setAvailableExtras(addonsRes.data.addons);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, guestName: user.name || '', guestEmail: user.email || '' }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const selectedRoom = rooms.find(r => r._id === form.room);

  const calculateNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const diff = new Date(form.checkOut) - new Date(form.checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const extrasAmount = form.selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const totalAmount = selectedRoom ? (selectedRoom.price * nights) + extrasAmount : 0;

  const toggleExtra = (extra) => {
    const isSelected = form.selectedExtras.find(e => e._id === extra._id);
    if (isSelected) {
      setForm({ ...form, selectedExtras: form.selectedExtras.filter(e => e._id !== extra._id) });
    } else {
      setForm({ ...form, selectedExtras: [...form.selectedExtras, extra] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      document.getElementById('auth-notice').classList.add('open');
      return;
    }
    if (nights <= 0) {
      setError('Please select valid check-in and check-out dates.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const bookingInfo = {
        room: form.room,
        roomType: selectedRoom?.type,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        nights,
        extraServices: form.selectedExtras,
        totalAmount
      };
      
      // In a real app, you'd post to /bookings first
      // await API.post('/bookings', { ...form, totalAmount });
      
      setTimeout(() => {
        setSubmitting(false);
        navigate('/checkout', { state: { booking: bookingInfo } });
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="ws-book-page">
      <section className="ws-page-banner reveal" style={{ padding: '100px 0', textAlign: 'center' }}>
        <span className="ws-section-tag">Reservations</span>
        <h1 style={{ fontSize: '3.5rem' }}>Reserve Your <span className="ws-accent">Sanctuary</span></h1>
      </section>

      <div className="ws-container ws-section">
        <form onSubmit={handleSubmit} className="ws-booking-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '3rem' }}>
          
          <div className="reveal">
            {!isAuthenticated && (
              <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--ws-accent)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ws-accent)' }}>
                  <HiOutlineInformationCircle size={24} />
                  <strong>Membership Benefits</strong>
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Log in to your account to save 10% on this booking and access exclusive member services.</p>
                <button type="button" className="ws-btn ws-btn-primary" style={{ marginTop: '1rem', padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => navigate('/login')}>Login / Register</button>
              </div>
            )}

            <div className="glass-card">
              <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}><HiOutlineCalendar /> Guest & Stay Details</h3>
              
              {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="ws-form-group">
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Check-in Date</label>
                  <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                </div>
                <div className="ws-form-group">
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Check-out Date</label>
                  <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} min={form.checkIn || new Date().toISOString().split('T')[0]} required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Select Room Category</label>
                <select name="room" value={form.room} onChange={handleChange} required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }}>
                  <option value="">-- Choose your preferred collection --</option>
                  {rooms.map(r => (
                    <option key={r._id} value={r._id}>Room {r.roomNumber} - {r.type} (Rs. {r.price?.toLocaleString()}/night)</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="ws-form-group">
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Full Name</label>
                  <input type="text" name="guestName" value={form.guestName} onChange={handleChange} placeholder="John Doe" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                </div>
                <div className="ws-form-group">
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Phone Number</label>
                  <input type="tel" name="guestPhone" value={form.guestPhone} onChange={handleChange} placeholder="+92 300 1234567" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Discount / Promo Code</label>
                <input type="text" placeholder="Enter code (e.g. LUXURY10)" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
              </div>

              <div className="ws-form-group">
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Special Requests</label>
                <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} rows="4" placeholder="Any preferences, dietary requirements, or special occasions..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none', resize: 'none' }}></textarea>
              </div>
            </div>

            <div className="glass-card" style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '2rem' }}>Enhance Your <span className="ws-accent">Experience</span></h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                {availableExtras.map(extra => (
                  <div 
                    key={extra._id} 
                    onClick={() => toggleExtra(extra)}
                    style={{ 
                      padding: '1.2rem', 
                      background: form.selectedExtras.find(e => e._id === extra._id) ? 'rgba(0, 194, 168, 0.1)' : 'rgba(255,255,255,0.03)',
                      border: '1px solid',
                      borderColor: form.selectedExtras.find(e => e._id === extra._id) ? 'var(--ws-accent)' : 'var(--ws-glass-border)',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: '0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{extra.icon || '✨'}</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>{extra.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>Rs. {extra.price.toLocaleString()}</span>
                    </div>
                    <div style={{ 
                      width: '20px', height: '20px', 
                      border: '2px solid', 
                      borderColor: form.selectedExtras.find(e => e._id === extra._id) ? 'var(--ws-accent)' : '#444',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: form.selectedExtras.find(e => e._id === extra._id) ? 'var(--ws-accent)' : 'transparent'
                    }}>
                      {form.selectedExtras.find(e => e._id === extra._id) && <span style={{ color: '#0b0f1a', fontSize: '12px' }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR SUMMARY */}
          <div className="reveal" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card" style={{ position: 'sticky', top: '120px' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}><HiOutlineCreditCard /> Booking Summary</h3>
              
              {selectedRoom ? (
                <div className="ws-summary-content">
                  <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80" alt="Room" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.5rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Category</span><strong>{selectedRoom.type}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Room No.</span><strong>{selectedRoom.roomNumber}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Nights</span><strong>{nights}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Room Rate</span><strong>Rs. {selectedRoom.price?.toLocaleString()}</strong></div>
                    
                    {form.selectedExtras.length > 0 && (
                      <div style={{ padding: '10px 0', borderTop: '1px solid var(--ws-glass-border)', borderBottom: '1px solid var(--ws-glass-border)' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)', marginBottom: '8px' }}>Add-ons:</p>
                        {form.selectedExtras.map(e => (
                          <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>{e.name}</span>
                            <span>Rs. {e.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ margin: '1rem 0', borderTop: '1px solid var(--ws-glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem' }}>
                      <span>Total</span><strong className="ws-accent">Rs. {totalAmount.toLocaleString()}</strong>
                    </div>
                  </div>
                  <button type="submit" className="ws-btn ws-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} disabled={submitting || !selectedRoom}>
                    {submitting ? 'Confirming...' : isAuthenticated ? 'Complete Reservation' : 'Login to Confirm'}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--ws-text-muted)', marginTop: '1rem' }}>Instant confirmation. No booking fees.</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ws-text-muted)' }}>
                  <HiOutlineInformationCircle size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>Select a room to view your real-time booking summary and total price.</p>
                </div>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookRoom;
