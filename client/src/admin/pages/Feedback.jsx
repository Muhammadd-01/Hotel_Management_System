// Feedback.jsx - Displays guest reviews, ratings, and manages administrative responses
import { useState, useEffect } from 'react';
import API from '../../services/api';
import { HiPlus, HiX, HiStar } from 'react-icons/hi';

// Helper component to display star ratings visually
const StarDisplay = ({ rating }) => (
  <span style={{ color: '#F59E0B' }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
);

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]); // List of all guest reviews
  const [bookings, setBookings] = useState([]); // List of bookings for reference
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initial state for the feedback form
  const [form, setForm] = useState({ guestName: '', booking: '', rating: 5, cleanliness: 3, service: 3, comfort: 3, comment: '' });

  // ============ DATA ACQUISITION LOGIC ============
  const fetchData = async () => {
    try {
      const [fbRes, bkRes] = await Promise.all([API.get('/feedback'), API.get('/bookings')]);
      if (fbRes.data.success) setFeedbackList(fbRes.data.feedbacks || []);
      if (bkRes.data.success) setBookings(bkRes.data.bookings || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ NEW FEEDBACK SUBMISSION ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/feedback', form);
      setSuccess('Feedback successfully recorded! Thank you.');
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Error processing feedback'); }
  };

  // ============ ADMINISTRATIVE RESPONSE LOGIC ============
  const respondFeedback = async (id) => {
    const response = prompt('Enter your response to the guest:');
    if (!response) return;
    try {
      await API.put(`/feedback/${id}`, { response, status: 'Responded' });
      setSuccess('Response saved successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError('Failed to save response'); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="feedback-page">
      <div className="page-header">
        <div><h1>⭐ Guest Reviews</h1><p className="page-subtitle">Monitor and respond to guest ratings and operational feedback</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> Add Manual Feedback</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="feedback-list">
        {feedbackList.length > 0 ? feedbackList.map(fb => (
          <div key={fb._id} className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{fb.guestName}</h3>
                <StarDisplay rating={fb.rating} />
                <span className="text-muted" style={{ marginLeft: '8px' }}>{fb.rating}/5</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`status-badge ${fb.status === 'Responded' ? 'badge-success' : 'badge-warning'}`}>{fb.status}</span>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{new Date(fb.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <p style={{ margin: '16px 0', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '1rem', lineHeight: '1.6' }}>"{fb.comment}"</p>
            
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Cleanliness: <StarDisplay rating={fb.cleanliness} /></span>
              <span>Service: <StarDisplay rating={fb.service} /></span>
              <span>Comfort: <StarDisplay rating={fb.comfort} /></span>
            </div>

            {/* Display Administrative Response */}
            {fb.response && (
              <div className="ai-message" style={{ marginTop: '20px', borderLeft: '3px solid var(--accent)', background: 'rgba(0, 209, 255, 0.05)' }}>
                <p><strong style={{ color: 'var(--accent)' }}>Management Response:</strong> {fb.response}</p>
              </div>
            )}

            {fb.status === 'Pending' && (
              <button className="btn btn-sm btn-primary" style={{ marginTop: '16px' }} onClick={() => respondFeedback(fb._id)}>Reply to Guest</button>
            )}
          </div>
        )) : <div className="card" style={{ padding: '60px', textAlign: 'center' }}><p className="text-muted">No guest feedback has been recorded yet.</p></div>}
      </div>

      {/* Manual Entry Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Register New Feedback</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Guest Name</label><input value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} required /></div>
              <div className="form-group"><label>Overall Experience Rating (1-5)</label><input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} required /></div>
              <div className="form-group"><label>Feedback Comment</label><textarea value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} placeholder="Describe the guest's stay experience..." style={{height:'100px'}} required /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
