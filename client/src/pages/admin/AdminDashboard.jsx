import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiStar, FiBriefcase, FiTrendingUp, FiCheck } from 'react-icons/fi';
import api from '../../services/api';
import AdminLayout from './AdminLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentAppts, setRecentAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard | Trendy Cutz';
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/appointments?limit=5')
    ]).then(([s, a]) => {
      setStats(s.data.stats);
      setRecentAppts(a.data.appointments);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label: "Today's Appointments", value: stats.todayAppointments, icon: FiCalendar, color: 'blue' },
    { label: 'Upcoming', value: stats.upcomingAppointments, icon: FiTrendingUp, color: 'gold' },
    { label: 'Completed', value: stats.completedAppointments, icon: FiCheck, color: 'green' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: FiUsers, color: 'purple' },
    { label: 'Active Workers', value: stats.totalWorkers, icon: FiUsers, color: 'accent' },
    { label: 'Pending Hiring', value: stats.pendingHiring, icon: FiBriefcase, color: 'red' },
    { label: 'Total Reviews', value: stats.totalReviews, icon: FiStar, color: 'gold' },
    { label: 'Avg Rating', value: stats.avgRating ? `${stats.avgRating}★` : '–', icon: FiStar, color: 'gold' },
  ] : [];

  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short' });
  const formatTime = (t) => { const [h,m] = t.split(':').map(Number); const p = h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${p}`; };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening at Trendy Cutz today.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /></div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="stats-grid">
            {STAT_CARDS.map(s => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.color}`}><s.icon size={20} /></div>
                <div className="stat-info">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Appointments */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Recent Appointments</h2>
              <Link to="/admin/appointments" className="btn btn-ghost btn-sm">View All →</Link>
            </div>
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
                    </tr>
                  </thead>
                  <tbody>
                    {recentAppts.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--secondary)', padding: '2rem' }}>No appointments yet</td></tr>
                    ) : recentAppts.map(a => (
                      <tr key={a._id}>
                        <td style={{ fontWeight: 700, color: 'var(--accent-dark)', fontFamily: 'monospace' }}>{a.appointmentId}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{a.user?.fullName || a.customerName || '—'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{a.user?.phone}</div>
                        </td>
                        <td>{a.service?.name || '—'}</td>
                        <td>{a.worker?.name || '—'}</td>
                        <td>
                          <div>{formatDate(a.date)}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{formatTime(a.time)}</div>
                        </td>
                        <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
