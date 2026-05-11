import { useState } from 'react';

const Gallery = () => {
  const images = [
    { src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80', caption: 'Heritage Exterior', category: 'exterior' },
    { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80', caption: 'The Royal Suite', category: 'suites' },
    { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', caption: 'Panoramic Deluxe', category: 'suites' },
    { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', caption: 'Executive Suite', category: 'suites' },
    { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', caption: 'Rooftop Infinity Pool', category: 'wellness' },
    { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80', caption: 'Ethereal Spa', category: 'wellness' },
    { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', caption: 'Azure Restaurant', category: 'dining' },
    { src: 'https://images.unsplash.com/photo-1590490360182-c33d955c4644?w=800&q=80', caption: 'Grand Crystal Lobby', category: 'exterior' },
    { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', caption: 'The Presidential Wing', category: 'suites' },
    { src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', caption: 'Twilight View', category: 'exterior' },
    { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80', caption: 'Marble Bathroom', category: 'suites' },
    { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', caption: 'The Velvet Lounge', category: 'dining' },
  ];

  const [filter, setFilter] = useState('all');
  const [activeImg, setActiveImg] = useState(null);

  const filteredImages = filter === 'all' ? images : images.filter(i => i.category === filter);

  return (
    <div className="ws-gallery">
      <section className="ws-page-banner reveal" style={{ padding: '150px 0', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <span className="ws-section-tag">Visual Journey</span>
        <h1 style={{ fontSize: '4.5rem' }}>The <span className="ws-accent">Gallery</span></h1>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--ws-text-muted)' }}>Witness the elegance of LuxuryStay through our lens. Every corner tells a story of perfection.</p>
      </section>

      <section className="ws-section">
        <div className="ws-container">
          <div className="reveal" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
            {['all', 'exterior', 'suites', 'wellness', 'dining'].map(cat => (
              <button 
                key={cat} 
                className={`ws-btn ${filter === cat ? 'ws-btn-primary' : 'ws-btn-outline-white'}`} 
                onClick={() => setFilter(cat)}
                style={{ padding: '10px 25px', fontSize: '0.85rem' }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="ws-gallery-masonry" style={{ display: 'columns', columnCount: 3, columnGap: '2rem' }}>
            {filteredImages.map((img, i) => (
              <div 
                key={i} 
                className="reveal" 
                style={{ 
                  animationDelay: `${i * 0.1}s`, 
                  marginBottom: '2rem', 
                  breakInside: 'avoid', 
                  position: 'relative', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  border: '1px solid var(--ws-glass-border)'
                }}
                onClick={() => setActiveImg(img)}
              >
                <img 
                  src={img.src} 
                  alt={img.caption} 
                  style={{ width: '100%', display: 'block', transition: 'transform 0.5s ease' }} 
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 60%, rgba(0,0,0,0.8))', display: 'flex', alignItems: 'flex-end', padding: '2rem', opacity: 0, transition: '0.3s' }} onMouseOver={(e) => e.target.style.opacity = 1} onMouseOut={(e) => e.target.style.opacity = 0}>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox placeholder */}
      {activeImg && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }} onClick={() => setActiveImg(null)}>
          <button style={{ position: 'absolute', top: '40px', right: '40px', background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}>×</button>
          <img src={activeImg.src} alt={activeImg.caption} style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '16px', boxShadow: '0 0 50px rgba(0,209,255,0.3)' }} />
          <div style={{ position: 'absolute', bottom: '40px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem' }}>{activeImg.caption}</h3>
            <p style={{ color: 'var(--ws-accent)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '8px' }}>{activeImg.category}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
