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
      <section className="ws-page-banner reveal" style={{ padding: '150px 0', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <span className="ws-section-tag">Wall of Fame</span>
        <h1 style={{ fontSize: '4.5rem' }}>Guest <span className="ws-accent">Testimonials</span></h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--ws-text-muted)', fontSize: '1.2rem' }}>Real stories from our esteemed guests about their unforgettable journeys with us.</p>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          {/* Stats Bar */}
          <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h2 style={{ fontSize: '4rem', lineHeight: 1 }}>{avgRating}</h2>
              <div style={{ margin: '1rem 0' }}>{renderStars(Math.round(parseFloat(avgRating)))}</div>
              <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Average Rating</p>
            </div>
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h2 style={{ fontSize: '4rem', lineHeight: 1 }}>{feedbacks.length}</h2>
              <HiOutlineChatAlt size={32} color="var(--ws-accent)" style={{ margin: '1rem 0' }} />
              <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Global Reviews</p>
            </div>
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h2 style={{ fontSize: '4rem', lineHeight: 1 }}>98%</h2>
              <HiOutlineThumbUp size={32} color="var(--ws-accent)" style={{ margin: '1rem 0' }} />
              <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Recommended</p>
            </div>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--ws-accent)' }}>
              <p style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '0 1rem' }}>Share your own LuxuryStay experience with the world.</p>
              {isAuthenticated ? (
                <button className="ws-btn ws-btn-primary" onClick={() => setShowForm(!showForm)}>
                  <HiOutlinePencil /> Write Review
                </button>
              ) : (
                <button className="ws-btn ws-btn-primary" onClick={() => (window.location.href = '/login')}>Login to Review</button>
              )}
            </div>
          </div>

          {success && <div className="reveal" style={{ background: 'var(--ws-accent-soft)', color: 'var(--ws-accent)', padding: '1.5rem', borderRadius: '16px', marginBottom: '3rem', border: '1px solid var(--ws-accent)', textAlign: 'center' }}>{success}</div>}

          {/* Review Form */}
          {showForm && (
            <div className="reveal" style={{ marginBottom: '5rem' }}>
              <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '2rem' }}>Post Your Review</h3>
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
                    <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} rows="5" placeholder="Tell us about the highlights of your stay..." required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none', resize: 'none' }}></textarea>
                  </div>
                  <button type="submit" className="ws-btn ws-btn-primary" disabled={submitting}>
                    {submitting ? 'Sharing...' : 'Share My Review'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {loading ? (
            <div className="page-loading"><div className="spinner"></div></div>
          ) : (
            <div className="ws-features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
              {feedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px 0' }}>
                  <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Be the First</h3>
                  <p style={{ color: 'var(--ws-text-muted)' }}>No reviews yet. Share your experience and help others discover LuxuryStay.</p>
                </div>
              ) : (
                feedbacks.map((f, i) => (
                  <div key={f._id || i} className="glass-card reveal" style={{ animationDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--ws-accent-soft)', border: '1px solid var(--ws-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--ws-accent)' }}>
                          {f.guest?.name?.charAt(0) || f.guestName?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '1.1rem' }}>{f.guest?.name || f.guestName || 'Elite Guest'}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>{renderStars(f.rating)}</div>
                    </div>
                    <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--ws-accent-soft)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--ws-accent)', textTransform: 'uppercase', width: 'fit-content', marginBottom: '1rem' }}>
                      {f.category}
                    </span>
                    <p style={{ color: 'var(--ws-text-muted)', fontSize: '1rem', fontStyle: 'italic', flex: 1 }}>"{f.comment}"</p>
                    {f.response && (
                      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', borderLeft: '4px solid var(--ws-accent)' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px' }}>🏨 Management Response</strong>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{f.response}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GuestFeedback;
