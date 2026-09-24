import { useState, useEffect } from 'react';
import { FiStar, FiFilter } from 'react-icons/fi';
import api from '../services/api';
import { DEMO_REVIEWS, DEMO_WORKERS } from '../services/demoData';
import { Link, useSearchParams } from 'react-router-dom';

export default function Reviews() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWorker = searchParams.get('workerId') || '';

  const [reviews, setReviews] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerFilter, setWorkerFilter] = useState(initialWorker);

  useEffect(() => {
    document.title = 'Reviews | Trendy Cutz';
    api.get('/workers')
      .then(r => {
        if (r.data?.workers?.length > 0) setWorkers(r.data.workers);
        else setWorkers(DEMO_WORKERS);
      })
      .catch(() => setWorkers(DEMO_WORKERS));
  }, []);

  useEffect(() => {
    const currentWorker = searchParams.get('workerId') || '';
    setWorkerFilter(currentWorker);
    fetchReviews(currentWorker);
  }, [searchParams]);

  const fetchReviews = async (wId = '') => {
    setLoading(true);
    try {
      const url = wId ? `/reviews?workerId=${wId}&limit=50` : '/reviews?limit=50';
      const { data } = await api.get(url);
      if (data?.reviews?.length > 0) {
        setReviews(data.reviews);
      } else {
        const fallback = wId ? DEMO_REVIEWS.filter(r => r.worker?._id === wId || r.worker?.name === wId) : DEMO_REVIEWS;
        setReviews(fallback);
      }
    } catch {
      const fallback = wId ? DEMO_REVIEWS.filter(r => r.worker?._id === wId || r.worker?.name === wId) : DEMO_REVIEWS;
      setReviews(fallback);
    }
    setLoading(false);
  };

  const handleFilter = (wId) => {
    setWorkerFilter(wId);
    if (wId) {
      setSearchParams({ workerId: wId });
    } else {
      setSearchParams({});
    }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <>
      <div style={{ background: 'var(--primary)', padding: '7rem 1.5rem 3.5rem', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--accent)' }}>What Clients Say</span>
          <h1 className="heading-lg font-serif" style={{ color: 'white', marginBottom: '1rem' }}>Customer Reviews</h1>
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 700, color: 'var(--accent)' }}>{avg}</div>
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#F59E0B' }}>
                  {[1,2,3,4,5].map(n => (
                    <FiStar key={n} size={18} fill="#F59E0B" />
                  ))}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{reviews.length} Verified Reviews</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filter by worker */}
          {workers.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem', marginRight: '0.5rem' }}>
                <FiFilter size={14} /> Filter by Stylist:
              </div>
              <button onClick={() => handleFilter('')} className={`btn btn-sm ${!workerFilter ? 'btn-primary' : 'btn-ghost'}`} style={{ borderRadius: 'var(--radius-full)' }}>All Stylists</button>
              {workers.map(w => (
                <button key={w._id} onClick={() => handleFilter(w._id)} className={`btn btn-sm ${workerFilter === w._id ? 'btn-primary' : 'btn-ghost'}`} style={{ borderRadius: 'var(--radius-full)' }}>
                  {w.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_,i) => (
                <div key={i} className="review-card">
                  <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem' }}>
                    <div className="skeleton" style={{ width:44, height:44, borderRadius:'50%' }} />
                    <div style={{ flex:1 }}>
                      <div className="skeleton" style={{ height:14, width:'50%', marginBottom:6 }} />
                      <div className="skeleton" style={{ height:12, width:'30%' }} />
                    </div>
                  </div>
                  <div className="skeleton" style={{ height:12, marginBottom:4 }} />
                  <div className="skeleton" style={{ height:12, width:'80%' }} />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiStar size={40} color="var(--accent)" />
              </div>
              <h3>No Reviews Yet</h3>
              <p>Be the first to share your Trendy Cutz experience!</p>
              <Link to="/book" className="btn btn-accent">Book & Review</Link>
            </div>
          ) : (
            <div className="grid-3">
              {reviews.map(r => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{r.user?.fullName?.charAt(0) || 'G'}</div>
                    <div className="review-meta">
                      <div className="review-name">{r.user?.fullName || 'Guest'}</div>
                      <div className="review-date">{new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
                    </div>
                    <div style={{ display:'flex', color:'#F59E0B', gap:'0.2rem' }}>
                      {[1,2,3,4,5].map(n => (
                        <FiStar 
                          key={n} 
                          size={15} 
                          fill={n <= r.rating ? '#F59E0B' : 'none'} 
                          color={n <= r.rating ? '#F59E0B' : 'var(--border)'} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">"{r.comment}"</p>
                  {r.worker && (
                    <div style={{ marginTop: '0.875rem', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>— Service with {r.worker.name}</span>
                      {r.worker.role && <span style={{ color: 'var(--secondary)', fontWeight: 400 }}>({r.worker.role.split('&')[0].trim()})</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
