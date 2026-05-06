// CreateUser.jsx - Naye staff members register karne ke liye (Admin Only)
import { useState } from 'react';
import API from '../services/api';
import { HiUserAdd, HiCheckCircle } from 'react-icons/hi';

const CreateUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' }); // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ============ FORM SUBMIT KARNA ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Backend API ko naya user data bhejna
      const res = await API.post('/auth/register', form);
      if (res.data.success) {
        setSuccess(true);
        // Form ko khali karna
        setForm({ name: '', email: '', password: '', role: 'staff' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'User register nahi ho saka. Email shayad pehle se mojood hai.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-page">
      <div className="page-header">
        <div><h1>Register Staff</h1><p className="page-subtitle">Naye team members ke liye secure accounts banayein</p></div>
      </div>

      <div style={{maxWidth: '600px'}}>
        {success && (
          <div className="alert alert-success" style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <HiCheckCircle size={24} /> Naya user kamyabi se register ho gaya hai!
          </div>
        )}
        
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{padding: '32px'}}>
          <div style={{display: 'flex', alignItems:'center', gap:'12px', marginBottom:'24px'}}>
            <div style={{background:'rgba(0,194,168,0.1)', color:'var(--accent)', padding:'12px', borderRadius:'12px'}}><HiUserAdd size={24}/></div>
            <h3>Staff Member ki Information</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Full Name</label><input type="text" placeholder="e.g. Ahmad Ali" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
            <div className="form-group"><label>Email Address</label><input type="email" placeholder="staff@hotelpro.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
            <div className="form-group"><label>Password</label><input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required minLength="6" /></div>
            <div className="form-group">
              <label>System Role</label>
              <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                <option value="staff">Staff Member (Common Access)</option>
                <option value="admin">Admin Manager (Full Access)</option>
              </select>
            </div>
            <div style={{marginTop: '24px'}}>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Registering...' : 'Create Staff Account'}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-muted" style={{marginTop:'16px', fontSize:'0.8rem'}}>
          Note: Naya user apne email aur is password ke saath login kar sakega.
        </p>
      </div>
    </div>
  );
};

export default CreateUser;
