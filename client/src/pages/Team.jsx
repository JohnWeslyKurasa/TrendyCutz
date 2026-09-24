import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiCalendar } from 'react-icons/fi';
import api from '../services/api';

export default function Team() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Our Team | Trendy Cutz';
    api.get('/workers').then(r => { setWorkers(r.data.workers); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <div style={{ background: 'var(--primary)', padding: '7rem 1.5rem 3.5rem', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--accent)' }}>The Professionals</span>
          <h1 className="heading-lg font-serif" style={{ color: 'white', marginBottom: '1rem' }}>Our Team</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto' }}>
            Meet the talented professionals who will make you look and feel your absolute best.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="grid-4">
              {[...Array(4)].map((_,i) => (
                <div key={i} className="card" style={{ height: 380 }}>
                  <div className="skeleton" style={{ height: 240 }} />
                  <div className="card-body">
                    <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-4">
              {workers.map(w => (
                <div key={w._id} className="worker-card">
                  <div className="worker-photo-wrap">
                    <div className="worker-avatar">{w.name.charAt(0)}</div>
                  </div>
                  <div className="worker-card-body">
                    <h3>{w.name}</h3>
                    <div className="worker-role">{w.role}</div>
                    <div className="worker-spec">{w.specialization}</div>
                    {w.bio && <p style={{ fontSize: '0.8125rem', color: 'var(--secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>{w.bio}</p>}
                    <div className="worker-stats">
                      <div className="worker-stat">
                        <div className="worker-stat-value">{w.experience}y</div>
                        <div className="worker-stat-label">Exp.</div>
                      </div>
                      <div className="worker-stat">
                        <div className="worker-stat-value">{w.completedAppointments}</div>
                        <div className="worker-stat-label">Done</div>
                      </div>
                      <Link to={`/reviews?workerId=${w._id}`} className="worker-stat" style={{ cursor: 'pointer' }} title="View Reviews">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <span className="worker-stat-value">{w.rating.average || '–'}</span>
                          <FiStar size={12} color="#F59E0B" fill="#F59E0B" />
                        </div>
                        <div className="worker-stat-label">Rating ({w.rating.count || 0})</div>
                      </Link>
                    </div>
                    {w.services?.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginBottom: '0.375rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Services</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                          {w.services.slice(0,4).map(s => (
                            <span key={s._id} style={{ fontSize: '0.7rem', background: 'var(--accent-light)', color: 'var(--accent-dark)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {w.workingDays.map(d => (
                        <span key={d} style={{ fontSize: '0.65rem', background: 'var(--bg-alt)', color: 'var(--secondary)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                          {d.slice(0,3)}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Link to={`/book?worker=${w._id}`} className="btn btn-primary w-full">
                        <FiCalendar size={14} />
                        Book with {w.name.split(' ')[0]}
                      </Link>
                      <Link to={`/reviews?workerId=${w._id}`} className="btn btn-outline btn-sm w-full" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                        View Client Reviews ({w.rating.count || 0})
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
