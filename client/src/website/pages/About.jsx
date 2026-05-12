import { useState, useEffect } from 'react';
import API from '../../services/api';
import { HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineGlobe, HiOutlineLightBulb, HiOutlineStar, HiOutlineClock, HiOutlineOfficeBuilding, HiOutlineKey, HiOutlineBadgeCheck } from 'react-icons/hi';

const About = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await API.get('/staff/public');
        if (res.data.success) {
          setStaff(res.data.staff);
        }
      } catch (err) {
        console.error('Staff fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="ws-about">
      <section className="ws-page-banner reveal">
        <div className="ws-hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80" 
            alt="Luxury Architecture"
            className="ws-hero-image-element"
          />
          <div className="ws-hero-gradient-overlay"></div>
        </div>
        <div className="ws-container">
          <span className="ws-section-tag">Since 1998</span>
          <h1 style={{ fontSize: '4.5rem' }}>A Legacy of <span className="ws-accent">Excellence</span></h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>Where timeless heritage meets the future of luxury hospitality.</p>
        </div>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div className="reveal">
              <div className="glass-card" style={{ padding: '10px', borderRadius: '32px', border: '1px solid var(--ws-accent)' }}>
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" alt="Hotel Story" style={{ width: '100%', borderRadius: '24px', filter: 'grayscale(0.3) contrast(1.1)' }} />
              </div>
            </div>
            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <span className="ws-section-tag">Our Vision</span>
              <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Redefining the <span className="ws-accent">Human</span> Experience</h2>
              <p style={{ marginBottom: '1.5rem', color: 'var(--ws-text-muted)', fontSize: '1.1rem' }}>LuxuryStay was founded with a singular purpose: to create a sanctuary where every guest feels like royalty. Our journey began over two decades ago, and today, we stand as a beacon of luxury in the heart of the city.</p>
              <p style={{ marginBottom: '2.5rem', color: 'var(--ws-text-muted)', fontSize: '1.1rem' }}>By integrating cutting-edge AI technology with traditional hospitality values, we provide a stay that is not just comfortable, but truly transformative. From personalized climate control to an AI concierge that anticipates your needs, we are the pioneers of smart luxury.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 className="ws-accent" style={{ fontSize: '2rem' }}>25+</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)' }}>Years of Heritage</p>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 className="ws-accent" style={{ fontSize: '2rem' }}>15</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)' }}>Global Locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ws-section" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="ws-container">
          <div className="ws-section-header reveal">
            <span className="ws-section-tag">Our Philosophy</span>
            <h2>Core <span className="ws-accent">Values</span></h2>
          </div>
          <div className="ws-features-grid">
            {[
              { icon: <HiOutlineShieldCheck />, title: 'Absolute Privacy', desc: 'Discretion is our hallmark. We employ elite security protocols to protect your stay and data.' },
              { icon: <HiOutlineOfficeBuilding />, title: 'Global Standards', desc: 'Consistent luxury across all locations, maintaining the highest international hospitality benchmarks.' },
              { icon: <HiOutlineKey />, title: 'Innovation', desc: 'Pioneering smart-hotel technology to create seamless, intuitive, and efficient environments.' },
              { icon: <HiOutlineBadgeCheck />, title: 'Excellence', desc: 'Committed to perfection in every detail, from the thread count of our linens to the taste of our coffee.' }
            ].map((v, i) => (
              <div key={i} className="glass-card reveal" style={{ animationDelay: `${i * 0.1}s`, textAlign: 'center' }}>
                <div className="ws-feature-icon" style={{ margin: '0 auto 1.5rem' }}>{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-section-header reveal">
            <span className="ws-section-tag">The Leaders</span>
            <h2>Our <span className="ws-accent">Team</span></h2>
            <p>Meet the dedicated professionals who make every stay at LuxuryStay unforgettable.</p>
          </div>
          <div className="ws-features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {staff.length > 0 ? staff.map((p, i) => (
              <div key={i} className="glass-card reveal" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--ws-accent-soft)', border: '1px solid var(--ws-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ws-accent)', textTransform: 'uppercase' }}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{p.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--ws-accent)', textTransform: 'capitalize' }}>{p.role}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', marginTop: '8px' }}>{p.email}</p>
              </div>
            )) : !loading && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px' }}>
                <p style={{ color: 'var(--ws-text-muted)' }}>The leadership team is currently in a strategy meeting. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
