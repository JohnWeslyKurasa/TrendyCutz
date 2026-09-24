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
        <div className="admin-sidebar-logo" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="admin-logo-icon">TC</div>
            <div className="admin-logo-text">
              <div className="name">Trendy Cutz</div>
              <div className="role">Admin Panel</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-ghost btn-icon mobile-only-close"
            style={{ color: 'rgba(255,255,255,0.7)', padding: '0.25rem' }}
            title="Close Menu"
          >
            <FiX size={22} />
          </button>
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
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="admin-nav-section" style={{ marginTop: 'auto' }}>
            <Link to="/" className="admin-nav-link" target="_blank" rel="noopener noreferrer">
              <FiSettings size={17} />
              <span>View Live Website</span>
            </Link>
            <button
              className="admin-nav-link"
              onClick={handleLogout}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
            >
              <FiLogOut size={17} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Content */}
      <div className="admin-content">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              id="admin-hamburger"
              style={{ 
                display: 'none',
                width: 40, 
                height: 40, 
                borderRadius: 8, 
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)'
              }}
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div>
              <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--primary)' }}>
                {NAV.find(n => n.to === location.pathname)?.label || 'Dashboard'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>
                Trendy Cutz Control
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: 700 }}>
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, maxWidth: 110, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'Admin'}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--accent-dark)', fontWeight: 600 }}>Administrator</span>
            </div>
          </div>
        </div>

        <main className="admin-page">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar */}
      <nav className="admin-mobile-bottom-bar">
        <Link to="/admin/dashboard" className={`admin-mobile-tab${location.pathname === '/admin/dashboard' ? ' active' : ''}`}>
          <FiGrid size={18} />
          <span>Overview</span>
        </Link>
        <Link to="/admin/appointments" className={`admin-mobile-tab${location.pathname === '/admin/appointments' ? ' active' : ''}`}>
          <FiCalendar size={18} />
          <span>Appts</span>
        </Link>
        <Link to="/admin/workers" className={`admin-mobile-tab${location.pathname === '/admin/workers' ? ' active' : ''}`}>
          <FiUsers size={18} />
          <span>Stylists</span>
        </Link>
        <Link to="/admin/hiring" className={`admin-mobile-tab${location.pathname === '/admin/hiring' ? ' active' : ''}`}>
          <FiBriefcase size={18} />
          <span>Hiring</span>
        </Link>
        <button 
          onClick={() => setSidebarOpen(true)} 
          className={`admin-mobile-tab${sidebarOpen ? ' active' : ''}`}
          type="button"
        >
          <FiMenu size={18} />
          <span>Menu</span>
        </button>
      </nav>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 190, backdropFilter: 'blur(3px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 1024px) {
          #admin-hamburger { display: flex !important; align-items: center; justify-content: center; }
          .mobile-only-close { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .mobile-only-close { display: none !important; }
        }
      `}</style>
    </div>
  );
}
