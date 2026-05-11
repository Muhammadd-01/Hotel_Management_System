import { 
  HiOutlineSparkles, HiOutlineHeart, HiOutlineLightningBolt, 
  HiOutlineShieldCheck, HiOutlineGlobe, HiOutlineClock,
  HiOutlineUserGroup, HiOutlineCamera, HiOutlineMusicNote
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Amenities = () => {
  const amenities = [
    { icon: '🏊‍♂️', title: 'Infinity Sky Pool', desc: 'A breathtaking rooftop pool with temperature control and panoramic views of the entire city skyline. Open 24/7 for our guests.' },
    { icon: '🧖‍♀️', title: 'Ethereal Wellness Spa', desc: 'Immerse yourself in tranquility. Our spa offers personalized holistic treatments, crystal healing, and traditional therapy.' },
    { icon: '🍽️', title: 'Michelin Star Dining', desc: 'Three distinct world-class restaurants led by award-winning chefs, offering a journey through global flavors.' },
    { icon: '💪', title: 'Elite Fitness Center', desc: 'Equipped with the latest AI-driven fitness gear, personal biometric tracking, and world-class personal trainers.' },
    { icon: '🏢', title: 'Smart Business Hub', desc: 'Future-proof meeting rooms with holographic projection technology and ultra-high-speed neural connectivity.' },
    { icon: '🚗', title: 'Autonomous Valet', desc: 'Seamless, secure, and instant valet services. Your vehicle is always ready when you are.' },
    { icon: '👶', title: 'Royal Kids Club', desc: 'A curated safe space for young explorers with educational AI games, creative workshops, and supervised play.' },
    { icon: '🧹', title: 'Smart Housekeeping', desc: 'Precision cleaning using eco-friendly nanotechnology. Your sanctuary is maintained at perfection 24/7.' }
  ];

  return (
    <div className="ws-amenities">
      <section className="ws-page-banner reveal" style={{ padding: '150px 0', textAlign: 'center', background: 'linear-gradient(rgba(11,15,26,0.85), rgba(11,15,26,0.85)), url("https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1200&q=80") center/cover fixed' }}>
        <span className="ws-section-tag">World Class Facilities</span>
        <h1 style={{ fontSize: '4.5rem' }}>Ethereal <span className="ws-accent">Amenities</span></h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>Beyond luxury. Experience the pinnacle of modern comfort and innovation.</p>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          <div className="ws-features-grid">
            {amenities.map((a, i) => (
              <div key={i} className="glass-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px var(--ws-accent))' }}>{a.icon}</div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'white' }}>{a.title}</h3>
                <p style={{ color: 'var(--ws-text-muted)', fontSize: '1rem' }}>{a.desc}</p>
                <Link to="/contact" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--ws-accent)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>Enquire Service →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Experiences */}
      <section className="ws-section" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="ws-container">
          <div className="ws-section-header reveal">
            <span className="ws-section-tag">Bespoke Moments</span>
            <h2>Signature <span className="ws-accent">Experiences</span></h2>
            <p>Our concierge team curates exclusive moments that go beyond the ordinary.</p>
          </div>
          <div className="ws-features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            <div className="glass-card reveal" style={{ padding: 0, overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" alt="Jazz" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '2rem' }}>
                <div style={{ color: 'var(--ws-accent)', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '8px' }}>WEEKLY EVENT</div>
                <h3>Midnight Jazz Soirée</h3>
                <p style={{ color: 'var(--ws-text-muted)', margin: '12px 0 20px' }}>Experience soulful jazz performances every Saturday night at the Rooftop Crystal Bar.</p>
                <Link to="/contact" className="ws-btn ws-btn-outline-white" style={{ width: '100%', justifyContent: 'center' }}>Reserve a Table</Link>
              </div>
            </div>
            <div className="glass-card reveal" style={{ padding: 0, overflow: 'hidden', animationDelay: '0.1s' }}>
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" alt="Dining" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '2rem' }}>
                <div style={{ color: 'var(--ws-accent)', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '8px' }}>PRIVATE DINING</div>
                <h3>Epicurean Journey</h3>
                <p style={{ color: 'var(--ws-text-muted)', margin: '12px 0 20px' }}>A private 12-course tasting menu curated specifically for your palate by our Executive Chef.</p>
                <Link to="/contact" className="ws-btn ws-btn-outline-white" style={{ width: '100%', justifyContent: 'center' }}>Book Experience</Link>
              </div>
            </div>
            <div className="glass-card reveal" style={{ padding: 0, overflow: 'hidden', animationDelay: '0.2s' }}>
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80" alt="Spa" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              <div style={{ padding: '2rem' }}>
                <div style={{ color: 'var(--ws-accent)', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '8px' }}>WELLNESS</div>
                <h3>The Zenith Ritual</h3>
                <p style={{ color: 'var(--ws-text-muted)', margin: '12px 0 20px' }}>A full-day immersive wellness ritual including meditation, hydrotherapy, and a private spa suite.</p>
                <Link to="/contact" className="ws-btn ws-btn-outline-white" style={{ width: '100%', justifyContent: 'center' }}>Enquire Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Card */}
      <section className="ws-section">
        <div className="ws-container">
          <div className="glass-card reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="ws-section-tag">Smart Hospitality</span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>AI-Powered <span className="ws-accent">Concierge</span></h2>
              <p style={{ color: 'var(--ws-text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>Our proprietary "Aura" AI assistant is integrated into every room. Simply speak to adjust lighting, order room service, or book local experiences instantly.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}><HiOutlineLightningBolt color="var(--ws-accent)" /> Voice Control</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}><HiOutlineShieldCheck color="var(--ws-accent)" /> 24/7 Support</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}><HiOutlineHeart color="var(--ws-accent)" /> Personalization</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}><HiOutlineClock color="var(--ws-accent)" /> Instant Response</div>
              </div>
            </div>
            <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ws-glass-border)' }}>
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80" alt="AI Concierge" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Amenities;
