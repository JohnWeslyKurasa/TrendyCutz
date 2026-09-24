import { useState, useEffect } from 'react';
import { FiSearch, FiPhone } from 'react-icons/fi';
import api from '../../services/api';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    document.title = 'Customers | Admin';
    fetchCustomers();
  }, []);

  const fetchCustomers = async (page = 1, q = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (q) params.append('search', q);
      const { data } = await api.get(`/admin/customers?${params}`);
      setCustomers(data.customers);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load customers'); }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Customers</h1>
        <p>Registered customer accounts — {pagination.total} total</p>
      </div>

      <div style={{ display:'flex', gap:'0.625rem', marginBottom:'1.5rem', flexWrap: 'wrap' }}>
        <div className="input-group" style={{ flex: '1 1 240px', maxWidth: '100%' }}>
          <FiSearch className="input-icon" size={16} />
          <input
            className="form-control"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchCustomers(1, search)}
          />
        </div>
        <button onClick={() => fetchCustomers(1, search)} className="btn btn-primary btn-sm"><FiSearch size={14} /> Search</button>
        {search && <button onClick={() => { setSearch(''); fetchCustomers(1, ''); }} className="btn btn-ghost btn-sm">Clear</button>}
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
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Joined</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--secondary)', padding:'3rem' }}>No customers found</td></tr>
                    ) : customers.map(c => (
                      <tr key={c._id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
                            <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--accent-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'var(--accent-dark)', fontSize:'0.875rem', flexShrink:0 }}>
                              {c.fullName?.charAt(0)}
                            </div>
                            <div style={{ fontWeight:600 }}>{c.fullName}</div>
                          </div>
                        </td>
                        <td style={{ fontSize:'0.875rem' }}>{c.email}</td>
                        <td style={{ fontSize:'0.875rem' }}>{c.phone}</td>
                        <td style={{ fontSize:'0.8rem', color:'var(--secondary)' }}>
                          {new Date(c.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                        </td>
                        <td>
                          <span className={`badge ${c.isActive?'badge-confirmed':'badge-cancelled'}`}>{c.isActive?'Active':'Inactive'}</span>
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
            {customers.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem 1rem', background: 'white', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: 0, color: 'var(--secondary)' }}>No customers found</p>
              </div>
            ) : (
              <div className="admin-mobile-cards">
                {customers.map(c => (
                  <div key={c._id} className="admin-mobile-card">
                    <div className="admin-mobile-card-top">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-dark)', fontSize: '0.9rem', flexShrink: 0 }}>
                          {c.fullName?.charAt(0)}
                        </div>
                        <div>
                          <div className="admin-mobile-card-title">{c.fullName}</div>
                          <div className="admin-mobile-card-sub">{c.email}</div>
                        </div>
                      </div>
                      <span className={`badge ${c.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="admin-mobile-card-row">
                      <span className="label">Phone</span>
                      <span className="value">
                        {c.phone ? (
                          <a href={`tel:${c.phone}`} className="call-pill-btn">
                            <FiPhone size={12} style={{ marginRight: 5 }} /> {c.phone}
                          </a>
                        ) : '—'}
                      </span>
                    </div>
                    <div className="admin-mobile-card-row">
                      <span className="label">Member Since</span>
                      <span className="value">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination" style={{ marginTop: '1rem', justifyContent: 'center' }}>
              <button className="page-btn" disabled={pagination.page===1} onClick={() => fetchCustomers(pagination.page-1)}>←</button>
              {[...Array(pagination.pages)].map((_,i) => <button key={i+1} className={`page-btn${pagination.page===i+1?' active':''}`} onClick={() => fetchCustomers(i+1)}>{i+1}</button>)}
              <button className="page-btn" disabled={pagination.page===pagination.pages} onClick={() => fetchCustomers(pagination.page+1)}>→</button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
