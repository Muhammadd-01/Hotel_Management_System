import { useState } from 'react';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock, HiOutlineChatAlt } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Contact = () => {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      document.getElementById('auth-notice').classList.add('open');
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="ws-contact-page">
      <section className="ws-page-banner reveal" style={{ padding: '150px 0', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <span className="ws-section-tag">Global Presence</span>
        <h1 style={{ fontSize: '4.5rem' }}>Get In <span className="ws-accent">Touch</span></h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--ws-text-muted)', fontSize: '1.2rem' }}>Whether it's a reservation inquiry or a partnership proposal, we're here to assist you 24/7.</p>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '5rem' }}>
            
            {/* Contact Details */}
            <div className="reveal">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Connect With <span className="ws-accent">Excellence</span></h2>
              <p style={{ color: 'var(--ws-text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>Experience the legendary hospitality of LuxuryStay. Reach out through any of our channels below.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--ws-accent-soft)', border: '1px solid var(--ws-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ws-accent)', flexShrink: 0 }}><HiOutlineLocationMarker size={28} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Global Headquarters</h4>
                    <p style={{ color: 'var(--ws-text-muted)' }}>123 Luxury Avenue, Crystal Heights, PC 54000, Paradise City</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--ws-accent-soft)', border: '1px solid var(--ws-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ws-accent)', flexShrink: 0 }}><HiOutlinePhone size={28} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Direct Concierge</h4>
                    <p style={{ color: 'var(--ws-text-muted)' }}>+92 300 1234567 (International)</p>
                    <p style={{ color: 'var(--ws-text-muted)' }}>+92 42 12345678 (Local)</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--ws-accent-soft)', border: '1px solid var(--ws-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ws-accent)', flexShrink: 0 }}><HiOutlineMail size={28} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Digital Inquiries</h4>
                    <p style={{ color: 'var(--ws-text-muted)' }}>concierge@luxurystay.com</p>
                    <p style={{ color: 'var(--ws-text-muted)' }}>events@luxurystay.com</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--ws-accent-soft)', border: '1px solid var(--ws-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ws-accent)', flexShrink: 0 }}><HiOutlineClock size={28} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Service Hours</h4>
                    <p style={{ color: 'var(--ws-text-muted)' }}>Front Desk: 24/7/365</p>
                    <p style={{ color: 'var(--ws-text-muted)' }}>Management: Mon-Fri (9AM-6PM)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <div className="glass-card" style={{ padding: '3rem' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Send Us a <span className="ws-accent">Message</span></h3>
                {submitted && <div style={{ background: 'var(--ws-accent-soft)', color: 'var(--ws-accent)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--ws-accent)' }}>✅ Your message has been encrypted and sent to our concierge team. We will respond within 60 minutes.</div>}
                
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="ws-form-group">
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Full Name</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Elite Traveler" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                    </div>
                    <div className="ws-form-group">
                      <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Email Address</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="traveler@luxury.com" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Inquiry Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }}>
                      <option value="">-- Choose Subject --</option>
                      <option value="reservation">Room Reservation</option>
                      <option value="event">Private Event / Wedding</option>
                      <option value="business">Corporate Partnership</option>
                      <option value="feedback">General Inquiry</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '2.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ws-text-muted)' }}>Your Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows="6" placeholder="How can we make your journey unforgettable?" required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ws-glass-border)', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none', resize: 'none' }}></textarea>
                  </div>
                  <button type="submit" className="ws-btn ws-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <HiOutlineChatAlt /> Send Secure Message
                  </button>
                </form>
              </div>
            </div>

          </div>

          {/* Interactive Map Area */}
          <div className="reveal" style={{ marginTop: '8rem', animationDelay: '0.4s' }}>
            <div style={{ borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--ws-glass-border)', height: '500px', position: 'relative' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.9415936946987!2d74.34629731511699!3d31.520370281385566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjMiTiA3NMKwMjAnNTUuNSJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                allowFullScreen
                loading="lazy"
                title="LuxuryStay Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
