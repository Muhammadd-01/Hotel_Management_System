// Settings.jsx - System configuration page for Admins
import { useState, useEffect } from 'react';
import API from '../../services/api';
import { HiOutlineSave, HiOutlineRefresh } from 'react-icons/hi';

const Settings = () => {
  const [settings, setSettings] = useState({
    hotelName: 'LuxuryStay Hospitality',
    taxRate: 15,
    currency: 'Rs.',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in.'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Simulating fetching settings
  useEffect(() => {
    // In a real app, we would fetch from /api/settings
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      // Mocking save
      setTimeout(() => {
        setSuccess('System settings updated successfully!');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to update settings');
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>⚙️ System Settings</h1>
          <p className="page-subtitle">Configure hotel policies, taxes, and global parameters (Admin Only)</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{maxWidth: '800px'}}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Hotel Name</label>
              <input value={settings.hotelName} onChange={e => setSettings({...settings, hotelName: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Currency Symbol</label>
              <input value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tax Rate (%)</label>
              <input type="number" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Check-In Time</label>
              <input type="time" value={settings.checkInTime} onChange={e => setSettings({...settings, checkInTime: e.target.value})} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Check-Out Time</label>
              <input type="time" value={settings.checkOutTime} onChange={e => setSettings({...settings, checkOutTime: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Cancellation Policy</label>
            <textarea 
              rows="4" 
              value={settings.cancellationPolicy} 
              onChange={e => setSettings({...settings, cancellationPolicy: e.target.value})}
              style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1.5px solid var(--border)'}}
            ></textarea>
          </div>

          <div style={{marginTop: '20px', display: 'flex', gap: '12px'}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <HiOutlineSave /> {loading ? 'Saving...' : 'Save Settings'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
              <HiOutlineRefresh /> Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
