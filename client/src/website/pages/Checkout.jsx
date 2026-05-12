import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../../services/api';
import { 
  HiOutlineCreditCard, HiOutlineShieldCheck, HiOutlineCheckCircle, 
  HiOutlineInformationCircle, HiOutlineLockClosed, HiOutlineArrowLeft
} from 'react-icons/hi';
import { jsPDF } from 'jspdf';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.booking || null;
  
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');
  const [cardData, setCardData] = useState({ name: '', number: '', expiry: '', cvv: '' });

  // Post-Checkout Feedback State
  const [feedback, setFeedback] = useState({ rating: 5, cleanliness: 5, service: 5, comfort: 5, comment: '' });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const submitFeedback = async () => {
    if (!invoice) return;
    setFeedbackLoading(true);
    try {
      await API.post('/feedback', {
        ...feedback,
        guestName: invoice.guestName,
        booking: invoice.booking
      });
      setFeedbackSuccess(true);
      setFeedbackLoading(false);
    } catch (err) {
      console.error('Feedback Error:', err);
      setFeedbackLoading(false);
    }
  };

  const fillDemoCard = () => {
    setCardData({
      name: 'John Doe (Demo)',
      number: '4242 4242 4242 4242',
      expiry: '12 / 28',
      cvv: '123'
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const response = await API.post('/bookings', {
        room: bookingData.room,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        extraServices: bookingData.extraServices,
        totalAmount: bookingData.totalAmount * 1.15 // 15% Tax
      });

      if (response.data.success) {
        // Fetch the dynamic invoice after successful booking
        const bookingId = response.data.booking._id;
        const invoiceRes = await API.get(`/invoices/${bookingId}`);
        
        if (invoiceRes.data.success) {
          setInvoice(invoiceRes.data.invoice);
          setProcessing(false);
          setSuccess(true);
        }
      }
    } catch (err) {
      console.error('Payment Error:', err);
      setError(err.response?.data?.message || 'Reservation could not be finalized. Please try again.');
      setProcessing(false);
    }
  };

  const downloadPDF = () => {
    if (!invoice) return;
    const doc = new jsPDF();
    const margin = 20;
    
    // Luxury Branding
    doc.setFillColor(11, 15, 26); // Dark background
    doc.rect(0, 0, 210, 60, 'F');
    
    doc.setFontSize(26);
    doc.setTextColor(0, 209, 255); // Cyan accent
    doc.text('LUXURYSTAY', margin, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('HOTELS & RESORTS INTERNATIONAL', margin, 42);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('OFFICIAL INVOICE', 130, 38);
    
    // Header Info
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, margin, 75);
    doc.text(`Generated: ${new Date(invoice.generatedAt).toLocaleDateString()}`, margin, 82);
    
    // Client & Stay Info
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, 90, 190, 90);
    
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO', margin, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.guestName, margin, 107);
    doc.text('Royal Member #10293', margin, 114);
    
    doc.setFont('helvetica', 'bold');
    doc.text('STAY DETAILS', 130, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Room: ${invoice.room?.type} (#${invoice.room?.roomNumber})`, 130, 107);
    doc.text(`${new Date(invoice.checkIn).toLocaleDateString()} - ${new Date(invoice.checkOut).toLocaleDateString()}`, 130, 114);
    doc.text(`Duration: ${invoice.nights} Nights`, 130, 121);
    
    // Table Header
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, 135, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', margin + 5, 142);
    doc.text('Amount', 160, 142);
    
    // Table Body
    doc.setFont('helvetica', 'normal');
    let y = 155;
    
    // Room Charges
    doc.text(`${invoice.room?.type} Accommodation`, margin + 5, y);
    doc.text(`Rs. ${invoice.roomCharges.toLocaleString()}`, 160, y);
    y += 10;
    
    // Services
    invoice.services.forEach(s => {
      doc.text(`${s.type}: ${s.description || 'Premium Service'}`, margin + 5, y);
      doc.text(`Rs. ${s.amount.toLocaleString()}`, 160, y);
      y += 10;
    });
    
    // Totals
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
    doc.setTextColor(0, 194, 168); // Success color
    doc.text('Total Paid', 130, y);
    doc.text(`Rs. ${invoice.grandTotal.toLocaleString()}`, 160, y);
    
    // Footer Note
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing LuxuryStay. This is a computer-generated invoice and requires no signature.', 105, 280, { align: 'center' });
    
    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  if (success && invoice) {
    return (
      <div className="ws-checkout-success reveal">
        <div className="ws-container" style={{ padding: '100px 0' }}>
          <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--ws-accent-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--ws-accent)' }}>
                <HiOutlineCheckCircle size={50} />
              </div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Reservation <span className="ws-accent">Confirmed</span></h1>
              <p style={{ color: 'var(--ws-text-muted)' }}>Thank you for choosing LuxuryStay. Your invoice is ready below.</p>
            </div>

            {/* DYNAMIC INVOICE BOX */}
            <div className="ws-dynamic-invoice" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ws-glass-border)', borderRadius: '20px', padding: '2.5rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', borderBottom: '1px solid var(--ws-glass-border)', paddingBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--ws-accent)' }}>LuxuryStay <span style={{ color: 'white' }}>Hotels</span></h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>Elite Square, Penthouse Level<br/>Dubai, UAE</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ fontSize: '1rem', color: 'white' }}>INVOICE</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ws-accent)', fontWeight: 'bold' }}>{invoice.invoiceNumber}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>Date: {new Date(invoice.generatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ws-text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>Billed To</p>
                  <strong style={{ fontSize: '1.1rem', color: 'white' }}>{invoice.guestName}</strong>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ws-text-muted)' }}>Royal Guest Member</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ws-text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>Stay Details</p>
                  <p style={{ fontSize: '0.9rem', color: 'white' }}>{invoice.room?.type} - Room {invoice.room?.roomNumber}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)' }}>{new Date(invoice.checkIn).toLocaleDateString()} - {new Date(invoice.checkOut).toLocaleDateString()} ({invoice.nights} Nights)</p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ws-glass-border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 0', color: 'var(--ws-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Description</th>
                    <th style={{ padding: '12px 0', color: 'var(--ws-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '15px 0', color: 'white' }}>{invoice.room?.type} Accommodation ({invoice.nights} Nights)</td>
                    <td style={{ padding: '15px 0', color: 'white', textAlign: 'right' }}>Rs. {invoice.roomCharges.toLocaleString()}</td>
                  </tr>
                  {invoice.services.map((s, i) => (
                    <tr key={i}>
                      <td style={{ padding: '15px 0', color: 'white' }}>{s.type} - {s.description || 'Premium Service'}</td>
                      <td style={{ padding: '15px 0', color: 'white', textAlign: 'right' }}>Rs. {s.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ borderTop: '1px solid var(--ws-glass-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ws-text-muted)' }}>Subtotal</span>
                  <span style={{ color: 'white' }}>Rs. {invoice.subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ws-text-muted)' }}>Luxury Tax ({invoice.taxRate}%)</span>
                  <span style={{ color: 'white' }}>Rs. {invoice.tax.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '15px 0', borderTop: '2px solid var(--ws-accent-soft)' }}>
                  <strong style={{ fontSize: '1.4rem', color: 'white' }}>Total Amount Paid</strong>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--ws-accent)' }}>Rs. {invoice.grandTotal.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="ws-hero-btns" style={{ justifyContent: 'center', marginTop: '3rem', gap: '1.5rem' }}>
              <button className="ws-btn ws-btn-primary" onClick={downloadPDF}>Download Professional PDF</button>
              <button className="ws-btn ws-btn-outline-white" onClick={() => navigate('/')}>Return to Lobby</button>
            </div>

            {/* POST-CHECKOUT FEEDBACK SECTION - THE GUESTBOOK */}
            <div className="reveal" style={{ marginTop: '5rem', borderTop: '1px solid var(--ws-glass-border)', paddingTop: '5rem' }}>
              {!feedbackSuccess ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="ws-section-tag" style={{ background: 'var(--ws-accent-soft)', color: 'var(--ws-accent)', padding: '6px 15px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Royal Guestbook</span>
                    <h2 style={{ fontSize: '2.8rem', marginTop: '1rem' }}>Your Voice <span className="ws-accent">Matters</span></h2>
                    <p style={{ color: 'var(--ws-text-muted)', marginTop: '0.8rem', maxWidth: '600px', margin: '0.8rem auto 0' }}>Help us refine the future of luxury hospitality by sharing your personal journey with us.</p>
                  </div>
                  
                  <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '4rem', border: '1px solid var(--ws-glass-border)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', fontSize: '15rem', color: 'var(--ws-accent)', opacity: 0.03, pointerEvents: 'none' }}>★</div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                      {[
                        { label: 'Overall Experience', key: 'rating' },
                        { label: 'Pristine Cleanliness', key: 'cleanliness' },
                        { label: 'Staff Excellence', key: 'service' },
                        { label: 'Supreme Comfort', key: 'comfort' }
                      ].map((cat) => (
                        <div key={cat.key} style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--ws-text-muted)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{cat.label}</p>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span 
                                key={s} 
                                onClick={() => setFeedback({...feedback, [cat.key]: s})}
                                style={{ 
                                  cursor: 'pointer', 
                                  fontSize: '1.8rem', 
                                  color: feedback[cat.key] >= s ? 'var(--ws-accent)' : 'rgba(255,255,255,0.08)',
                                  transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  transform: feedback[cat.key] === s ? 'scale(1.2)' : 'scale(1)',
                                  filter: feedback[cat.key] >= s ? 'drop-shadow(0 0 10px var(--ws-accent-soft))' : 'none'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.3)'}
                                onMouseOut={(e) => e.target.style.transform = feedback[cat.key] === s ? 'scale(1.2)' : 'scale(1)'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="ws-form-group" style={{ position: 'relative' }}>
                      <label style={{ display: 'block', marginBottom: '12px', color: 'var(--ws-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Personal Remarks</label>
                      <textarea 
                        placeholder="How can we make your next visit even more extraordinary?" 
                        value={feedback.comment}
                        onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--ws-glass-border)', padding: '2rem', borderRadius: '24px', color: 'white', outline: 'none', resize: 'none', minHeight: '150px', fontSize: '1.1rem', transition: '0.3s' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--ws-accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--ws-glass-border)'}
                      />
                    </div>
                    
                    <button 
                      className="ws-btn ws-btn-primary" 
                      style={{ width: '100%', marginTop: '3rem', justifyContent: 'center', height: '70px', fontSize: '1.2rem' }}
                      onClick={submitFeedback}
                      disabled={feedbackLoading}
                    >
                      {feedbackLoading ? 'Registering your voice...' : 'Seal & Submit Review'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="glass-card reveal" style={{ textAlign: 'center', padding: '5rem', background: 'linear-gradient(rgba(0,209,255,0.05), transparent)', border: '1px solid var(--ws-accent-soft)' }}>
                  <div style={{ width: '100px', height: '100px', background: 'var(--ws-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--ws-primary)', boxShadow: '0 0 30px var(--ws-accent-soft)' }}>
                    <HiOutlineCheckCircle size={60} />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Gratitude, <span className="ws-accent">{invoice.guestName.split(' ')[0]}</span></h2>
                  <p style={{ color: 'var(--ws-text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>Your feedback has been transmitted to our executive board. We look forward to welcoming you back soon.</p>
                  <button className="ws-btn ws-btn-outline-white" onClick={() => navigate('/guest-feedback')}>View Guestbook</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ws-checkout-page">
      <section className="ws-page-banner reveal" style={{ padding: '100px 0', textAlign: 'center' }}>
        <span className="ws-section-tag">Secure Payment</span>
        <h1 style={{ fontSize: '3.5rem' }}>Finalize Your <span className="ws-accent">Stay</span></h1>
      </section>

      <div className="ws-container ws-section">
        <div className="ws-checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '4rem' }}>
          
          <div className="reveal">
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}><HiOutlineCreditCard /> Payment Method</h3>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                <button 
                  className={`ws-btn ${method === 'card' ? 'ws-btn-primary' : 'ws-btn-outline-white'}`} 
                  onClick={() => setMethod('card')}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Credit / Debit Card
                </button>
                <button 
                  className={`ws-btn ${method === 'crypto' ? 'ws-btn-primary' : 'ws-btn-outline-white'}`} 
                  onClick={() => setMethod('crypto')}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cryptocurrency
                </button>
              </div>

              <form onSubmit={handlePayment}>
                {method === 'card' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={fillDemoCard} style={{ background: 'var(--ws-accent-soft)', color: 'var(--ws-accent)', border: '1px solid var(--ws-accent)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>Use Demo Card</button>
                    </div>
                    <div className="ws-form-group">
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Cardholder Name</label>
                      <input type="text" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value})} placeholder="John Doe" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                    </div>
                    <div className="ws-form-group">
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Card Number</label>
                      <div style={{ position: 'relative' }}>
                        <input type="text" value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})} placeholder="**** **** **** ****" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none', paddingLeft: '45px' }} />
                        <HiOutlineLockClosed style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-muted)' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div className="ws-form-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Expiry Date</label>
                        <input type="text" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})} placeholder="MM / YY" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                      </div>
                      <div className="ws-form-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>CVV</label>
                        <input type="password" value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value})} placeholder="***" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--ws-glass-border)', borderRadius: '16px' }}>
                    <p style={{ marginBottom: '1.5rem' }}>Connect your wallet to pay with BTC, ETH, or USDT.</p>
                    <button type="button" className="ws-btn ws-btn-outline-white">Connect Web3 Wallet</button>
                  </div>
                )}

                <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '1rem', background: 'rgba(0,209,255,0.05)', borderRadius: '12px', border: '1px solid var(--ws-accent-soft)' }}>
                  <HiOutlineShieldCheck size={24} color="var(--ws-accent)" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)' }}>Your payment is secured with 256-bit military-grade encryption. LuxuryStay never stores your full card details.</p>
                </div>

                <button type="submit" className="ws-btn ws-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem', height: '60px', fontSize: '1.1rem' }} disabled={processing}>
                  {processing ? 'Processing Securely...' : `Pay Total Amount`}
                </button>
              </form>
            </div>
          </div>

          <div className="reveal" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card" style={{ position: 'sticky', top: '120px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Booking Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ws-text-muted)' }}>Guest Name</span>
                  <strong>{bookingData?.guestName || 'Elite Guest'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ws-text-muted)' }}>Room Selection</span>
                  <strong>{bookingData?.roomType || 'Panoramic Suite'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ws-text-muted)' }}>Duration</span>
                  <strong>{bookingData?.nights || 3} Nights</strong>
                </div>
                <div style={{ margin: '1rem 0', borderTop: '1px solid var(--ws-glass-border)', paddingTop: '1rem' }}>
                  {bookingData?.extraServices?.length > 0 && (
                    <div style={{ padding: '10px 0', borderTop: '1px dashed var(--ws-glass-border)' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', marginBottom: '5px' }}>Luxury Add-ons:</p>
                      {bookingData.extraServices.map((e, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span>{e.name}</span>
                          <span>Rs. {e.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', borderTop: '1px solid var(--ws-glass-border)', paddingTop: '10px' }}>
                    <span>Subtotal</span>
                    <span>Rs. {bookingData?.totalAmount?.toLocaleString() || '75,000'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                    <span>Luxury Tax (15%)</span>
                    <span>Rs. {Math.round((bookingData?.totalAmount || 75000) * 0.15).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', marginTop: '1rem' }}>
                    <span>Total</span>
                    <strong className="ws-accent">Rs. {((bookingData?.totalAmount || 75000) * 1.15).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
              <button className="ws-btn ws-btn-ghost" onClick={() => navigate(-1)} style={{ width: '100%', marginTop: '1rem' }}><HiOutlineArrowLeft /> Modify Reservation</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
