import { useState, useEffect } from 'react';
import { FiEyeOff, FiTrash2, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminLayout from './AdminLayout';

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

      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', alignItems:'flex-end' }}>
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">Filter by Worker</label>
          <select className="form-control" style={{ width:200 }} value={workerFilter} onChange={e => { setWorkerFilter(e.target.value); fetchReviews(1, e.target.value); }}>
            <option value="">All Workers</option>
            {workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'4rem' }}><div className="spinner" /></div>
      ) : (
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
                      <div style={{ color:'#F59E0B', fontSize:'1rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
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
          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={pagination.page===1} onClick={() => fetchReviews(pagination.page-1)}>←</button>
              {[...Array(pagination.pages)].map((_,i) => <button key={i+1} className={`page-btn${pagination.page===i+1?' active':''}`} onClick={() => fetchReviews(i+1)}>{i+1}</button>)}
              <button className="page-btn" disabled={pagination.page===pagination.pages} onClick={() => fetchReviews(pagination.page+1)}>→</button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
