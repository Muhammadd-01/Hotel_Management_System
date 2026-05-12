import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  HiOutlineUserCircle, HiOutlineMail, HiOutlinePhone, 
  HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineCreditCard,
  HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineLogout,
  HiOutlineX, HiOutlineArrowRight, HiOutlineInformationCircle,
  HiOutlinePencil, HiOutlineIdentification, HiOutlinePhotograph, HiOutlineUpload
} from 'react-icons/hi';
import { jsPDF } from 'jspdf';
import API from '../../services/api';

const Profile = () => {
  const { user, logout, updateProfile, fetchMe } = useAuth();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [fetchingInvoice, setFetchingInvoice] = useState(false);

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    cnicNumber: '',
    profileImage: '',
    cnicFrontImage: '',
    cnicBackImage: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await API.get('/bookings/my-bookings');
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Error fetching bookings', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMyBookings();
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        cnicNumber: user.cnicNumber || '',
        profileImage: user.profileImage || '',
        cnicFrontImage: user.cnicFrontImage || '',
        cnicBackImage: user.cnicBackImage || ''
      });
    }
  }, [user]);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await updateProfile(editForm);
      if (res.success) {
        addToast('Success', 'Your royal profile has been updated.', 'success');
        setShowEditModal(false);
        await fetchMe(); // Refresh user data
      }
    } catch (err) {
      addToast('Error', 'Failed to update profile. Please try again.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleViewDetails = async (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
    setFetchingInvoice(true);
    try {
      const res = await API.get(`/invoices/${booking._id}`);
      if (res.data.success) {
        setInvoice(res.data.invoice);
      }
    } catch (err) {
      console.error('Invoice fetch error', err);
    } finally {
      setFetchingInvoice(false);
    }
  };

  const downloadPDF = () => {
    if (!invoice) return;
    const doc = new jsPDF();
    const margin = 20;
    doc.setFillColor(11, 15, 26);
    doc.rect(0, 0, 210, 60, 'F');
    doc.setFontSize(26);
    doc.setTextColor(0, 209, 255);
    doc.text('LUXURYSTAY', margin, 35);
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('HOTELS & RESORTS INTERNATIONAL', margin, 42);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('OFFICIAL INVOICE', 130, 38);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, margin, 75);
    doc.text(`Generated: ${new Date(invoice.generatedAt).toLocaleDateString()}`, margin, 82);
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, 90, 190, 90);
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO', margin, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.guestName, margin, 107);
    doc.setFont('helvetica', 'bold');
    doc.text('STAY DETAILS', 130, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Room: ${invoice.room?.type} (#${invoice.room?.roomNumber})`, 130, 107);
    doc.text(`${new Date(invoice.checkIn).toLocaleDateString()} - ${new Date(invoice.checkOut).toLocaleDateString()}`, 130, 114);
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, 135, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', margin + 5, 142);
    doc.text('Amount', 160, 142);
    doc.setFont('helvetica', 'normal');
    let y = 155;
    doc.text(`${invoice.room?.type} Accommodation`, margin + 5, y);
    doc.text(`Rs. ${invoice.roomCharges.toLocaleString()}`, 160, y);
    y += 10;
    invoice.services.forEach(s => {
      doc.text(`${s.type}: ${s.description || 'Premium Service'}`, margin + 5, y);
      doc.text(`Rs. ${s.amount.toLocaleString()}`, 160, y);
      y += 10;
    });
    doc.line(margin, y + 5, 190, y + 5);
    y += 15;
    doc.text('Subtotal', 130, y);
    doc.text(`Rs. ${invoice.subtotal.toLocaleString()}`, 160, y);
    y += 8;
    doc.text(`Luxury Tax (${invoice.taxRate}%)`, 130, y);
    doc.text(`Rs. ${invoice.tax.toLocaleString()}`, 160, y);
    y += 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 194, 168);
    doc.text('Total Paid', 130, y);
    doc.text(`Rs. ${invoice.grandTotal.toLocaleString()}`, 160, y);
    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  if (!user) return <div className="ws-container" style={{ padding: '200px 0', textAlign: 'center' }}><h2>Please login to view your profile.</h2></div>;

  return (
    <div className="ws-profile-page">
      <section className="ws-page-banner reveal">
        <div className="ws-hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1544124499-58912cbddaad?w=1920&q=80" 
            alt="Elite Profile"
            className="ws-hero-image-element"
          />
          <div className="ws-hero-gradient-overlay"></div>
        </div>
        <div className="ws-container">
          <span className="ws-section-tag">Elite Membership</span>
          <h1>Guest <span className="ws-accent">Profile</span></h1>
          <p>Manage your luxury preferences and view your royal journey with us.</p>
        </div>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-profile-grid">
            
            {/* Sidebar: Personal Info */}
            <div className="ws-profile-sidebar reveal">
              <div className="glass-card ws-profile-card">
                <div className="ws-profile-avatar-container">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="ws-profile-avatar-img" />
                  ) : (
                    <div className="ws-profile-avatar-placeholder">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button className="ws-edit-avatar-btn" onClick={() => setShowEditModal(true)}>
                    <HiOutlinePencil size={16} />
                  </button>
                </div>
                <h3>{user.name}</h3>
                <span className="ws-member-badge">Royal Member</span>
                
                <div className="ws-profile-details">
                  <div className="ws-p-item">
                    <HiOutlineMail /> <span>{user.email}</span>
                  </div>
                  <div className="ws-p-item">
                    <HiOutlinePhone /> <span>{user.phone || 'Phone not set'}</span>
                  </div>
                  <div className="ws-p-item">
                    <HiOutlineLocationMarker /> <span>{user.address || 'Address not set'}</span>
                  </div>
                  {user.cnicNumber && (
                    <div className="ws-p-item">
                      <HiOutlineIdentification /> <span>CNIC: {user.cnicNumber}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '2rem' }}>
                  <button onClick={() => setShowEditModal(true)} className="ws-btn ws-btn-primary ws-btn-full">
                    <HiOutlinePencil /> Edit Profile
                  </button>
                  <button onClick={logout} className="ws-btn ws-btn-outline-white ws-btn-full">
                    <HiOutlineLogout /> Sign Out
                  </button>
                </div>
              </div>

              <div className="glass-card ws-perks-card">
                <h4><HiOutlineSparkles /> Your Perks</h4>
                <ul>
                  <li>✨ Complementary High-Speed AI WiFi</li>
                  <li>✨ Priority Check-in & Late Checkout</li>
                  <li>✨ Exclusive Spa & Wellness Access</li>
                  <li>✨ Personalized Mini-bar Selection</li>
                </ul>
              </div>
            </div>

            {/* Main Content: Bookings & Activity */}
            <div className="ws-profile-main reveal" style={{ animationDelay: '0.2s' }}>
              <div className="ws-tab-header">
                <h3>Your Royal <span className="ws-accent">Bookings</span></h3>
              </div>

              {loading ? (
                <div className="ws-loading">Discovering your history...</div>
              ) : bookings.length > 0 ? (
                <div className="ws-booking-list">
                  {bookings.map((booking, i) => (
                    <div 
                      key={i} 
                      className="glass-card ws-booking-item reveal-item" 
                      onClick={() => handleViewDetails(booking)} 
                      style={{ 
                        cursor: 'pointer', 
                        padding: '0 !important', 
                        overflow: 'hidden',
                        animationDelay: `${i * 0.1}s`
                      }}
                    >
                      <div className="ws-booking-card-image">
                        <img 
                          src={booking.room?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'} 
                          alt="Room" 
                        />
                        <div className="ws-booking-card-overlay">
                          <span className={`ws-status-badge-v2 ${booking.status?.toLowerCase()}`}>
                            {booking.status === 'Confirmed' && <HiOutlineShieldCheck />}
                            {booking.status === 'Pending' && <HiOutlineClock />}
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="ws-booking-card-content" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--ws-accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                              {booking.room?.type || 'Deluxe Suite'}
                            </span>
                            <h4 style={{ fontSize: '1.2rem', color: 'white', marginTop: '4px' }}>
                              #{booking._id?.slice(-6).toUpperCase()}
                            </h4>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--ws-text-muted)' }}>Amount Paid</p>
                            <p style={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }}>Rs. {booking.totalAmount?.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="ws-booking-dates-v2">
                          <div className="ws-date-box">
                            <span className="ws-label">CHECK-IN</span>
                            <span className="ws-value">{new Date(booking.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                          </div>
                          <div className="ws-date-divider"></div>
                          <div className="ws-date-box">
                            <span className="ws-label">CHECK-OUT</span>
                            <span className="ws-value">{new Date(booking.checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                          </div>
                        </div>

                        <div className="ws-booking-footer" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--ws-glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <HiOutlineInformationCircle color="var(--ws-accent)" /> Tap for full itinerary
                          </span>
                          <HiOutlineArrowRight className="ws-booking-arrow-v2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card ws-no-bookings">
                  <p>You haven't begun your journey yet.</p>
                  <a href="/rooms-explore" className="ws-btn ws-btn-primary">Explore Our Suites</a>
                </div>
              )}

              <div className="ws-security-notice glass-card" style={{ marginTop: '5rem' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <HiOutlineShieldCheck size={40} color="var(--ws-accent)" />
                  <div>
                    <h4>Enterprise Security Active</h4>
                    <p>Your data is protected by 256-bit military-grade encryption and monitored by our AI security team 24/7.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====== EDIT PROFILE MODAL ====== */}
      {showEditModal && (
        <div className="ws-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="ws-modal-content glass-card reveal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <button className="ws-modal-close" onClick={() => setShowEditModal(false)}><HiOutlineX size={24} /></button>
            
            <div className="ws-modal-header">
              <span className="ws-section-tag">Account Settings</span>
              <h2>Edit Your <span className="ws-accent">Profile</span></h2>
              <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.9rem' }}>Update your personal details and identity verification documents.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="ws-edit-form">
              <div className="ws-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="ws-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="ws-form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    value={editForm.phone} 
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                  />
                </div>
                <div className="ws-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Residential Address</label>
                  <input 
                    type="text" 
                    value={editForm.address} 
                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="House #, Street, Area, City"
                  />
                </div>
                <div className="ws-form-group">
                  <label>CNIC Number</label>
                  <input 
                    type="text" 
                    value={editForm.cnicNumber} 
                    onChange={e => setEditForm({ ...editForm, cnicNumber: e.target.value })}
                    placeholder="42101-1234567-1"
                  />
                </div>
                <div className="ws-form-group">
                  <label>Profile Picture</label>
                  <div className="ws-file-input-wrapper">
                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'profileImage')} id="profile-upload" />
                    <label htmlFor="profile-upload" className="ws-file-label">
                      <HiOutlineUpload /> {editForm.profileImage ? 'Change Image' : 'Upload Image'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="ws-cnic-upload-section" style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HiOutlineIdentification /> Identity Verification (CNIC Images)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="ws-cnic-upload-box">
                    <p>Front Side</p>
                    <div className="ws-image-preview">
                      {editForm.cnicFrontImage ? (
                        <img src={editForm.cnicFrontImage} alt="CNIC Front" />
                      ) : (
                        <HiOutlinePhotograph size={40} />
                      )}
                      <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'cnicFrontImage')} id="cnic-front" />
                      <label htmlFor="cnic-front">Upload Front</label>
                    </div>
                  </div>
                  <div className="ws-cnic-upload-box">
                    <p>Back Side</p>
                    <div className="ws-image-preview">
                      {editForm.cnicBackImage ? (
                        <img src={editForm.cnicBackImage} alt="CNIC Back" />
                      ) : (
                        <HiOutlinePhotograph size={40} />
                      )}
                      <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'cnicBackImage')} id="cnic-back" />
                      <label htmlFor="cnic-back">Upload Back</label>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="ws-btn ws-btn-primary ws-btn-full" disabled={updating}>
                {updating ? 'Updating Your Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ====== RESERVATION DETAIL MODAL ====== */}
      {showModal && selectedBooking && (
        <div className="ws-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ws-modal-content glass-card reveal" onClick={e => e.stopPropagation()}>
            <button className="ws-modal-close" onClick={() => setShowModal(false)}><HiOutlineX size={24} /></button>
            
            <div className="ws-modal-header">
              <span className="ws-section-tag">Reservation Details</span>
              <h2>Room {selectedBooking.room?.roomNumber} - <span className="ws-accent">{selectedBooking.room?.type}</span></h2>
            </div>

            <div className="ws-modal-body">
              <div className="ws-detail-grid">
                <div className="ws-detail-section">
                  <h4><HiOutlineInformationCircle /> Stay Summary</h4>
                  <div className="ws-detail-info">
                    <p><strong>Check-in:</strong> {new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                    <p><strong>Check-out:</strong> {new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span className={`ws-status-badge ${selectedBooking.status?.toLowerCase()}`}>{selectedBooking.status}</span></p>
                  </div>
                </div>

                <div className="ws-detail-section">
                  <h4><HiOutlineCreditCard /> Financials</h4>
                  <div className="ws-detail-info">
                    <p><strong>Base Rate:</strong> Rs. {selectedBooking.room?.price?.toLocaleString()} / night</p>
                    <p><strong>Total Amount:</strong> <span className="ws-accent" style={{ fontWeight: 'bold' }}>Rs. {selectedBooking.totalAmount?.toLocaleString()}</span></p>
                  </div>
                </div>
              </div>

              {fetchingInvoice ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ws-text-muted)' }}>Retrieving secure invoice...</div>
              ) : invoice ? (
                <div className="ws-mini-invoice">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--ws-glass-border)' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--ws-text-muted)', textTransform: 'uppercase' }}>Invoice No.</p>
                      <strong>{invoice.invoiceNumber}</strong>
                    </div>
                    <button className="ws-btn ws-btn-primary ws-btn-sm" onClick={downloadPDF}>Download PDF</button>
                  </div>
                  <div className="ws-invoice-table">
                    <div className="ws-inv-row"><span>Accommodation</span> <span>Rs. {invoice.roomCharges?.toLocaleString()}</span></div>
                    {invoice.services?.map((s, idx) => (
                      <div key={idx} className="ws-inv-row"><span>{s.type}</span> <span>Rs. {s.amount?.toLocaleString()}</span></div>
                    ))}
                    <div className="ws-inv-divider"></div>
                    <div className="ws-inv-row ws-inv-total"><span>Grand Total</span> <span>Rs. {invoice.grandTotal?.toLocaleString()}</span></div>
                  </div>
                </div>
              ) : (
                <div className="ws-error-box">Invoice could not be loaded.</div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .ws-profile-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 3rem;
          align-items: start;
        }
        .ws-profile-card {
          text-align: center;
          padding: 3rem 2rem !important;
        }
        .ws-profile-avatar-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 1.5rem;
        }
        .ws-profile-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid var(--ws-accent);
          box-shadow: 0 0 30px var(--ws-accent-glow);
        }
        .ws-profile-avatar-placeholder {
          width: 100%;
          height: 100%;
          background: var(--ws-accent);
          color: var(--ws-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: 800;
          box-shadow: 0 0 30px var(--ws-accent-glow);
        }
        .ws-edit-avatar-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: var(--ws-accent);
          color: var(--ws-primary);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          transition: 0.3s;
        }
        .ws-edit-avatar-btn:hover { transform: scale(1.1); }
        .ws-member-badge {
          display: inline-block;
          padding: 5px 15px;
          background: var(--ws-accent-soft);
          color: var(--ws-accent);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 2rem;
        }
        .ws-profile-details {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .ws-p-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--ws-text-muted);
          font-size: 0.9rem;
        }
        .ws-perks-card {
          margin-top: 2rem;
          padding: 2rem !important;
        }
        .ws-perks-card h4 { display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; color: var(--ws-accent); }
        .ws-perks-card ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .ws-perks-card li { font-size: 0.85rem; color: var(--ws-text-muted); }

        .ws-tab-header { margin-bottom: 2.5rem; }
        .ws-booking-list { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
          gap: 2.5rem; 
        }
        .ws-booking-item {
          transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          border: 1px solid var(--ws-glass-border);
        }
        .ws-booking-item:hover { 
          transform: translateY(-10px); 
          border-color: var(--ws-accent); 
          box-shadow: 0 20px 40px rgba(0,209,255,0.15);
        }

        .ws-booking-card-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        .ws-booking-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.5s;
        }
        .ws-booking-item:hover .ws-booking-card-image img {
          transform: scale(1.1);
        }
        .ws-booking-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 50%, rgba(0,0,0,0.8));
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 1rem;
        }

        .ws-status-badge-v2 {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          backdrop-filter: blur(10px);
        }
        .ws-status-badge-v2.confirmed { background: rgba(0, 194, 168, 0.2); color: #00c2a8; border: 1px solid rgba(0, 194, 168, 0.4); }
        .ws-status-badge-v2.pending { background: rgba(255, 171, 0, 0.2); color: #ffab00; border: 1px solid rgba(255, 171, 0, 0.4); }
        .ws-status-badge-v2.cancelled { background: rgba(255, 86, 48, 0.2); color: #ff5630; border: 1px solid rgba(255, 86, 48, 0.4); }

        .ws-booking-dates-v2 {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--ws-glass-border);
          border-radius: 12px;
          padding: 12px;
        }
        .ws-date-box { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .ws-date-divider { width: 1px; height: 30px; background: var(--ws-glass-border); margin: 0 15px; }
        .ws-label { font-size: 0.6rem; color: var(--ws-text-muted); font-weight: bold; letter-spacing: 0.5px; }
        .ws-value { font-size: 0.9rem; color: white; font-weight: 600; }

        .ws-booking-arrow-v2 { 
          color: var(--ws-accent); 
          transition: 0.3s;
          filter: drop-shadow(0 0 5px var(--ws-accent-soft));
        }
        .ws-booking-item:hover .ws-booking-arrow-v2 { 
          transform: translateX(5px); 
        }

        .ws-modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .ws-modal-content {
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 3rem !important;
        }
        .ws-modal-close {
          position: absolute; top: 20px; right: 20px;
          background: transparent; border: none; color: white; cursor: pointer;
        }
        .ws-modal-header { margin-bottom: 2.5rem; }
        .ws-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2.5rem; }
        .ws-detail-section h4 { display: flex; align-items: center; gap: 8px; margin-bottom: 1rem; color: var(--ws-accent); font-size: 0.9rem; text-transform: uppercase; }
        .ws-detail-info p { margin-bottom: 8px; font-size: 0.95rem; color: var(--ws-text-muted); }
        .ws-detail-info strong { color: white; }

        .ws-mini-invoice {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--ws-glass-border);
          border-radius: 15px;
          padding: 1.5rem;
        }
        .ws-inv-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: var(--ws-text-muted); }
        .ws-inv-divider { height: 1px; background: var(--ws-glass-border); margin: 15px 0; }
        .ws-inv-total { color: white; font-weight: bold; font-size: 1.1rem; }

        /* Edit Form Styles */
        .ws-edit-form .ws-form-group label {
          display: block;
          margin-bottom: 8px;
          color: var(--ws-text-muted);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .ws-edit-form .ws-form-group input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--ws-glass-border);
          padding: 12px 16px;
          border-radius: 12px;
          color: white;
          outline: none;
          transition: 0.3s;
        }
        .ws-edit-form .ws-form-group input:focus {
          border-color: var(--ws-accent);
          background: rgba(255,255,255,0.08);
        }
        .ws-file-input-wrapper { position: relative; }
        .ws-file-input-wrapper input { opacity: 0; position: absolute; inset: 0; cursor: pointer; }
        .ws-file-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--ws-glass-border);
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          color: white;
          font-size: 0.9rem;
          transition: 0.3s;
        }
        .ws-file-label:hover { background: rgba(255,255,255,0.1); border-color: var(--ws-accent); }

        .ws-cnic-upload-box p { font-size: 0.75rem; color: var(--ws-text-muted); margin-bottom: 8px; text-transform: uppercase; }
        .ws-image-preview {
          height: 150px;
          background: rgba(255,255,255,0.03);
          border: 2px dashed var(--ws-glass-border);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: 0.3s;
        }
        .ws-image-preview:hover { border-color: var(--ws-accent); }
        .ws-image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .ws-image-preview input { opacity: 0; position: absolute; inset: 0; cursor: pointer; z-index: 2; }
        .ws-image-preview label {
          position: absolute;
          bottom: 10px;
          background: rgba(0,0,0,0.6);
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.7rem;
          color: white;
          z-index: 1;
        }

        @media (max-width: 992px) {
          .ws-profile-grid { grid-template-columns: 1fr; }
          .ws-detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
