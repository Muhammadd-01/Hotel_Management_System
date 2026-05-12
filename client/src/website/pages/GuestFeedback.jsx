import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { HiOutlineStar, HiOutlinePencil, HiOutlineChatAlt, HiOutlineThumbUp } from 'react-icons/hi';

const GuestFeedback = () => {
  const { user, isAuthenticated } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ rating: 5, category: 'overall', comment: '' });

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await API.get('/feedback');
        if (res.data.success) {
          setFeedbacks(res.data.feedbacks || []);
        }
      } catch (err) {
        console.error('Feedback fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post('/feedback', form);
      if (res.data.success) {
        setSuccess('Your experience has been recorded. Thank you for your valuable feedback!');
        setShowForm(false);
        setForm({ rating: 5, category: 'overall', comment: '' });
        const fresh = await API.get('/feedback');
        if (fresh.data.success) setFeedbacks(fresh.data.feedbacks || []);
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) => (
      <HiOutlineStar key={i} color={i < count ? 'var(--ws-accent)' : 'var(--ws-text-muted)'} style={{ marginRight: '2px' }} />
    ));
  };

  const avgRating = feedbacks.length ? (feedbacks.reduce((a, f) => a + (f.rating || 0), 0) / feedbacks.length).toFixed(1) : '0.0';

  return (
    <div className="ws-feedback-page">
      <section className="ws-page-banner reveal">
        <div className="ws-hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80" 
            alt="Guest Testimonials"
            className="ws-hero-image-element"
          />
          <div className="ws-hero-gradient-overlay"></div>
        </div>
        <div className="ws-container">
          <span className="ws-section-tag">Wall of Fame</span>
          <h1 style={{ fontSize: '4.5rem' }}>Guest <span className="ws-accent">Testimonials</span></h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>Real stories from our esteemed guests about their unforgettable journeys with us.</p>
        </div>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          {/* Featured Quote Section */}
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <div style={{ fontSize: '4rem', color: 'var(--ws-accent)', marginBottom: '2rem', opacity: 0.5 }}>"</div>
            <h2 style={{ fontSize: '2.5rem', fontStyle: 'italic', maxWidth: '900px', margin: '0 auto', lineHeight: 1.4 }}>
              LuxuryStay isn't just a hotel; it's a sanctuary where technology and humanity dance in perfect harmony.
            </h2>
            <p style={{ marginTop: '2rem', color: 'var(--ws-accent)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>— Global Elite Member</p>
          </div>

          {/* Stats Bar */}
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', borderTop: '4px solid var(--ws-accent)' }}>
              <h2 style={{ fontSize: '4rem', lineHeight: 1 }}>{avgRating}</h2>
              <div style={{ margin: '1rem 0' }}>{renderStars(Math.round(parseFloat(avgRating)))}</div>
              <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Average Rating</p>
            </div>
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', borderTop: '4px solid var(--ws-accent)' }}>
              <h2 style={{ fontSize: '4rem', lineHeight: 1 }}>{feedbacks.length}</h2>
              <HiOutlineChatAlt size={32} color="var(--ws-accent)" style={{ margin: '1rem 0' }} />
              <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Global Reviews</p>
            </div>
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', borderTop: '4px solid var(--ws-accent)' }}>
              <h2 style={{ fontSize: '4rem', lineHeight: 1 }}>98%</h2>
              <HiOutlineThumbUp size={32} color="var(--ws-accent)" style={{ margin: '1rem 0' }} />
              <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Recommended</p>
            </div>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--ws-accent-soft)', background: 'linear-gradient(rgba(0,209,255,0.05), transparent)' }}>
              <p style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '0 1rem', fontSize: '0.9rem' }}>Have you experienced the future of hospitality?</p>
              {isAuthenticated ? (
                <button className="ws-btn ws-btn-primary" onClick={() => setShowForm(!showForm)} style={{ width: '80%' }}>
                  <HiOutlinePencil /> Write Review
                </button>
              ) : (
                <button className="ws-btn ws-btn-primary" onClick={() => (window.location.href = '/login')} style={{ width: '80%' }}>Login to Review</button>
              )}
            </div>
          </div>

          {success && <div className="reveal" style={{ background: 'var(--ws-accent-soft)', color: 'var(--ws-accent)', padding: '1.5rem', borderRadius: '16px', marginBottom: '3rem', border: '1px solid var(--ws-accent)', textAlign: 'center' }}>{success}</div>}

          {/* Review Form */}
          {showForm && (
            <div className="reveal" style={{ marginBottom: '5rem' }}>
              <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Share Your <span className="ws-accent">Journey</span></h3>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                    <div className="ws-form-group">
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>How was your stay?</label>
                      <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }}>
                        <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                        <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
                        <option value={3}>⭐⭐⭐ (Good)</option>
                        <option value={2}>⭐⭐ (Fair)</option>
                        <option value={1}>⭐ (Poor)</option>
                      </select>
                    </div>
                    <div className="ws-form-group">
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Focus Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }}>
                        <option value="overall">Overall Experience</option>
                        <option value="room">Room & Comfort</option>
                        <option value="service">Service & Staff</option>
                        <option value="food">Dining & Cuisine</option>
                        <option value="wellness">Spa & Wellness</option>
                      </select>
                    </div>
                  </div>
                  <div className="ws-form-group" style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Detailed Feedback</label>
                    <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} rows="5" placeholder="Tell us about the highlights of your stay..." required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '1.2rem', borderRadius: '16px', color: 'white', outline: 'none', resize: 'none' }}></textarea>
                  </div>
                  <button type="submit" className="ws-btn ws-btn-primary" style={{ width: '100%', justifyContent: 'center', height: '55px' }} disabled={submitting}>
                    {submitting ? 'Sharing...' : 'Share My Official Review'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {loading ? (
            <div className="page-loading" style={{ textAlign: 'center', padding: '5rem' }}>
              <div className="spinner" style={{ border: '4px solid rgba(0,209,255,0.1)', borderTop: '4px solid var(--ws-accent)', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
              <p style={{ marginTop: '1.5rem', color: 'var(--ws-text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Gathering Guest Experiences...</p>
            </div>
          ) : (
            <div className="ws-feedback-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '4rem' }}>
              {feedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px 0', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed var(--ws-glass-border)' }}>
                  <HiOutlineChatAlt size={60} color="var(--ws-accent-soft)" style={{ marginBottom: '1.5rem' }} />
                  <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>The Guestbook is Empty</h3>
                  <p style={{ color: 'var(--ws-text-muted)', maxWidth: '400px', margin: '0 auto' }}>Be the first to share your journey and inspire other elite travelers around the world.</p>
                </div>
              ) : (
                feedbacks.map((f, i) => (
                  <div 
                    key={f._id || i} 
                    className="glass-card reveal-item" 
                    style={{ 
                      animationDelay: `${i * 0.1}s`, 
                      padding: '3.5rem !important', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      border: '1px solid var(--ws-glass-border)', 
                      transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = 'var(--ws-accent)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,209,255,0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--ws-glass-border)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Decorative Category Accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--ws-accent)' }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ 
                          width: '70px', 
                          height: '70px', 
                          borderRadius: '22px', 
                          background: 'linear-gradient(135deg, var(--ws-accent-soft), rgba(0,209,255,0.05))', 
                          border: '1px solid var(--ws-accent)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: '800', 
                          color: 'var(--ws-accent)', 
                          fontSize: '1.5rem',
                          boxShadow: '0 10px 20px rgba(0,209,255,0.15)'
                        }}>
                          {f.guest?.name?.charAt(0) || f.guestName?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '1.3rem', color: 'white', marginBottom: '4px' }}>{f.guest?.name || f.guestName || 'Elite Guest'}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.7rem', background: 'var(--ws-accent)', color: 'var(--ws-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>Verified</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>{new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ marginBottom: '8px', display: 'flex', gap: '3px' }}>{renderStars(f.rating)}</div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--ws-accent)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px', background: 'var(--ws-accent-soft)', padding: '4px 10px', borderRadius: '100px' }}>{f.category}</span>
                      </div>
                    </div>
                    
                    <div style={{ position: 'relative', flex: 1 }}>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.9)', 
                        fontSize: '1.2rem', 
                        lineHeight: 1.8, 
                        fontStyle: 'italic', 
                        position: 'relative', 
                        zIndex: 1, 
                        padding: '0 5px',
                        fontWeight: '300',
                        letterSpacing: '0.3px'
                      }}>
                        "{f.comment}"
                      </p>
                    </div>

                    {f.response && (
                      <div style={{ 
                        marginTop: '3rem', 
                        padding: '2.5rem', 
                        background: 'rgba(255,255,255,0.02)', 
                        borderRadius: '24px', 
                        border: '1px solid var(--ws-glass-border)',
                        position: 'relative' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                          <div style={{ width: '12px', height: '2px', background: 'var(--ws-accent)' }}></div>
                          <strong style={{ fontSize: '0.75rem', color: 'var(--ws-accent)', textTransform: 'uppercase', letterSpacing: '2px' }}>Curator's Note</strong>
                        </div>
                        <p style={{ fontSize: '1rem', color: 'var(--ws-text-muted)', lineHeight: 1.7, fontStyle: 'normal' }}>{f.response}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .reveal-item { animation: revealUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; opacity: 0; }
        @keyframes revealUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default GuestFeedback;
