import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiCalendar, FiUsers, FiScissors, FiStar, 
  FiBriefcase, FiSettings, FiLogOut, FiMenu, FiX 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/appointments', icon: FiCalendar, label: 'Appointments' },
  { to: '/admin/workers', icon: FiUsers, label: 'Workers' },
  { to: '/admin/services', icon: FiScissors, label: 'Services' },
  { to: '/admin/customers', icon: FiUsers, label: 'Customers' },
  { to: '/admin/reviews', icon: FiStar, label: 'Reviews' },
  { to: '/admin/hiring', icon: FiBriefcase, label: 'Hiring' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">TC</div>
          <div className="admin-logo-text">
            <div className="name">Trendy Cutz</div>
            <div className="role">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">
            <div className="admin-nav-label">Main Menu</div>
            {NAV.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`admin-nav-link${location.pathname === to ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
          <div className="admin-nav-section" style={{ marginTop: 'auto' }}>
            <Link to="/" className="admin-nav-link" target="_blank">
              <FiSettings size={16} />
              View Site
            </Link>
            <button
              className="admin-nav-link"
              onClick={handleLogout}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Content */}
      <div className="admin-content">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
              id="admin-hamburger"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
              {NAV.find(n => n.to === location.pathname)?.label || 'Admin'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: 700 }}>
              {user?.fullName?.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{user?.fullName}</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--secondary)' }}>Administrator</span>
            </div>
          </div>
        </div>

        <main className="admin-page">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 1024px) {
          #admin-hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
