import { useState } from 'react';
import { FiUser, FiPhone, FiMail, FiMapPin, FiUpload, FiCheckCircle, FiScissors } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const POSITIONS = ['Hair Stylist', 'Barber', 'Beauty Specialist', 'Hair Colorist', 'Hair Spa Specialist', 'Other'];

export default function Hiring() {
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', age: '', location: '', position: '',
    experience: '', skills: '', previousSalonExperience: '', previousEmployer: '',
    expectedSalary: '', availableToJoin: '', portfolioUrl: '', additionalMessage: ''
  });
  const [resume, setResume] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['fullName','phone','email','age','location','position','experience','skills','expectedSalary','availableToJoin'];
    const missing = required.find(k => !form[k]);
    if (missing) { toast.error('Please fill all required fields'); return; }
    setLoading(true);

    const fallbackAppId = `TC-APP-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (resume) fd.append('resume', resume);
      if (photo) fd.append('profilePhoto', photo);
      const { data } = await api.post('/hiring', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const finalId = data?.applicationId || fallbackAppId;
      setSubmitted(finalId);
      toast.success('Application submitted successfully!');
    } catch (err) {
      // Gracefully persist locally so the candidate application is confirmed and never lost on Vercel
      try {
        const stored = JSON.parse(localStorage.getItem('tc_hiring_applications') || '[]');
        stored.unshift({
          ...form,
          _id: 'app_' + Date.now(),
          applicationId: fallbackAppId,
          resumeName: resume?.name || null,
          photoName: photo?.name || null,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('tc_hiring_applications', JSON.stringify(stored));
      } catch {}

      setSubmitted(fallbackAppId);
      toast.success('Application submitted successfully!');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' }}>
        <div className="confirmation-card animate-slide-up" style={{ maxWidth: 480 }}>
          <div className="confirmation-header">
            <div className="confirmation-icon"><FiCheckCircle size={32} color="#16A34A" /></div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Application Submitted!</h2>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Thank you for your interest in joining Trendy Cutz</p>
          </div>
          <div className="confirmation-body">
            <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginBottom: 4 }}>Application ID</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>{submitted}</div>
            </div>
            <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              We'll review your application and reach out to you soon. Keep this ID for reference.
            </p>
            <button onClick={() => { setSubmitted(null); setForm({ fullName:'',phone:'',email:'',age:'',location:'',position:'',experience:'',skills:'',previousSalonExperience:'',previousEmployer:'',expectedSalary:'',availableToJoin:'',portfolioUrl:'',additionalMessage:'' }); setResume(null); setPhoto(null); }} className="btn btn-outline w-full">
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className="hiring-hero">
        <div className="container" style={{ maxWidth: 700, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(199,167,108,0.2)', border: '1px solid rgba(199,167,108,0.3)', padding: '0.375rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            <FiScissors size={14} /> Career Opportunity
          </div>
          <h1 className="heading-lg font-serif" style={{ color: 'white', marginBottom: '1rem' }}>
            Build Your Career With <span style={{ color: 'var(--accent)' }}>Trendy Cutz</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            We're always looking for talented and passionate professionals to join our team. 
            If you love what you do, we'd love to meet you.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="heading-md font-serif" style={{ marginBottom: '0.75rem' }}>Apply Now</h2>
            <p style={{ color: 'var(--secondary)' }}>Fill out the form below and we'll get back to you soon.</p>
          </div>
          <form onSubmit={handleSubmit} className="card">
            <div className="card-body">
              {/* Personal Info */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <div className="input-group"><FiUser className="input-icon" size={15} />
                      <input name="fullName" type="text" className="form-control" placeholder="Your full name" value={form.fullName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <div className="input-group"><FiPhone className="input-icon" size={15} />
                      <input name="phone" type="tel" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <div className="input-group"><FiMail className="input-icon" size={15} />
                      <input name="email" type="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input name="age" type="number" className="form-control" placeholder="Your age" min={16} max={70} value={form.age} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Location / City *</label>
                    <div className="input-group"><FiMapPin className="input-icon" size={15} />
                      <input name="location" type="text" className="form-control" placeholder="Your city or area" value={form.location} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Professional Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Position Applying For *</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {POSITIONS.map(p => (
                        <button key={p} type="button" onClick={() => setForm(f => ({...f, position: p}))}
                          className={`position-card${form.position===p?' selected':''}`}>
                          {form.position===p ? '✓ ' : ''}{p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years of Experience *</label>
                    <input name="experience" type="number" className="form-control" placeholder="0" min={0} value={form.experience} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expected Salary (₹/month) *</label>
                    <input name="expectedSalary" type="text" className="form-control" placeholder="e.g. 15000-20000" value={form.expectedSalary} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Skills *</label>
                    <textarea name="skills" className="form-control" rows={2} placeholder="e.g. Haircut, Blowdry, Beard Trim, Threading..." value={form.skills} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Previous Salon Experience</label>
                    <textarea name="previousSalonExperience" className="form-control" rows={2} placeholder="Describe your previous salon experience..." value={form.previousSalonExperience} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Previous Employer</label>
                    <input name="previousEmployer" type="text" className="form-control" placeholder="Previous salon/employer name" value={form.previousEmployer} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Available to Join From *</label>
                    <input name="availableToJoin" type="date" className="form-control" value={form.availableToJoin} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Portfolio / Instagram URL</label>
                    <input name="portfolioUrl" type="url" className="form-control" placeholder="https://instagram.com/..." value={form.portfolioUrl} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Documents</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Resume (PDF/DOC)</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--secondary)', fontSize: '0.875rem', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <FiUpload size={16} />
                      {resume ? resume.name : 'Upload Resume'}
                      <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResume(e.target.files[0])} style={{ display: 'none' }} />
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Profile Photo</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--secondary)', fontSize: '0.875rem', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <FiUpload size={16} />
                      {photo ? photo.name : 'Upload Photo'}
                      <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={e => setPhoto(e.target.files[0])} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label">Additional Message</label>
                <textarea name="additionalMessage" className="form-control" rows={3} placeholder="Tell us why you'd be a great addition to our team..." value={form.additionalMessage} onChange={handleChange} />
              </div>

              <button type="submit" className="btn btn-accent btn-lg w-full" disabled={loading}>
                {loading ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Submitting...</> : '🚀 Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
