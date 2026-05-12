import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  HiOutlineUserCircle, HiOutlineMail, HiOutlinePhone, 
  HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineCreditCard,
  HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineLogout,
  HiOutlineX, HiOutlineArrowRight, HiOutlineInformationCircle
} from 'react-icons/hi';
import { jsPDF } from 'jspdf';
import API from '../../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [fetchingInvoice, setFetchingInvoice] = useState(false);

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
    if (user) fetchMyBookings();
  }, [user]);

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
                <div className="ws-profile-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h3>{user.name}</h3>
                <span className="ws-member-badge">Royal Member</span>
                
                <div className="ws-profile-details">
                  <div className="ws-p-item">
                    <HiOutlineMail /> <span>{user.email}</span>
                  </div>
                  <div className="ws-p-item">
                    <HiOutlinePhone /> <span>+92 300 1234567</span>
                  </div>
                  <div className="ws-p-item">
                    <HiOutlineLocationMarker /> <span>Islamabad, Pakistan</span>
                  </div>
                </div>

                <button onClick={logout} className="ws-btn ws-btn-outline-white ws-btn-full" style={{ marginTop: '2rem' }}>
                  <HiOutlineLogout /> Sign Out
                </button>
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
        .ws-profile-avatar {
          width: 100px;
          height: 100px;
          background: var(--ws-accent);
          color: var(--ws-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 auto 1.5rem;
          box-shadow: 0 0 30px var(--ws-accent-glow);
        }
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

        @media (max-width: 992px) {
          .ws-profile-grid { grid-template-columns: 1fr; }
          .ws-detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
