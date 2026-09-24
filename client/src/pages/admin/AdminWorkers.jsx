import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminLayout from './AdminLayout';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function WorkerModal({ worker, services, onClose, onSave }) {
  const [form, setForm] = useState(worker || {
    name:'', role:'', specialization:'', experience:'', bio:'',
    workingHours: {start:'08:00', end:'21:00'},
    breakTime: {start:'13:00', end:'14:00'},
    workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    services: [], slotDuration: 30, isActive: true
  });
  const [saving, setSaving] = useState(false);

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      workingDays: f.workingDays.includes(day) ? f.workingDays.filter(d => d !== day) : [...f.workingDays, day]
    }));
  };

  const toggleService = (id) => {
    setForm(f => ({
      ...f,
      services: f.services?.includes(id) ? f.services.filter(s => s !== id) : [...(f.services || []), id]
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.role) { toast.error('Name and role required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('role', form.role);
      fd.append('specialization', form.specialization || '');
      fd.append('experience', form.experience || 0);
      fd.append('bio', form.bio || '');
      fd.append('slotDuration', form.slotDuration || 30);
      fd.append('workingDays', JSON.stringify(form.workingDays));
      fd.append('workingHours', JSON.stringify(form.workingHours));
      fd.append('breakTime', JSON.stringify(form.breakTime));
      fd.append('services', JSON.stringify(form.services || []));
      fd.append('isActive', form.isActive);
      if (worker?._id) {
        await api.put(`/workers/${worker._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Worker updated!');
      } else {
        await api.post('/workers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Worker added!');
      }
      onSave();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{worker ? 'Edit Worker' : 'Add Worker'}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><FiX /></button>
        </div>
        <div className="modal-body responsive-form-grid">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-control" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <input className="form-control" value={form.role} onChange={e => setForm(f=>({...f,role:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input className="form-control" value={form.specialization} onChange={e => setForm(f=>({...f,specialization:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Experience (years)</label>
            <input type="number" className="form-control" value={form.experience} onChange={e => setForm(f=>({...f,experience:e.target.value}))} min={0} />
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Bio</label>
            <textarea className="form-control" rows={2} value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Working Hours Start</label>
            <input type="time" className="form-control" value={form.workingHours?.start} onChange={e => setForm(f=>({...f,workingHours:{...f.workingHours,start:e.target.value}}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Working Hours End</label>
            <input type="time" className="form-control" value={form.workingHours?.end} onChange={e => setForm(f=>({...f,workingHours:{...f.workingHours,end:e.target.value}}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Break Start</label>
            <input type="time" className="form-control" value={form.breakTime?.start} onChange={e => setForm(f=>({...f,breakTime:{...f.breakTime,start:e.target.value}}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Break End</label>
            <input type="time" className="form-control" value={form.breakTime?.end} onChange={e => setForm(f=>({...f,breakTime:{...f.breakTime,end:e.target.value}}))} />
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Slot Duration (minutes)</label>
            <select className="form-control" value={form.slotDuration} onChange={e => setForm(f=>({...f,slotDuration:parseInt(e.target.value)}))}>
              {[15,20,30,45,60].map(d => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn:'1/-1' }}>
            <label className="form-label">Working Days</label>
            <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
              {DAYS.map(d => (
                <button key={d} type="button" onClick={() => toggleDay(d)}
                  className={`btn btn-sm ${form.workingDays?.includes(d) ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius:'var(--radius-full)', fontSize:'0.75rem', padding:'4px 12px' }}>
                  {d.slice(0,3)}
                </button>
              ))}
            </div>
          </div>
          {services.length > 0 && (
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label className="form-label">Services</label>
              <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                {services.map(s => {
                  const sId = s._id;
                  const selected = form.services?.some(x => (x._id||x) === sId);
                  return (
                    <button key={sId} type="button" onClick={() => toggleService(sId)}
                      className={`btn btn-sm ${selected ? 'btn-accent' : 'btn-ghost'}`}
                      style={{ borderRadius:'var(--radius-full)', fontSize:'0.75rem', padding:'4px 12px' }}>
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Worker'}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | workerObj

  useEffect(() => {
    document.title = 'Workers | Admin';
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [w, s] = await Promise.all([api.get('/admin/workers'), api.get('/admin/services')]);
      setWorkers(w.data.workers);
      setServices(s.data.services);
    } catch { toast.error('Failed to load'); }
    setLoading(false);
  };

  const handleToggle = async (w) => {
    try {
      const fd = new FormData();
      fd.append('isActive', !w.isActive);
      fd.append('name', w.name);
      fd.append('role', w.role);
      fd.append('workingDays', JSON.stringify(w.workingDays));
      await api.put(`/workers/${w._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(`Worker ${!w.isActive ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch { toast.error('Failed to toggle'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this worker?')) return;
    try {
      await api.delete(`/workers/${id}`);
      toast.success('Worker deleted');
      fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Workers & Stylists</h1>
        <p>Manage your salon team members and their availability.</p>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems: 'center', marginBottom:'1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>{workers.length} Total Specialists</span>
        <button onClick={() => setModal('add')} className="btn btn-primary btn-sm">
          <FiPlus size={16} /> Add Worker
        </button>
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
                      <th>Role</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Rating</th>
                      <th>Completed</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map(w => (
                      <tr key={w._id}>
                        <td style={{ fontWeight: 600 }}>{w.name}</td>
                        <td>{w.role}</td>
                        <td style={{ fontSize: '0.8125rem' }}>{w.specialization}</td>
                        <td>{w.experience}y</td>
                        <td>{w.rating.average ? `${w.rating.average} / 5` : '–'}</td>
                        <td>{w.completedAppointments}</td>
                        <td>
                          <span className={`badge ${w.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}>
                            {w.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:'0.375rem' }}>
                            <button onClick={() => setModal(w)} className="btn btn-ghost btn-sm" title="Edit"><FiEdit2 size={13} /></button>
                            <button onClick={() => handleToggle(w)} className="btn btn-ghost btn-sm" title={w.isActive ? 'Deactivate' : 'Activate'}>
                              {w.isActive ? <FiToggleRight size={16} color="var(--success)" /> : <FiToggleLeft size={16} color="var(--secondary)" />}
                            </button>
                            <button onClick={() => handleDelete(w._id)} className="btn btn-ghost btn-sm" style={{ color:'var(--danger)' }} title="Delete"><FiTrash2 size={13} /></button>
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
              {workers.map(w => (
                <div key={w._id} className="admin-mobile-card">
                  <div className="admin-mobile-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <div className="admin-mobile-card-title">{w.name}</div>
                        <div className="admin-mobile-card-sub">{w.role}</div>
                      </div>
                    </div>
                    <span className={`badge ${w.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}>
                      {w.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="admin-mobile-card-row">
                    <span className="label">Specialization</span>
                    <span className="value">{w.specialization || 'General Styling'}</span>
                  </div>
                  <div className="admin-mobile-card-row">
                    <span className="label">Experience</span>
                    <span className="value">{w.experience} years</span>
                  </div>
                  <div className="admin-mobile-card-row">
                    <span className="label">Rating & Completed</span>
                    <span className="value">{w.rating.average ? `${w.rating.average} / 5` : 'No ratings yet'} · {w.completedAppointments || 0} done</span>
                  </div>

                  <div className="admin-mobile-card-actions">
                    <button onClick={() => setModal(w)} className="btn btn-outline btn-sm">
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleToggle(w)} className={`btn btn-sm ${w.isActive ? 'btn-ghost' : 'btn-success'}`} style={{ border: '1px solid var(--border)' }}>
                      {w.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(w._id)} className="btn btn-ghost btn-sm btn-icon-only" style={{ color: 'var(--danger)' }} title="Delete">
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
        <WorkerModal
          worker={modal === 'add' ? null : modal}
          services={services}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetchData(); }}
        />
      )}
    </AdminLayout>
  );
}
