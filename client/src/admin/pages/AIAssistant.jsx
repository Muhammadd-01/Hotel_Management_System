// AIAssistant.jsx - Search hotel data using natural language queries powered by AI
import { useState } from 'react';
import API from '../../services/api';
import { HiOutlineLightBulb, HiSearch, HiOutlineInformationCircle } from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';

const AIAssistant = () => {
  const [query, setQuery] = useState(''); // User query state
  const [result, setResult] = useState(null); // AI response state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ============ HANDLE SEARCH EXECUTION ============
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      // Call backend API with natural language query
      const res = await API.get(`/ai/search?query=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "AI couldn't process that. Please provide more specific details.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger search from quick example chips
  const quickSearch = (q) => {
    setQuery(q);
    // Timeout ensuring state update before form submission
    setTimeout(() => {
      const form = document.getElementById('ai-search-form');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <div className="ai-assistant-page">
      <div className="page-header">
        <div><h1>Smart AI Assistant</h1><p className="page-subtitle">Search hotel records using natural language</p></div>
      </div>

      {/* AI Query Input Interface */}
      <div className="ai-search-card card">
        <div className="ai-search-header">
          <HiOutlineLightBulb className="ai-bulb-icon" />
          <div><h3>How can I assist you today?</h3><p>Ask about room types, availability, guest details, or operational stats.</p></div>
        </div>

        <form id="ai-search-form" onSubmit={handleSearch} className="ai-search-form">
          <div className="ai-input-wrapper">
            <HiSearch className="search-icon" />
            <input className="ai-input" placeholder="e.g. 'Show me deluxe rooms' or 'Check status of room 101'..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Analyzing...' : 'Ask AI'}</button>
        </form>

        <div className="example-queries">
          <p className="example-label">Try these examples:</p>
          <div className="example-chips">
            {['Show deluxe rooms', 'Room 101 status', 'Total available rooms', 'List all guests'].map((q) => (
              <button key={q} className="chip" onClick={() => quickSearch(q)}>{q}</button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* AI Dynamic Results Section */}
      {result && (
        <div className="ai-results">
          {/* AI Narrative Summary */}
          <div className="ai-summary-card card">
            <div className="ai-message"><p>{result.message}</p></div>
          </div>

          {/* Structured Data Results */}
          {result.data && result.data.length > 0 && (
            <div className="card">
              <div className="card-header"><h3>Found Records ({result.count})</h3></div>
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

      {/* Instructional Tip */}
      {!result && !loading && (
        <div className="ai-tip" style={{textAlign:'center',marginTop:'40px',opacity:0.6}}>
          <HiOutlineInformationCircle size={32} style={{color:'var(--accent)',marginBottom:'10px'}} />
          <p>The AI engine scans keywords like room type, status, and numbers to provide accurate real-time data.</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
