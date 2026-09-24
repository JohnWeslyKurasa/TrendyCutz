import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminLayout from './AdminLayout';

const CATEGORIES = ['Hair','Beard','Beauty','Spa','Other'];

function ServiceModal({ service, workers, onClose, onSave }) {
  const [form, setForm] = useState(service || { name:'', category:'Hair', description:'', price:'', duration:'', isActive:true, availableWorkers:[] });
  const [saving, setSaving] = useState(false);

  const toggleWorker = (id) => {
    setForm(f => ({
      ...f,
      availableWorkers: f.availableWorkers?.includes(id) ? f.availableWorkers.filter(w => w !== id) : [...(f.availableWorkers||[]), id]
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) { toast.error('Name, price, duration required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('description', form.description || '');
      fd.append('price', form.price);
      fd.append('duration', form.duration);
      fd.append('isActive', form.isActive);
      fd.append('availableWorkers', JSON.stringify(form.availableWorkers || []));
      if (service?._id) {
        await api.put(`/services/${service._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Service updated!');
      } else {
        await api.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Service created!');
      }
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{service ? 'Edit Service' : 'Add Service'}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><FiX /></button>
        </div>
        <div className="modal-body responsive-form-grid">
          <div className="form-group" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Service Name *</label>
            <input className="form-control" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Price (₹) *</label>
            <input type="number" className="form-control" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (minutes) *</label>
            <input type="number" className="form-control" value={form.duration} onChange={e => setForm(f=>({...f,duration:e.target.value}))} min={5} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-control" value={form.isActive} onChange={e => setForm(f=>({...f,isActive:e.target.value==='true'}))}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
          </div>
          {workers.length > 0 && (
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label className="form-label">Available Workers</label>
              <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                {workers.map(w => {
                  const wId = w._id;
                  const sel = form.availableWorkers?.some(x => (x._id||x) === wId);
                  return (
                    <button key={wId} type="button" onClick={() => toggleWorker(wId)}
                      className={`btn btn-sm ${sel?'btn-primary':'btn-ghost'}`}
                      style={{ borderRadius:'var(--radius-full)', fontSize:'0.75rem', padding:'4px 12px' }}>
                      {w.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Service'}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    document.title = 'Services | Admin';
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, w] = await Promise.all([api.get('/admin/services'), api.get('/admin/workers')]);
      setServices(s.data.services);
      setWorkers(w.data.workers);
    } catch { toast.error('Failed to load'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Services</h1>
        <p>Manage salon services, pricing, and availability.</p>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems: 'center', marginBottom:'1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>{services.length} Total Services</span>
        <button onClick={() => setModal('add')} className="btn btn-primary btn-sm"><FiPlus size={16} /> Add Service</button>
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
                      <th>Category</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Workers</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(s => (
                      <tr key={s._id}>
                        <td style={{ fontWeight:600 }}>{s.name}</td>
                        <td><span className="badge badge-confirmed">{s.category}</span></td>
                        <td style={{ fontWeight:700 }}>₹{s.price}</td>
                        <td>{s.duration} min</td>
                        <td style={{ fontSize:'0.8rem' }}>{s.availableWorkers?.map(w=>w.name?.split(' ')[0]).join(', ') || '—'}</td>
                        <td><span className={`badge ${s.isActive?'badge-confirmed':'badge-cancelled'}`}>{s.isActive?'Active':'Inactive'}</span></td>
                        <td>
                          <div style={{ display:'flex', gap:'0.375rem' }}>
                            <button onClick={() => setModal(s)} className="btn btn-ghost btn-sm" title="Edit"><FiEdit2 size={13} /></button>
                            <button onClick={() => handleDelete(s._id)} className="btn btn-ghost btn-sm" style={{ color:'var(--danger)' }} title="Delete"><FiTrash2 size={13} /></button>
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
            <div className="admin-mobile-cards">
              {services.map(s => (
                <div key={s._id} className="admin-mobile-card">
                  <div className="admin-mobile-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-confirmed" style={{ fontSize: '0.72rem' }}>{s.category}</span>
                      <span className="admin-mobile-card-title">{s.name}</span>
                    </div>
                    <span className={`badge ${s.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="admin-mobile-card-row">
                    <span className="label">Price & Duration</span>
                    <span className="value" style={{ color: 'var(--accent-dark)', fontSize: '0.95rem' }}>₹{s.price} · {s.duration} mins</span>
                  </div>
                  <div className="admin-mobile-card-row">
                    <span className="label">Assigned Specialists</span>
                    <span className="value">{s.availableWorkers?.map(w => w.name?.split(' ')[0]).join(', ') || 'All Stylists'}</span>
                  </div>
                  {s.description && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--secondary)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                      "{s.description}"
                    </div>
                  )}

                  <div className="admin-mobile-card-actions">
                    <button onClick={() => setModal(s)} className="btn btn-outline btn-sm">
                      <FiEdit2 size={14} /> Edit Service
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="btn btn-ghost btn-sm btn-icon-only" style={{ color: 'var(--danger)' }} title="Delete">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {modal && (
        <ServiceModal
          service={modal === 'add' ? null : modal}
          workers={workers}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetchData(); }}
        />
      )}
    </AdminLayout>
  );
}
