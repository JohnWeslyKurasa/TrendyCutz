import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiStar, FiMapPin, FiPhone, FiClock, FiArrowRight, FiScissors, FiCheck, FiAward, FiUsers, FiHeart, FiNavigation, FiPhoneCall } from 'react-icons/fi';
import { GiRazor, GiHairStrands, GiFlowerEmblem, GiSparkles, GiWaterDrop } from 'react-icons/gi';
import api from '../services/api';
import { DEMO_SERVICES, DEMO_WORKERS, DEMO_REVIEWS } from '../services/demoData';
import heroImg from '../assets/hero.jpg';

const WHY_CARDS = [
  { icon: <FiAward size={26} color="var(--accent)" />, title: 'Since 2018', desc: '7+ years of trusted service in Hyderabad' },
  { icon: <FiScissors size={26} color="var(--accent)" />, title: 'Expert Stylists', desc: 'Trained, experienced professionals' },
  { icon: <GiSparkles size={26} color="var(--accent)" />, title: 'Premium Services', desc: 'Quality treatments at fair prices' },
  { icon: <FiUsers size={26} color="var(--accent)" />, title: 'Unisex Salon', desc: 'Services for everyone, every style' },
  { icon: <FiHeart size={26} color="var(--accent)" />, title: 'Client First', desc: 'Your satisfaction is our priority' },
];

const SERVICE_ICONS = {
  Hair: <FiScissors size={40} color="var(--accent-dark)" />,
  Beard: <GiRazor size={40} color="var(--accent-dark)" />,
  Beauty: <GiFlowerEmblem size={40} color="var(--accent-dark)" />,
  Spa: <GiWaterDrop size={40} color="var(--accent-dark)" />,
  Other: <FiStar size={40} color="var(--accent-dark)" />
};

function StarRating({ rating, size = 14 }) {
  return (
    <div className="rating-stars">
      {[1,2,3,4,5].map(n => (
        <FiStar key={n} size={size} fill={n <= Math.round(rating) ? 'currentColor' : 'none'} className={n <= Math.round(rating) ? '' : 'empty'} />
      ))}
    </div>
  );
}

export default function Home() {
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingS, setLoadingS] = useState(true);
  const [loadingW, setLoadingW] = useState(true);
  const [loadingR, setLoadingR] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then(r => {
        if (r.data?.services?.length > 0) setServices(r.data.services.slice(0, 6));
        else setServices(DEMO_SERVICES.slice(0, 6));
        setLoadingS(false);
      })
      .catch(() => {
        setServices(DEMO_SERVICES.slice(0, 6));
        setLoadingS(false);
      });

    api.get('/workers')
      .then(r => {
        if (r.data?.workers?.length > 0) setWorkers(r.data.workers.slice(0, 4));
        else setWorkers(DEMO_WORKERS.slice(0, 4));
        setLoadingW(false);
      })
      .catch(() => {
        setWorkers(DEMO_WORKERS.slice(0, 4));
        setLoadingW(false);
      });

    api.get('/reviews?limit=6')
      .then(r => {
        if (r.data?.reviews?.length > 0) setReviews(r.data.reviews.slice(0, 6));
        else setReviews(DEMO_REVIEWS.slice(0, 6));
        setLoadingR(false);
      })
      .catch(() => {
        setReviews(DEMO_REVIEWS.slice(0, 6));
        setLoadingR(false);
      });

    // SEO
    document.title = 'Trendy Cutz | Premium Unisex Salon in Suraram, Hyderabad';
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-text animate-slide-up">
            <span className="hero-label">
              <FiScissors size={12} /> Premium Unisex Salon · Suraram, Hyderabad
            </span>
            <h1 className="hero-title">
              Look Good.<br />
              <span className="accent-word">Feel Confident.</span>
            </h1>
            <p className="hero-subtitle">
              Premium haircuts, styling, grooming and beauty services at Trendy Cutz. 
              Your trusted salon since 2018.
            </p>
            <div className="hero-actions">
              <Link to="/book" className="btn btn-primary btn-lg">
                <FiCalendar size={18} />
                Book Appointment
              </Link>
              <Link to="/services" className="btn btn-outline btn-lg">
                Explore Services
                <FiArrowRight size={18} />
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">7+</span>
                <span className="hero-stat-label">Years of Excellence</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">4</span>
                <span className="hero-stat-label">Expert Stylists</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">9+</span>
                <span className="hero-stat-label">Premium Services</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrap animate-fade-in">
            <div className="hero-accent-dot" />
            <div className="hero-image-frame">
              <img src={heroImg} alt="Trendy Cutz Salon – Premium Hair Styling" />
            </div>
            <div className="hero-badge">
              <div className="hero-badge-since">2018</div>
              <div className="hero-badge-text">Trusted Since</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TRENDY CUTZ */}
      <section className="section-sm" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2 className="heading-md font-serif">Why Trendy Cutz?</h2>
            <p>Everything you need for a premium salon experience — under one roof.</p>
          </div>
          <div className="feature-grid">
            {WHY_CARDS.map(c => (
              <div key={c.title} className="feature-card">
                <div className="feature-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What We Offer</span>
            <h2 className="heading-md font-serif">Popular Services</h2>
            <p>From precision haircuts to rejuvenating spa treatments — crafted for you.</p>
          </div>
          {loadingS ? (
            <div className="grid-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card" style={{ height: 300 }}>
                  <div className="skeleton" style={{ height: 180 }} />
                  <div className="card-body">
                    <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, marginBottom: 4 }} />
                    <div className="skeleton" style={{ height: 14, width: '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {services.map(s => (
                <div key={s._id} className="service-card">
                  <div className="service-card-img">
                    <div style={{ width:'100%', height:'100%', background: 'linear-gradient(135deg,var(--accent-light),var(--bg-alt))', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {SERVICE_ICONS[s.category] || <FiScissors size={40} color="var(--accent-dark)" />}
                    </div>
                    <span className="service-category-tag">{s.category}</span>
                  </div>
                  <div className="service-card-body">
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                    <div className="service-meta">
                      <div className="service-price">₹{s.price}<span> onwards</span></div>
                      <div className="service-duration"><FiClock size={13} /> {s.duration} min</div>
                    </div>
                    <Link to="/book" className="btn btn-primary w-full">Book Now</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link to="/services" className="btn btn-outline btn-lg">
              View All Services <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Meet the Team</span>
            <h2 className="heading-md font-serif">Our Professional Team</h2>
            <p>Skilled, passionate professionals dedicated to making you look and feel your best.</p>
          </div>
          {loadingW ? (
            <div className="grid-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card" style={{ height: 380 }}>
                  <div className="skeleton" style={{ height: 240 }} />
                  <div className="card-body">
                    <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-4">
              {workers.map(w => (
                <div key={w._id} className="worker-card">
                  <div className="worker-photo-wrap">
                    <div className="worker-avatar">{w.name.charAt(0)}</div>
                  </div>
                  <div className="worker-card-body">
                    <h3>{w.name}</h3>
                    <div className="worker-role">{w.role}</div>
                    <div className="worker-spec">{w.specialization}</div>
                    <div className="worker-stats">
                      <div className="worker-stat">
                        <div className="worker-stat-value">{w.experience}y</div>
                        <div className="worker-stat-label">Experience</div>
                      </div>
                      <div className="worker-stat">
                        <div className="worker-stat-value">{w.completedAppointments}</div>
                        <div className="worker-stat-label">Completed</div>
                      </div>
                      <div className="worker-stat">
                        <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                          <span className="worker-stat-value">{w.rating.average || '–'}</span>
                          <FiStar size={12} color="#F59E0B" fill="#F59E0B" />
                        </div>
                        <div className="worker-stat-label">Rating</div>
                      </div>
                    </div>
                    <Link to={`/book?worker=${w._id}`} className="btn btn-primary w-full btn-sm">
                      Book with {w.name.split(' ')[0]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link to="/team" className="btn btn-outline btn-lg">
              View Full Team <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Testimonials</span>
            <h2 className="heading-md font-serif">Customer Reviews</h2>
          </div>
          {loadingR ? (
            <div className="grid-3">
              {[...Array(3)].map((_,i) => (
                <div key={i} className="review-card">
                  <div className="skeleton" style={{ height: 44, width: 44, borderRadius: '50%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12 }} />
                  <div className="skeleton" style={{ height: 12, width: '80%', marginTop: 6 }} />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiStar size={36} color="var(--accent)" />
              </div>
              <h3>Be the First to Review Trendy Cutz</h3>
              <p>Book an appointment and share your experience with us.</p>
              <Link to="/book" className="btn btn-accent">Book Appointment</Link>
            </div>
          ) : (
            <div className="grid-3">
              {reviews.map(r => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{r.user?.fullName?.charAt(0) || 'G'}</div>
                    <div className="review-meta">
                      <div className="review-name">{r.user?.fullName || 'Guest'}</div>
                      <div className="review-date">{new Date(r.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="review-text">"{r.comment}"</p>
                  {r.worker && <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>— with {r.worker.name}</div>}
                </div>
              ))}
            </div>
          )}
          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link to="/reviews" className="btn btn-outline">View All Reviews</Link>
          </div>
        </div>
      </section>

      {/* CONTACT / LOCATION */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="location-grid-container">
            <div>
              <span className="section-label">Visit Us</span>
              <h2 className="heading-md font-serif" style={{ marginBottom: '1.25rem' }}>Find Us at Suraram, Hyderabad</h2>
              <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem', fontSize: '0.975rem', lineHeight: 1.6 }}>
                Experience premier styling and personalized grooming right in your neighborhood. Walk-ins and reservations are always welcome.
              </p>
              
              <div className="contact-info-card">
                <a 
                  href="https://www.google.com/maps/search/Trendy+Cutz+Suraram+Hyderabad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-item contact-item-link"
                >
                  <div className="contact-icon-wrap"><FiMapPin size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="contact-item-title">Location</div>
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
                    <div className="contact-item-title">Opening Hours</div>
                    <div className="contact-item-desc">Monday – Sunday<br />8:00 AM – 9:00 PM</div>
                  </div>
                </div>
              </div>

              <div className="location-actions-row">
                <a href="https://www.google.com/maps/search/Trendy+Cutz+Suraram+Hyderabad" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <FiNavigation size={16} /> Get Directions
                </a>
                <a href="tel:+919121830372" className="btn btn-outline">
                  <FiPhoneCall size={16} /> Call Now
                </a>
                <Link to="/book" className="btn btn-accent">
                  <FiCalendar size={16} /> Book Appointment
                </Link>
              </div>
            </div>

            <div>
              <div className="luxury-map-showcase">
                <div className="luxury-map-frame">
                  <iframe
                    title="Trendy Cutz Salon Location Map"
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
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: 'var(--primary)', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="container">
          <h2 className="heading-md font-serif" style={{ color: 'white', marginBottom: '1rem' }}>
            Ready for a <span style={{ color: 'var(--accent)' }}>Fresh Look?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Book your appointment today. Walk in confident, walk out amazing.
          </p>
          <Link to="/book" className="btn btn-accent btn-lg">
            <FiCalendar size={18} />
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
