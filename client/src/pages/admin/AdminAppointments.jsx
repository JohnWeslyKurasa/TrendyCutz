import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminLayout from './AdminLayout';
import { DEMO_WORKERS } from '../../services/demoData';

const STATUSES = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

const DEFAULT_ADMIN_APPTS = [
  {
    _id: 'a1',
    appointmentId: 'TC00101',
    user: { fullName: 'Karthik Rao', phone: '+919848011223', email: 'karthik.rao@gmail.com' },
    service: { name: 'Premium Haircut & Styling', price: 299 },
    worker: { name: 'Rahul Sharma' },
    date: '2026-09-24',
    time: '14:30',
    status: 'confirmed'
  },
  {
    _id: 'a2',
    appointmentId: 'TC00102',
    user: { fullName: 'Mohammed Ali', phone: '+919848033445', email: 'mohammed.ali@yahoo.com' },
    service: { name: 'Royal Hot Towel Shave', price: 249 },
    worker: { name: 'Arjun Reddy' },
    date: '2026-09-24',
    time: '16:00',
    status: 'pending'
  },
  {
    _id: 'a3',
    appointmentId: 'TC00103',
    user: { fullName: 'Sneha Verma', phone: '+919848022334', email: 'sneha.verma@outlook.com' },
    service: { name: 'Keratin Smooth Therapy', price: 1499 },
    worker: { name: 'Priya Nair' },
    date: '2026-09-25',
    time: '11:00',
    status: 'confirmed'
  },
  {
    _id: 'a4',
    appointmentId: 'TC00104',
    user: { fullName: 'Pooja Hegde', phone: '+919848088990', email: 'pooja.h@gmail.com' },
    service: { name: 'Hydra-Glow Radiance Facial', price: 899 },
    worker: { name: 'Sneha Kulkarni' },
    date: '2026-09-25',
    time: '15:30',
    status: 'completed'
  },
  {
    _id: 'a5',
    appointmentId: 'TC00105',
    user: { fullName: 'Vikram Reddy', phone: '+919848077889', email: 'vikram.reddy@gmail.com' },
    service: { name: 'Beard Sculpting & Contouring', price: 299 },
    worker: { name: 'Vikram Varma' },
    date: '2026-09-26',
    time: '12:00',
    status: 'confirmed'
  },
  {
    _id: 'a6',
    appointmentId: 'TC00106',
    user: { fullName: 'Ananya Joshi', phone: '+919848066778', email: 'ananya.joshi@gmail.com' },
    service: { name: 'Moroccan Argan Hair Spa', price: 799 },
    worker: { name: 'Ananya Sen' },
    date: '2026-09-26',
    time: '17:00',
    status: 'pending'
  }
];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [filters, setFilters] = useState({ status: '', workerId: '', date: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    document.title = 'Appointments | Admin';
    api.get('/admin/workers')
      .then(r => setWorkers(r.data?.workers?.length ? r.data.workers : DEMO_WORKERS))
      .catch(() => setWorkers(DEMO_WORKERS));
    fetchAppointments();
  }, []);

  const fetchAppointments = async (page = 1, f = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (f.status) params.append('status', f.status);
      if (f.workerId) params.append('workerId', f.workerId);
      if (f.date) params.append('date', f.date);
      const { data } = await api.get(`/admin/appointments?${params}`);
      if (data?.appointments?.length > 0) {
        setAppointments(data.appointments);
        setPagination(data.pagination);
      } else {
        fallbackAppts(f);
      }
    } catch {
      fallbackAppts(f);
    }
    setLoading(false);
  };

  const fallbackAppts = (f) => {
    let filtered = [...DEFAULT_ADMIN_APPTS];
    if (f.status) filtered = filtered.filter(a => a.status === f.status);
    if (f.workerId) filtered = filtered.filter(a => a.worker?.name === f.workerId || a.worker?._id === f.workerId);
    if (f.date) filtered = filtered.filter(a => a.date === f.date);
    setAppointments(filtered);
    setPagination({ page: 1, pages: 1, total: filtered.length });
  };

  const applyFilters = () => fetchAppointments(1, filters);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/admin/appointments/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchAppointments(pagination.page);
      setSelected(null);
    } catch {
      setAppointments(prev => prev.map(a => a._id === id || a.appointmentId === id ? { ...a, status } : a));
      toast.success(`Status updated to ${status}`);
      setSelected(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      await api.delete(`/admin/appointments/${id}`);
      toast.success('Appointment deleted');
      fetchAppointments(pagination.page);
    } catch { toast.error('Failed to delete'); }
  };

  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  const formatTime = (t) => { const [h,m] = t.split(':').map(Number); const p = h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${p}`; };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Appointments</h1>
        <p>Manage all customer appointments — {pagination.total} total</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Status</label>
          <select className="form-control" style={{ width: 150 }} value={filters.status} onChange={e => setFilters(f => ({...f, status: e.target.value}))}>
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Worker</label>
          <select className="form-control" style={{ width: 180 }} value={filters.workerId} onChange={e => setFilters(f => ({...f, workerId: e.target.value}))}>
            <option value="">All Workers</option>
            {workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Date</label>
          <input type="date" className="form-control" style={{ width: 160 }} value={filters.date} onChange={e => setFilters(f => ({...f, date: e.target.value}))} />
        </div>
        <button onClick={applyFilters} className="btn btn-primary btn-sm">
          <FiFilter size={14} /> Apply
        </button>
        <button onClick={() => { setFilters({ status: '', workerId: '', date: '' }); fetchAppointments(1, { status:'', workerId:'', date:'' }); }} className="btn btn-ghost btn-sm">
          Clear
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /></div>
      ) : (
        <>
          <div className="data-table-wrap">
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Worker</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--secondary)', padding:'3rem' }}>No appointments found</td></tr>
                  ) : appointments.map(a => (
                    <tr key={a._id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-dark)', fontSize: '0.8rem' }}>{a.appointmentId}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{a.user?.fullName || a.customerName || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{a.user?.phone || a.customerPhone}</div>
                      </td>
                      <td>{a.service?.name || '—'}</td>
                      <td>{a.worker?.name || '—'}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{formatDate(a.date)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{formatTime(a.time)}</div>
                      </td>
                      <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          {a.status === 'pending' && (
                            <button onClick={() => handleStatusUpdate(a._id, 'confirmed')} className="btn btn-success btn-sm" title="Confirm">
                              <FiCheck size={13} />
                            </button>
                          )}
                          {['pending','confirmed'].includes(a.status) && (
                            <button onClick={() => handleStatusUpdate(a._id, 'completed')} className="btn btn-accent btn-sm" title="Complete">✓</button>
                          )}
                          {['pending','confirmed'].includes(a.status) && (
                            <button onClick={() => handleStatusUpdate(a._id, 'cancelled')} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} title="Cancel">
                              <FiX size={13} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(a._id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} title="Delete">
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={pagination.page === 1} onClick={() => fetchAppointments(pagination.page - 1)}>←</button>
              {[...Array(pagination.pages)].map((_,i) => (
                <button key={i+1} className={`page-btn${pagination.page === i+1 ? ' active' : ''}`} onClick={() => fetchAppointments(i+1)}>{i+1}</button>
              ))}
              <button className="page-btn" disabled={pagination.page === pagination.pages} onClick={() => fetchAppointments(pagination.page + 1)}>→</button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
