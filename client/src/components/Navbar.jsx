import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiScissors, FiUser, FiLogOut, FiMenu, FiX, FiCalendar, FiHome, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Our Team' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setOpen(false);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
            <div className="navbar-logo-icon">TC</div>
            <div className="navbar-logo-text">
              <span className="name">Trendy Cutz</span>
              <span className="sub">Unisex Salon · Since 2018</span>
            </div>
          </Link>

          <div className="navbar-nav">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.exact}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="navbar-actions">
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="btn btn-ghost btn-sm"
                >
                  <FiUser size={15} />
                  {isAdmin ? 'Admin' : user.fullName.split(' ')[0]}
                </Link>
                <Link to="/book" className="btn btn-accent btn-sm">
                  <FiCalendar size={14} />
                  Book Now
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/book" className="btn btn-accent btn-sm">
                  <FiCalendar size={14} />
                  Book Now
                </Link>
              </>
            )}
            <button
              className={`hamburger${open ? ' open' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.exact}
            className="mobile-nav-link"
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
        <div className="divider" />
        <Link to="/hiring" className="mobile-nav-link" onClick={() => setOpen(false)}>
          <FiBriefcase size={16} />
          Join Our Team
        </Link>
        {user ? (
          <>
            <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="mobile-nav-link" onClick={() => setOpen(false)}>
              <FiHome size={16} />
              {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
            </Link>
            <button className="mobile-nav-link" onClick={handleLogout} style={{ width: '100%', textAlign: 'left' }}>
              <FiLogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="mobile-nav-link" onClick={() => setOpen(false)}>
            <FiUser size={16} />
            Login / Register
          </Link>
        )}
        <Link to="/book" className="btn btn-accent w-full" style={{ marginTop: '0.5rem' }} onClick={() => setOpen(false)}>
          <FiCalendar size={14} />
          Book Appointment
        </Link>
      </div>
    </>
  );
}
