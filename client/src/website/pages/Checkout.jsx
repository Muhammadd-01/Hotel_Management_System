import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineCreditCard, HiOutlineShieldCheck, HiOutlineCheckCircle, 
  HiOutlineInformationCircle, HiOutlineLockClosed, HiOutlineArrowLeft
} from 'react-icons/hi';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.booking || null;
  
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setProcessing(true);
    // Mock payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2500);
  };

  if (success) {
    return (
      <div className="ws-checkout-success reveal">
        <div className="ws-container" style={{ padding: '150px 0', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', background: 'var(--ws-accent-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--ws-accent)' }}>
            <HiOutlineCheckCircle size={60} />
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Payment <span className="ws-accent">Successful</span></h1>
          <p style={{ color: 'var(--ws-text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>Your luxury escape is now fully confirmed. Check your email for the digital key and itinerary.</p>
          <div className="ws-hero-btns" style={{ justifyContent: 'center' }}>
            <button className="ws-btn ws-btn-primary" onClick={() => navigate('/dashboard')}>Go to My Panel</button>
            <button className="ws-btn ws-btn-outline-white" onClick={() => navigate('/')}>Back to Home</button>
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
                    <div className="ws-form-group">
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Cardholder Name</label>
                      <input type="text" placeholder="John Doe" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                    </div>
                    <div className="ws-form-group">
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Card Number</label>
                      <div style={{ position: 'relative' }}>
                        <input type="text" placeholder="**** **** **** ****" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none', paddingLeft: '45px' }} />
                        <HiOutlineLockClosed style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-muted)' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div className="ws-form-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Expiry Date</label>
                        <input type="text" placeholder="MM / YY" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                      </div>
                      <div className="ws-form-group">
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>CVV</label>
                        <input type="password" placeholder="***" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                    <span>Subtotal</span>
                    <span>Rs. {bookingData?.totalAmount?.toLocaleString() || '75,000'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                    <span>Luxury Tax (5%)</span>
                    <span>Rs. {((bookingData?.totalAmount || 75000) * 0.05).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', marginTop: '1rem' }}>
                    <span>Total</span>
                    <strong className="ws-accent">Rs. {((bookingData?.totalAmount || 75000) * 1.05).toLocaleString()}</strong>
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
