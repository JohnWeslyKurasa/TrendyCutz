import { useState, useEffect } from 'react';
import { FiEye, FiX, FiPhone, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminLayout from './AdminLayout';

const STATUSES = ['pending', 'under_review', 'shortlisted', 'rejected', 'hired'];

export default function AdminHiring() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  const DEFAULT_APPLICATIONS = [
    {
      _id: 'app_1',
      applicationId: 'TC-APP-54219',
      fullName: 'Ramesh Kumar',
      phone: '+91 98480 99881',
      email: 'ramesh.stylist@gmail.com',
      age: 27,
      location: 'Kukatpally, Hyderabad',
      position: 'Hair Stylist',
      experience: '5 years',
      skills: 'Skin fades, Beard contouring, Scissor texturing',
      previousSalonExperience: 'Yes',
      previousEmployer: 'Javed Habib Salon',
      expectedSalary: '₹32,000/month',
      availableToJoin: 'Immediately',
      status: 'pending',
      createdAt: '2026-09-23T11:00:00Z'
    },
    {
      _id: 'app_2',
      applicationId: 'TC-APP-78324',
      fullName: 'Sunita Rao',
      phone: '+91 98480 77665',
      email: 'sunita.beauty@outlook.com',
      age: 25,
      location: 'Miyapur, Hyderabad',
      position: 'Beauty Specialist',
      experience: '3 years',
      skills: 'Hydra facial, Organic peel, Threading, Skin therapy',
      previousSalonExperience: 'Yes',
      previousEmployer: 'Naturals Salon',
      expectedSalary: '₹28,000/month',
      availableToJoin: 'Within 2 weeks',
      status: 'under_review',
      createdAt: '2026-09-22T15:30:00Z'
    }
  ];

  useEffect(() => {
    document.title = 'Hiring | Admin';
    fetchApplications();
  }, []);

  const fetchApplications = async (page = 1, sf = statusFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (sf) params.append('status', sf);
      const { data } = await api.get(`/admin/hiring?${params}`);
      if (data?.applications?.length > 0) {
        setApplications(data.applications);
        setPagination(data.pagination);
      } else {
        fallbackLocalApps(sf);
      }
    } catch {
      fallbackLocalApps(sf);
    }
    setLoading(false);
  };

  const fallbackLocalApps = (sf) => {
    try {
      const stored = JSON.parse(localStorage.getItem('tc_hiring_applications') || '[]');
      const all = [...stored, ...DEFAULT_APPLICATIONS];
      const filtered = sf ? all.filter(a => a.status === sf) : all;
      setApplications(filtered);
      setPagination({ page: 1, pages: 1, total: filtered.length });
    } catch {
      setApplications(DEFAULT_APPLICATIONS);
      setPagination({ page: 1, pages: 1, total: DEFAULT_APPLICATIONS.length });
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/admin/hiring/${id}`, { status, adminNotes: notes });
      toast.success('Application updated');
      setSelected(prev => ({ ...prev, status, adminNotes: notes }));
      fetchApplications(pagination.page);
    } catch {
      // Update in local state & localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('tc_hiring_applications') || '[]');
        const updated = stored.map(a => a._id === id || a.applicationId === id ? { ...a, status, adminNotes: notes } : a);
        localStorage.setItem('tc_hiring_applications', JSON.stringify(updated));
      } catch {}
      setApplications(prev => prev.map(a => a._id === id || a.applicationId === id ? { ...a, status, adminNotes: notes } : a));
      setSelected(prev => ({ ...prev, status, adminNotes: notes }));
      toast.success('Application updated');
    }
    setUpdating(false);
  };

  const statusColor = (s) => ({ pending:'badge-pending', under_review:'badge-under_review', shortlisted:'badge-confirmed', rejected:'badge-cancelled', hired:'badge-hired' }[s] || 'badge-pending');

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Hiring Requests</h1>
        <p>Manage job applications — {pagination.total} total</p>
      </div>

      {/* Horizontal Scrollable Status Tabs */}
      <div style={{ display:'flex', gap:'0.375rem', marginBottom:'1.5rem', overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => { setStatusFilter(''); fetchApplications(1, ''); }} className={`btn btn-sm ${!statusFilter?'btn-primary':'btn-ghost'}`} style={{ borderRadius:'var(--radius-full)', whiteSpace: 'nowrap' }}>All</button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); fetchApplications(1, s); }}
            className={`btn btn-sm ${statusFilter===s?'btn-primary':'btn-ghost'}`}
            style={{ borderRadius:'var(--radius-full)', textTransform:'capitalize', whiteSpace: 'nowrap' }}>
            {s.replace('_',' ')}
          </button>
        ))}
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
                      <th>ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Position</th>
                      <th>Experience</th>
                      <th>Salary Exp.</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr><td colSpan={9} style={{ textAlign:'center', color:'var(--secondary)', padding:'3rem' }}>No applications found</td></tr>
                    ) : applications.map(a => (
                      <tr key={a._id}>
                        <td style={{ fontFamily:'monospace', fontSize:'0.8rem', fontWeight:700, color:'var(--accent-dark)' }}>{a.applicationId}</td>
                        <td>
                          <div style={{ fontWeight:600 }}>{a.fullName}</div>
                          <div style={{ fontSize:'0.75rem', color:'var(--secondary)' }}>{a.email}</div>
                        </td>
                        <td>{a.phone}</td>
                        <td>{a.position}</td>
                        <td>{a.experience}y</td>
                        <td style={{ fontSize:'0.875rem' }}>₹{a.expectedSalary}</td>
                        <td style={{ fontSize:'0.8rem', color:'var(--secondary)' }}>
                          {new Date(a.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                        </td>
                        <td><span className={`badge ${statusColor(a.status)}`}>{a.status.replace('_',' ')}</span></td>
                        <td>
                          <button onClick={() => { setSelected(a); setNotes(a.adminNotes||''); }} className="btn btn-ghost btn-sm">
                            <FiEye size={13} /> View
                          </button>
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
            {applications.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem 1rem', background: 'white', borderRadius: 'var(--radius-md)' }}>
                <p style={{ margin: 0, color: 'var(--secondary)' }}>No applications found</p>
              </div>
            ) : (
              <div className="admin-mobile-cards">
                {applications.map(a => (
                  <div key={a._id} className="admin-mobile-card">
                    <div className="admin-mobile-card-top">
                      <span className="admin-id-badge">{a.applicationId}</span>
                      <span className={`badge ${statusColor(a.status)}`}>{a.status.replace('_', ' ')}</span>
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                      <div className="admin-mobile-card-title">{a.fullName}</div>
                      <div className="admin-mobile-card-sub">{a.position}</div>
                      {a.phone && (
                        <div style={{ marginTop: 4 }}>
                          <a href={`tel:${a.phone}`} className="call-pill-btn">
                            <FiPhone size={12} style={{ marginRight: 5 }} /> {a.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="admin-mobile-card-row">
                      <span className="label">Experience</span>
                      <span className="value">{a.experience} years</span>
                    </div>
                    <div className="admin-mobile-card-row">
                      <span className="label">Expected Salary</span>
                      <span className="value">₹{a.expectedSalary}</span>
                    </div>
                    <div className="admin-mobile-card-row">
                      <span className="label">Applied Date</span>
                      <span className="value">
                        {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="admin-mobile-card-actions">
                      <button onClick={() => { setSelected(a); setNotes(a.adminNotes||''); }} className="btn btn-primary btn-sm">
                        <FiEye size={14} /> View Application
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination" style={{ marginTop: '1rem', justifyContent: 'center' }}>
              <button className="page-btn" disabled={pagination.page===1} onClick={() => fetchApplications(pagination.page-1)}>←</button>
              {[...Array(pagination.pages)].map((_,i) => <button key={i+1} className={`page-btn${pagination.page===i+1?' active':''}`} onClick={() => fetchApplications(i+1)}>{i+1}</button>)}
              <button className="page-btn" disabled={pagination.page===pagination.pages} onClick={() => fetchApplications(pagination.page+1)}>→</button>
            </div>
          )}
        </>
      )}

      {/* Application Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application: {selected.applicationId}</h2>
              <button onClick={() => setSelected(null)} className="btn btn-ghost btn-icon"><FiX /></button>
            </div>
            <div className="modal-body" style={{ maxHeight:'70vh', overflowY:'auto' }}>
              <div className="responsive-form-grid" style={{ marginBottom:'1.5rem' }}>
                {[
                  ['Name', selected.fullName],
                  ['Phone', selected.phone],
                  ['Email', selected.email],
                  ['Age', selected.age],
                  ['Location', selected.location],
                  ['Position', selected.position],
                  ['Experience', `${selected.experience} years`],
                  ['Expected Salary', `₹${selected.expectedSalary}`],
                  ['Available From', selected.availableToJoin],
                  ['Previous Employer', selected.previousEmployer || '—'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--secondary)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>{label}</div>
                    <div style={{ fontWeight:500, fontSize:'0.9rem' }}>{val}</div>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label" style={{ textTransform:'uppercase', fontSize:'0.75rem', letterSpacing:'0.05em' }}>Skills</label>
                <div style={{ background:'var(--bg-alt)', padding:'0.75rem', borderRadius:'var(--radius-sm)', fontSize:'0.875rem' }}>{selected.skills}</div>
              </div>
              {selected.previousSalonExperience && (
                <div className="form-group">
                  <label className="form-label" style={{ textTransform:'uppercase', fontSize:'0.75rem', letterSpacing:'0.05em' }}>Previous Experience</label>
                  <div style={{ background:'var(--bg-alt)', padding:'0.75rem', borderRadius:'var(--radius-sm)', fontSize:'0.875rem' }}>{selected.previousSalonExperience}</div>
                </div>
              )}
              {selected.portfolioUrl && (
                <div className="form-group">
                  <label className="form-label">Portfolio</label>
                  <a href={selected.portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">{selected.portfolioUrl}</a>
                </div>
              )}
              {selected.resume && (
                <div className="form-group">
                  <label className="form-label">Resume</label>
                  <a href={`http://localhost:5000${selected.resume}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <FiFileText size={14} style={{ marginRight: 5 }} /> View Resume
                  </a>
                </div>
              )}
              <div className="divider" />
              <div className="form-group">
                <label className="form-label">Update Status</label>
                <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => handleUpdateStatus(selected._id, s)} disabled={updating || selected.status===s}
                      className={`btn btn-sm ${selected.status===s?'btn-primary':'btn-ghost'}`}
                      style={{ textTransform:'capitalize', borderRadius:'var(--radius-full)' }}>
                      {s.replace('_',' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Admin Notes</label>
                <textarea className="form-control" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add internal notes..." />
              </div>
              <button onClick={() => handleUpdateStatus(selected._id, selected.status)} className="btn btn-primary btn-sm" disabled={updating}>
                {updating ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
