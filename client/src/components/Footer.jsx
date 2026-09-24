import { Link } from 'react-router-dom';
import { FiPhone, FiMapPin, FiClock, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Our Team' },
  { to: '/book', label: 'Book Appointment' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/hiring', label: 'Join Our Team' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-logo">
              <div className="footer-logo-icon">TC</div>
              <div className="footer-logo-text">
                <div className="name">Trendy Cutz</div>
                <div className="tagline">Unisex Salon · Since 2018</div>
              </div>
            </div>
            <p className="footer-desc">
              Premium haircuts, styling, grooming and beauty services in Suraram, Hyderabad. 
              Your trusted salon since 2018.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Instagram"><FiInstagram size={16} /></a>
              <a href="#" className="social-btn" aria-label="Facebook"><FiFacebook size={16} /></a>
              <a href="#" className="social-btn" aria-label="Twitter"><FiTwitter size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links">
              {QUICK_LINKS.map(l => (
                <Link key={l.to} to={l.to} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-heading">Services</h4>
            <div className="footer-links">
              {['Premium Haircuts', 'Hair Styling', 'Hair Spa', 'Beard Grooming', 'Beauty Services', 'Hair Treatments', 'Facial'].map(s => (
                <Link key={s} to="/services" className="footer-link">{s}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact & Hours</h4>
            <div className="footer-contact-item">
              <FiPhone className="footer-contact-icon" size={16} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>+91 91218 30372</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>Call or WhatsApp</div>
              </div>
            </div>
            <div className="footer-contact-item">
              <FiMapPin className="footer-contact-icon" size={16} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Suraram, Hyderabad</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>Telangana 500055, India</div>
              </div>
            </div>
            <div className="footer-contact-item">
              <FiClock className="footer-contact-icon" size={16} />
              <div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>8:00 AM – 9:00 PM</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>Monday – Sunday</div>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/search/Trendy+Cutz+Suraram+Hyderabad"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-accent btn-sm"
              style={{ marginTop: '0.5rem', color: 'var(--accent)', borderColor: 'var(--accent)' }}
            >
              <FiMapPin size={14} />
              Get Directions
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Trendy Cutz. All rights reserved.</div>
          <div>Premium Unisex Salon in Suraram, Hyderabad</div>
        </div>
      </div>
    </footer>
  );
}
