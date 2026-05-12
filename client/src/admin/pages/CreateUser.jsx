// CreateUser.jsx - Interface for registering new personnel (Admin Restricted)
import { useState } from 'react';
import API from '../../services/api';
import { HiUserAdd, HiCheckCircle } from 'react-icons/hi';

const CreateUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'receptionist' }); // Initial form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ============ FORM SUBMISSION LOGIC ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Send new user data to the backend authentication endpoint
      const res = await API.post('/auth/register', form);
      if (res.data.success) {
        setSuccess(true);
        // Reset form upon successful registration
        setForm({ name: '', email: '', password: '', role: 'receptionist' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register personnel. The email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-page">
      <div className="page-header">
        <div><h1>Enroll Personnel</h1><p className="page-subtitle">Create secure access accounts for new team members</p></div>
      </div>

      <div style={{maxWidth: '600px'}}>
        {success && (
          <div className="alert alert-success" style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <HiCheckCircle size={24} /> New personnel member successfully enrolled!
          </div>
        )}
        
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{padding: '32px'}}>
          <div style={{display: 'flex', alignItems:'center', gap:'12px', marginBottom:'24px'}}>
            <div style={{background:'rgba(0,194,168,0.1)', color:'var(--accent)', padding:'12px', borderRadius:'12px'}}><HiUserAdd size={24}/></div>
            <h3>Personnel Information</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Full Name</label><input type="text" placeholder="e.g. John Doe" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
            <div className="form-group"><label>Email Address</label><input type="email" placeholder="personnel@luxurystay.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
            <div className="form-group"><label>Initial Password</label><input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required minLength="6" /></div>
            <div className="form-group">
              <label>System Role</label>
              <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                <option value="manager">Hotel Manager (Executive Control)</option>
                <option value="receptionist">Receptionist (Bookings & Guests)</option>
                <option value="housekeeping">Housekeeping (Cleaning & Room Status)</option>
                <option value="maintenance">Maintenance (Technical Repairs)</option>
              </select>
            </div>
            <div style={{marginTop: '24px'}}>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Processing Enrollment...' : 'Create Personnel Account'}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-muted" style={{marginTop:'16px', fontSize:'0.85rem'}}>
          Note: The new user will be able to log in immediately using these credentials.
        </p>
      </div>
    </div>
  );
};

export default CreateUser;
