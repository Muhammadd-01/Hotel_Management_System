// Feedback.jsx - Yeh page guests ke reviews aur ratings dikhata hai
import { useState, useEffect } from 'react';
import API from '../../services/api';
import { HiPlus, HiX, HiStar } from 'react-icons/hi';

// Sitaray (Stars) dikhane wala chota component
const StarDisplay = ({ rating }) => (
  <span style={{ color: '#F59E0B' }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
);

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]); // Saari reviews ki list
  const [bookings, setBookings] = useState([]); // Bookings list (feedback link karne ke liye)
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Nayi feedback ka initial form
  const [form, setForm] = useState({ guestName: '', booking: '', rating: 5, cleanliness: 3, service: 3, comfort: 3, comment: '' });

  // ============ DATA LOAD KARNE KA LOGIC ============
  const fetchData = async () => {
    try {
      const [fbRes, bkRes] = await Promise.all([API.get('/feedback'), API.get('/bookings')]);
      if (fbRes.data.success) setFeedbackList(fbRes.data.feedback);
      if (bkRes.data.success) setBookings(bkRes.data.bookings);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ NAYI FEEDBACK SUBMIT KARNA ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/feedback', form);
      setSuccess('Feedback register ho gayi! Shukriya.');
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };

  // ============ ADMIN RESPONSE DENA ============
  const respondFeedback = async (id) => {
    const response = prompt('Guest ko kya jawab dena chahte hain?');
    if (!response) return;
    try {
      await API.put(`/feedback/${id}`, { response, status: 'Responded' });
      setSuccess('Aapka jawab save ho gaya!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError('Jawab save nahi ho saka'); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="feedback-page">
      <div className="page-header">
        <div><h1>⭐ Guest Feedback</h1><p className="page-subtitle">Guests ke reviews aur ratings yahan se dekhein aur jawab dein</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> Add Feedback</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="feedback-list">
        {feedbackList.length > 0 ? feedbackList.map(fb => (
          <div key={fb._id} className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0 }}>{fb.guestName}</h3>
                <StarDisplay rating={fb.rating} />
                <span className="text-muted" style={{ marginLeft: '8px' }}>{fb.rating}/5</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`status-badge ${fb.status === 'Responded' ? 'badge-success' : 'badge-warning'}`}>{fb.status}</span>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{new Date(fb.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <p style={{ margin: '12px 0', color: '#4B5563', fontStyle: 'italic' }}>"{fb.comment}"</p>
            
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#6B7280' }}>
              <span>Safai: <StarDisplay rating={fb.cleanliness} /></span>
              <span>Service: <StarDisplay rating={fb.service} /></span>
              <span>Comfort: <StarDisplay rating={fb.comfort} /></span>
            </div>

            {/* Admin ka jawab agar hai to dikhao */}
            {fb.response && (
              <div className="ai-message" style={{ marginTop: '16px', borderLeft: '3px solid var(--accent)' }}>
                <p><strong>Hotel Response:</strong> {fb.response}</p>
              </div>
            )}

            {fb.status === 'Pending' && (
              <button className="btn-sm btn-success" style={{ marginTop: '12px' }} onClick={() => respondFeedback(fb._id)}>Reply to Guest</button>
            )}
          </div>
        )) : <div className="card" style={{ padding: '40px', textAlign: 'center' }}><p className="text-muted">Abhi tak koi feedback nahi aayi</p></div>}
      </div>

      {/* Add Feedback Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>New Feedback</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Guest Name</label><input value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} required /></div>
              <div className="form-group"><label>Overall Rating (1-5)</label><input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} required /></div>
              <div className="form-group"><label>Comment</label><textarea value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} placeholder="Stay kaisa raha?" style={{height:'80px'}} required /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
