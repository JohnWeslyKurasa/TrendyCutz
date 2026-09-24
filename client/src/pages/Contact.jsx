import { Link } from 'react-router-dom';
import { FiPhone, FiMapPin, FiClock, FiCalendar, FiNavigation, FiPhoneCall, FiScissors } from 'react-icons/fi';

export default function Contact() {
  return (
    <>
      <div style={{ background: 'var(--primary)', padding: '7rem 1.5rem 3.5rem', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--accent)' }}>Get In Touch</span>
          <h1 className="heading-lg font-serif" style={{ color: 'white', marginBottom: '1rem' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>
            We're here to help. Reach out to us or visit us at our Suraram location.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 1080 }}>
          <div className="location-grid-container">
            <div>
              <h2 className="heading-sm font-serif" style={{ marginBottom: '1.25rem' }}>Visit or Call Us</h2>
              <div className="contact-info-card">
                <a 
                  href="https://www.google.com/maps/search/Trendy+Cutz+Suraram+Hyderabad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-item contact-item-link"
                >
                  <div className="contact-icon-wrap"><FiMapPin size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="contact-item-title">Address</div>
                    <div className="contact-item-desc">Suraram, Hyderabad<br />Telangana 500055, India</div>
                  </div>
                  <FiNavigation className="contact-item-arrow" size={16} />
                </a>

                <a href="tel:+919121830372" className="contact-item contact-item-link">
                  <div className="contact-icon-wrap"><FiPhoneCall size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="contact-item-title">Phone</div>
                    <div className="contact-item-desc highlight">+91 91218 30372</div>
                  </div>
                  <span className="contact-pill-tag">Tap to Call</span>
                </a>

                <div className="contact-item">
                  <div className="contact-icon-wrap"><FiClock size={20} /></div>
                  <div>
                    <div className="contact-item-title">Hours</div>
                    <div className="contact-item-desc">Monday – Sunday<br />8:00 AM – 9:00 PM</div>
                  </div>
                </div>
              </div>

              <div className="location-actions-row">
                <a href="https://www.google.com/maps/search/Trendy+Cutz+Suraram+Hyderabad" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <FiNavigation size={16} /> Get Directions
                </a>
                <a href="tel:+919121830372" className="btn btn-accent">
                  <FiPhoneCall size={16} /> Call Now
                </a>
                <Link to="/book" className="btn btn-outline">
                  <FiCalendar size={16} /> Book Appointment
                </Link>
              </div>
            </div>

            <div>
              <h2 className="heading-sm font-serif" style={{ marginBottom: '1.25rem' }}>Find Us on the Map</h2>
              <div className="luxury-map-showcase" style={{ marginBottom: '1.5rem' }}>
                <div className="luxury-map-frame">
                  <iframe
                    title="Trendy Cutz Location Map"
                    src="https://maps.google.com/maps?q=Trendy+Cutz,+Suraram,+Hyderabad,+Telangana+500055&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                    allowFullScreen=""
                  />
                </div>
                
                <div className="luxury-map-overlay">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div className="luxury-map-beacon">
                      <FiScissors size={18} />
                    </div>
                    <div>
                      <div className="status-live-pill">
                        <span className="status-live-dot" /> Open Today · 8:00 AM – 9:00 PM
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                        Trendy Cutz
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                        Suraram, Hyderabad, Telangana 500055
                      </div>
                    </div>
                  </div>

                  <a 
                    href="https://www.google.com/maps/search/Trendy+Cutz+Suraram+Hyderabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <FiNavigation size={14} /> Open in Maps
                  </a>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '0.5rem' }}>Quick Online Booking</h3>
                  <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Skip the wait — reserve your slot online in minutes.</p>
                  <Link to="/book" className="btn btn-accent w-full"><FiCalendar size={16} /> Book Appointment Online</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
