import { useState, useEffect } from 'react';
import { FiEyeOff, FiTrash2, FiFilter, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminLayout from './AdminLayout';

function StarRating({ rating }) {
  return (
    <div style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <FiStar
          key={i}
          size={14}
          fill={i <= rating ? '#F59E0B' : 'transparent'}
          color={i <= rating ? '#F59E0B' : '#D4CFC5'}
        />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerFilter, setWorkerFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    document.title = 'Reviews | Admin';
    api.get('/admin/workers').then(r => setWorkers(r.data.workers));
    fetchReviews();
  }, []);

  const fetchReviews = async (page = 1, wId = workerFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (wId) params.append('workerId', wId);
      const { data } = await api.get(`/admin/reviews?${params}`);
      setReviews(data.reviews);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load reviews'); }
    setLoading(false);
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await api.put(`/admin/reviews/${id}`);
      toast.success(data.message);
      fetchReviews(pagination.page);
    } catch { toast.error('Failed to toggle'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews(pagination.page);
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Reviews</h1>
        <p>Monitor and manage customer reviews — {pagination.total} total</p>
      </div>

      <div className="admin-filters-bar" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
          <label className="form-label">Filter by Specialist</label>
          <select className="form-control" value={workerFilter} onChange={e => { setWorkerFilter(e.target.value); fetchReviews(1, e.target.value); }}>
            <option value="">All Specialists</option>
            {workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem' }}><div className="spinner" /></div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="admin-desktop-only">
            <div className="data-table-wrap">
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Worker</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Visible</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--secondary)', padding:'3rem' }}>No reviews found</td></tr>
                    ) : reviews.map(r => (
                      <tr key={r._id}>
                        <td style={{ fontWeight:600 }}>{r.user?.fullName || '—'}</td>
                        <td>{r.worker?.name || '—'}</td>
                        <td>
                          <StarRating rating={r.rating} />
                        </td>
                        <td style={{ fontSize:'0.8125rem', maxWidth:280 }}>
                          <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.comment}</div>
                        </td>
                        <td style={{ fontSize:'0.8rem', color:'var(--secondary)' }}>
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                        </td>
                        <td>
                          <span className={`badge ${r.isVisible?'badge-confirmed':'badge-cancelled'}`}>{r.isVisible?'Visible':'Hidden'}</span>
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:'0.375rem' }}>
                            <button onClick={() => handleToggle(r._id)} className="btn btn-ghost btn-sm" title={r.isVisible?'Hide':'Show'}>
                              <FiEyeOff size={13} />
                            </button>
                            <button onClick={() => handleDelete(r._id)} className="btn btn-ghost btn-sm" style={{ color:'var(--danger)' }}>
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile Phone Card View */}
          <div className="admin-mobile-only">
            {reviews.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem 1rem', background: 'white', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: 0, color: 'var(--secondary)' }}>No reviews found</p>
              </div>
            ) : (
              <div className="admin-mobile-cards">
                {reviews.map(r => (
                  <div key={r._id} className="admin-mobile-card">
                    <div className="admin-mobile-card-top">
                      <div>
                        <div className="admin-mobile-card-title">{r.user?.fullName || 'Customer'}</div>
                        <div className="admin-mobile-card-sub">for {r.worker?.name || 'Stylist'}</div>
                      </div>
                      <span className={`badge ${r.isVisible ? 'badge-confirmed' : 'badge-cancelled'}`}>
                        {r.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>

                    <div style={{ marginBottom: '0.625rem' }}>
                      <StarRating rating={r.rating} />
                    </div>

                    <div style={{ background: 'var(--bg-alt)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--primary)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                      "{r.comment}"
                    </div>

                    <div className="admin-mobile-card-row">
                      <span className="label">Date</span>
                      <span className="value">
                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="admin-mobile-card-actions">
                      <button onClick={() => handleToggle(r._id)} className="btn btn-outline btn-sm">
                        <FiEyeOff size={14} /> {r.isVisible ? 'Hide from Web' : 'Make Visible'}
                      </button>
                      <button onClick={() => handleDelete(r._id)} className="btn btn-ghost btn-sm btn-icon-only" style={{ color: 'var(--danger)' }} title="Delete">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination" style={{ marginTop: '1rem', justifyContent: 'center' }}>
              <button className="page-btn" disabled={pagination.page===1} onClick={() => fetchReviews(pagination.page-1)}>←</button>
              {[...Array(pagination.pages)].map((_,i) => <button key={i+1} className={`page-btn${pagination.page===i+1?' active':''}`} onClick={() => fetchReviews(i+1)}>{i+1}</button>)}
              <button className="page-btn" disabled={pagination.page===pagination.pages} onClick={() => fetchReviews(pagination.page+1)}>→</button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
