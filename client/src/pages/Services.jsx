import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiFilter, FiScissors, FiStar } from 'react-icons/fi';
import { GiRazor, GiFlowerEmblem, GiWaterDrop } from 'react-icons/gi';
import api from '../services/api';
import { DEMO_SERVICES } from '../services/demoData';

const CATEGORIES = ['All', 'Hair', 'Beard', 'Beauty', 'Spa', 'Other'];
const SERVICE_ICONS = {
  Hair: <FiScissors size={48} color="#1A1A1A" />,
  Beard: <GiRazor size={48} color="#1A1A1A" />,
  Beauty: <GiFlowerEmblem size={48} color="#1A1A1A" />,
  Spa: <GiWaterDrop size={48} color="#1A1A1A" />,
  Other: <FiStar size={48} color="#1A1A1A" />
};
const BG_COLORS = {
  Hair: 'linear-gradient(135deg,#F0E6D2,#FAF8F2)',
  Beard: 'linear-gradient(135deg,#E8E2D8,#F3EFE6)',
  Beauty: 'linear-gradient(135deg,#FCE4EC,#FAF8F2)',
  Spa: 'linear-gradient(135deg,#E8F5E9,#FAF8F2)',
  Other: 'linear-gradient(135deg,#EDE9FE,#FAF8F2)'
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');

  useEffect(() => {
    document.title = 'Services | Trendy Cutz';
    api.get('/services')
      .then(r => {
        if (r.data?.services?.length > 0) setServices(r.data.services);
        else setServices(DEMO_SERVICES);
        setLoading(false);
      })
      .catch(() => {
        setServices(DEMO_SERVICES);
        setLoading(false);
      });
  }, []);

  const filtered = cat === 'All' ? services : services.filter(s => s.category === cat);

  return (
    <>
      {/* Page Header */}
      <div style={{ background: 'var(--primary)', padding: '7rem 1.5rem 3.5rem', textAlign: 'center', color: 'white' }} className="page-top-padding">
        <div className="container">
          <span className="section-label" style={{ color: 'var(--accent)' }}>What We Offer</span>
          <h1 className="heading-lg font-serif" style={{ color: 'white', marginBottom: '1rem' }}>Our Services</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>
            From precision cuts to luxury spa treatments — expertly crafted services for every need.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem', marginRight: '0.5rem' }}>
              <FiFilter size={14} /> Filter:
            </div>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_,i) => (
                <div key={i} className="card" style={{ height: 340 }}>
                  <div className="skeleton" style={{ height: 180 }} />
                  <div className="card-body">
                    <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiScissors size={40} color="var(--secondary)" />
              </div>
              <h3>No services in this category</h3>
              <p>Try selecting a different category.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(s => (
                <div key={s._id} className="service-card">
                  <div className="service-card-img" style={{ background: BG_COLORS[s.category] || BG_COLORS.Other }}>
                    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {SERVICE_ICONS[s.category] || <FiScissors size={48} color="#1A1A1A" />}
                    </div>
                    <span className="service-category-tag">{s.category}</span>
                  </div>
                  <div className="service-card-body">
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                    {s.availableWorkers?.length > 0 && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: '0.75rem' }}>
                        <strong style={{ color: 'var(--primary)' }}>Available with:</strong>{' '}
                        {s.availableWorkers.map(w => w.name).join(', ')}
                      </div>
                    )}
                    <div className="service-meta">
                      <div className="service-price">₹{s.price}<span> onwards</span></div>
                      <div className="service-duration"><FiClock size={13} /> {s.duration} min</div>
                    </div>
                    <Link to={`/book?service=${s._id}`} className="btn btn-primary w-full">Book Now</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
