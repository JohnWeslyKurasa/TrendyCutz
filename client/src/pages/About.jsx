import { Link } from 'react-router-dom';
import { FiPhone, FiMapPin, FiClock, FiCalendar, FiStar, FiScissors, FiUsers, FiBriefcase, FiAward, FiHeart, FiCheck } from 'react-icons/fi';
import { GiSparkles } from 'react-icons/gi';

export default function About() {
  return (
    <>
      <div style={{ background: 'var(--primary)', padding: '7rem 1.5rem 3.5rem', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <span className="section-label" style={{ color: 'var(--accent)' }}>Our Story</span>
          <h1 className="heading-lg font-serif" style={{ color: 'white', marginBottom: '1rem' }}>About Trendy Cutz</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto' }}>
            A premium unisex salon in Suraram, Hyderabad — crafting confidence since 2018.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 960 }}>
          <div className="location-grid-container" style={{ alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <span className="section-label">Who We Are</span>
              <h2 className="heading-sm font-serif" style={{ marginBottom: '1.5rem' }}>Premium Salon Experience Since 2018</h2>
              <p style={{ color: 'var(--secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Trendy Cutz is a premium unisex salon located in Suraram, Hyderabad. 
                Since our founding in 2018, we've been dedicated to providing top-quality hair, 
                grooming, and beauty services to our valued clients.
              </p>
              <p style={{ color: 'var(--secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Our team of experienced professionals is passionate about their craft. 
                From precision haircuts to rejuvenating hair spas and comprehensive beauty treatments, 
                we offer a complete range of services for everyone.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>7+</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--secondary)', fontWeight: 500 }}>Years in Business</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>4</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--secondary)', fontWeight: 500 }}>Expert Stylists</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>9+</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--secondary)', fontWeight: 500 }}>Services Offered</div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ background: 'var(--primary)', borderRadius: 'var(--radius-lg)', padding: '2.25rem', color: 'white', border: '1px solid rgba(199,167,108,0.25)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(199,167,108,0.18)', border: '1px solid rgba(199,167,108,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '1.25rem' }}>
                  <FiScissors size={26} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', color: 'white', marginBottom: '1rem' }}>Our Promise</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['Premium quality at fair prices', 'Hygienic and clean environment', 'Experienced & trained professionals', 'Personalized service for every client', 'Latest trends & techniques'].map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                      <FiCheck style={{ color: 'var(--accent)', flexShrink: 0 }} size={16} /> {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="section-header">
            <span className="section-label">Our Values</span>
            <h2 className="heading-md font-serif">What We Stand For</h2>
          </div>
          <div className="grid-3" style={{ marginBottom: '4rem' }}>
            {[
              { icon: <FiAward size={36} color="var(--accent)" />, title: 'Excellence', desc: 'We hold ourselves to the highest standards in every cut, style, and treatment.' },
              { icon: <FiHeart size={36} color="var(--accent)" />, title: 'Care', desc: 'Every client is treated like family. Your comfort and satisfaction is our priority.' },
              { icon: <GiSparkles size={36} color="var(--accent)" />, title: 'Innovation', desc: 'We stay updated with the latest trends and techniques to bring you the best.' },
            ].map(v => (
              <div key={v.title} className="card text-center">
                <div className="card-body" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>{v.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>{v.title}</h3>
                  <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, var(--primary), #2D2D2D)', borderRadius: 'var(--radius-lg)', padding: '3rem', textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Ready to Experience Trendy Cutz?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Book your appointment today and discover the Trendy Cutz difference.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/book" className="btn btn-accent btn-lg"><FiCalendar size={18} /> Book Appointment</Link>
              <Link to="/hiring" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}><FiBriefcase size={18} /> Join Our Team</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
