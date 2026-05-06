// AIAssistant.jsx - Yeh page AI ke zariye rooms aur hotel search karne ke liye hai
import { useState } from 'react';
import API from '../services/api';
import { HiOutlineLightBulb, HiSearch, HiOutlineInformationCircle } from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';

const AIAssistant = () => {
  const [query, setQuery] = useState(''); // User ka sawal
  const [result, setResult] = useState(null); // AI ka jawab
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ============ SEARCH HANDLE KARNE KA FUNCTION ============
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      // Backend API ko call karna natural language query ke saath
      const res = await API.get(`/ai/search?query=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'AI ko samajh nahi aaya, thora mazeed detail dein.');
    } finally {
      setLoading(false);
    }
  };

  // Example chips par click karne se search hona
  const quickSearch = (q) => {
    setQuery(q);
    // Timeout taake state update ho jaye phir search chale
    setTimeout(() => {
      document.getElementById('ai-search-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <div className="ai-assistant-page">
      <div className="page-header">
        <div><h1>Smart AI Assistant</h1><p className="page-subtitle">Natural language mein hotel ka data search karein</p></div>
      </div>

      {/* AI Input Card */}
      <div className="ai-search-card card">
        <div className="ai-search-header">
          <HiOutlineLightBulb className="ai-bulb-icon" />
          <div><h3>Aap kya dhundna chahte hain?</h3><p>Room types, availability, ya guest details ke baare mein poochein.</p></div>
        </div>

        <form id="ai-search-form" onSubmit={handleSearch} className="ai-search-form">
          <div className="ai-input-wrapper">
            <HiSearch className="search-icon" />
            <input className="ai-input" placeholder="e.g. 'Show me deluxe rooms' ya 'Check availability of room 101'..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Searching...' : 'Ask AI'}</button>
        </form>

        <div className="example-queries">
          <p className="example-label">Examples:</p>
          <div className="example-chips">
            {['Show deluxe rooms', 'Room 101 status', 'Total available rooms', 'List all guests'].map((q) => (
              <button key={q} className="chip" onClick={() => quickSearch(q)}>{q}</button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* AI Results Display */}
      {result && (
        <div className="ai-results">
          {/* Summary Section */}
          <div className="ai-summary-card card">
            <div className="ai-message"><p>{result.message}</p></div>
          </div>

          {/* Room Data Table (Agar data aaya hai) */}
          {result.data && result.data.length > 0 && (
            <div className="card">
              <div className="card-header"><h3>Found Results ({result.count})</h3></div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr><th>Room #</th><th>Type</th><th>Price</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {result.data.map((room) => (
                      <tr key={room._id}>
                        <td><strong>{room.roomNumber}</strong></td>
                        <td>{room.type}</td>
                        <td>Rs. {room.price?.toLocaleString()}</td>
                        <td><StatusBadge status={room.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Information Tip */}
      {!result && !loading && (
        <div className="ai-tip" style={{textAlign:'center',marginTop:'40px',opacity:0.6}}>
          <HiOutlineInformationCircle size={32} style={{color:'var(--accent)',marginBottom:'10px'}} />
          <p>AI aapke keywords (deluxe, available, room number) ko scan karta hai taake sahi data dikhaye.</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
