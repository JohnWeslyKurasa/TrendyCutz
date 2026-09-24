import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiStar, FiUser, FiLogOut, FiEdit2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: n <= value ? '#F59E0B' : '#D4CFC5', transition: 'var(--transition)' }}>★</button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    document.title = 'My Dashboard | Trendy Cutz';
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data.appointments);
    } catch { toast.error('Failed to load appointments'); }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to cancel'); }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim() || reviewForm.comment.length < 10) {
      toast.error('Comment must be at least 10 characters'); return;
    }
    setSubmittingReview(true);
    try {
      await api.post('/reviews', { appointmentId: reviewModal._id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
      fetchAppointments();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
    setSubmittingReview(false);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/me', profileForm);
      updateUser(data.user);
      toast.success('Profile updated!');
      setEditProfile(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    setSavingProfile(false);
  };

  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  const formatTime = (t) => { const [h,m] = t.split(':').map(Number); const p = h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${p}`; };

  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments.filter(a => a.date >= today && ['pending','confirmed'].includes(a.status));
  const past = appointments.filter(a => a.date < today || a.status === 'completed' || a.status === 'cancelled');

  const displayed = tab === 'upcoming' ? upcoming : tab === 'past' ? past : appointments;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '80px' }}>
      {/* Header */}
      <div style={{ background: 'var(--primary)', padding: '2.5rem 1.5rem', color: 'white' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>My Account</span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'white', marginTop: '0.25rem' }}>
              Hello, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/book" className="btn btn-accent btn-sm"><FiCalendar size={14} /> Book Appointment</Link>
            <button onClick={() => { logout(); navigate('/'); toast.success('Logged out'); }} className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)' }}>
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: 960 }}>
        {/* Profile card */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}><FiUser size={16} style={{ marginRight: 8 }} />My Profile</h2>
            <button onClick={() => setEditProfile(!editProfile)} className="btn btn-ghost btn-sm">
              <FiEdit2 size={14} /> {editProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="card-body">
            {editProfile ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: 500 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={profileForm.fullName} onChange={e => setProfileForm(f => ({...f, fullName: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={profileForm.phone} onChange={e => setProfileForm(f => ({...f, phone: e.target.value}))} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <button onClick={handleSaveProfile} className="btn btn-primary btn-sm" disabled={savingProfile}>
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                <div><div className="form-label">Name</div><div style={{ fontWeight: 600 }}>{user?.fullName}</div></div>
                <div><div className="form-label">Email</div><div style={{ fontWeight: 600 }}>{user?.email}</div></div>
                <div><div className="form-label">Phone</div><div style={{ fontWeight: 600 }}>{user?.phone}</div></div>
              </div>
            )}
          </div>
        </div>

        {/* Appointment stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Upcoming', value: upcoming.length, icon: '📅', color: 'var(--info)' },
            { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: '✅', color: 'var(--success)' },
            { label: 'Total Bookings', value: appointments.length, icon: '💇', color: 'var(--accent-dark)' },
          ].map(s => (
            <div key={s.label} className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--secondary)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Appointments */}
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem' }}>My Appointments</h2>
        <div className="tabs">
          <button onClick={() => setTab('upcoming')} className={`tab-btn${tab==='upcoming'?' active':''}`}>Upcoming ({upcoming.length})</button>
          <button onClick={() => setTab('past')} className={`tab-btn${tab==='past'?' active':''}`}>Past</button>
          <button onClick={() => setTab('all')} className={`tab-btn${tab==='all'?' active':''}`}>All</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" /></div>
        ) : displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No Appointments Found</h3>
            <p>Book your first appointment and enjoy a premium salon experience!</p>
            <Link to="/book" className="btn btn-accent">Book Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {displayed.map(a => {
              const d = new Date(a.date + 'T00:00:00');
              return (
                <div key={a._id} className="appt-card">
                  <div className="appt-date-badge">
                    <div className="day">{d.getDate()}</div>
                    <div className="month">{d.toLocaleString('default',{month:'short'})}</div>
                  </div>
                  <div className="appt-info" style={{ flex: 1 }}>
                    <div className="appt-service-name">{a.service?.name}</div>
                    <div className="appt-meta">
                      with {a.worker?.name} · {formatTime(a.time)} · {a.date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <span className={`badge badge-${a.status}`}>{a.status}</span>
                    {['pending','confirmed'].includes(a.status) && a.date >= today && (
                      <button onClick={() => handleCancel(a._id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                        <FiX size={14} /> Cancel
                      </button>
                    )}
                    {a.status === 'completed' && !a.isReviewed && (
                      <button onClick={() => setReviewModal(a)} className="btn btn-accent btn-sm">
                        <FiStar size={14} /> Review
                      </button>
                    )}
                    {a.status === 'completed' && a.isReviewed && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>✓ Reviewed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Leave a Review</h2>
              <button onClick={() => setReviewModal(null)} className="btn btn-ghost btn-icon"><FiX /></button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                  Reviewing: <strong>{reviewModal.service?.name}</strong> with <strong>{reviewModal.worker?.name}</strong>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <StarPicker value={reviewForm.rating} onChange={r => setReviewForm(f => ({...f, rating: r}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  className="form-control"
                  placeholder="Share your experience (at least 10 characters)..."
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({...f, comment: e.target.value}))}
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setReviewModal(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleSubmitReview} className="btn btn-accent" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
