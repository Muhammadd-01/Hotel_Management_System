import { useState, useEffect } from 'react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineCube } from 'react-icons/hi';

const Addons = () => {
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Food',
    icon: '✨'
  });

  const fetchAddons = async () => {
    try {
      const res = await API.get('/addons');
      if (res.data.success) {
        setAddons(res.data.addons);
      }
    } catch (error) {
      addToast('Error', 'Failed to fetch services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddon) {
        await API.put(`/addons/${editingAddon._id}`, form);
        addToast('Success', 'Service updated successfully', 'success');
      } else {
        await API.post('/addons', form);
        addToast('Success', 'New service added to catalog', 'success');
      }
      setShowModal(false);
      setEditingAddon(null);
      setForm({ name: '', price: '', category: 'Food', icon: '✨' });
      fetchAddons();
    } catch (error) {
      addToast('Error', 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this service?')) {
      try {
        await API.delete(`/addons/${id}`);
        addToast('Removed', 'Service removed from catalog', 'info');
        fetchAddons();
      } catch (error) {
        addToast('Error', 'Could not delete service', 'error');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Service Catalog</h1>
          <p className="page-subtitle">Manage extra services available during booking</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <HiOutlinePlus /> Add New Service
        </button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {addons.map(addon => (
          <div key={addon._id} className="stat-card glass">
            <div className="stat-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '1.5rem' }}>
              {addon.icon}
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem' }}>{addon.name}</h3>
              <p>{addon.category} • Rs. {addon.price.toLocaleString()}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-icon" onClick={() => { setEditingAddon(addon); setForm(addon); setShowModal(true); }}><HiOutlinePencil /></button>
              <button className="btn-icon" style={{ color: 'var(--error)' }} onClick={() => handleDelete(addon._id)}><HiOutlineTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <h2>{editingAddon ? 'Edit Service' : 'Add Luxury Service'}</h2>
            <form onSubmit={handleSubmit} className="p-24">
              <div className="ws-form-group mb-16">
                <label>Service Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="form-control" />
              </div>
              <div className="ws-form-group mb-16">
                <label>Price (Rs.)</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="form-control" />
              </div>
              <div className="ws-form-group mb-16">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="form-control">
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Spa">Spa</option>
                  <option value="Laundry">Laundry</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="ws-form-group mb-24">
                <label>Icon (Emoji)</label>
                <input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="form-control" />
              </div>
              <div className="flex justify-end gap-12">
                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); setEditingAddon(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addons;
