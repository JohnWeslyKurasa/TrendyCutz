import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      toast.error('All fields are required'); return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to Trendy Cutz!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-slide-up" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">TC</div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700 }}>Trendy Cutz</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Unisex Salon</div>
            </div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginTop: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Join Trendy Cutz today</p>
        </div>
        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <FiUser className="input-icon" size={16} />
                <input name="fullName" type="text" className="form-control" placeholder="Your full name" value={form.fullName} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <FiMail className="input-icon" size={16} />
                <input name="email" type="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-group">
                <FiPhone className="input-icon" size={16} />
                <input name="phone" type="tel" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-group has-right">
                  <FiLock className="input-icon" size={16} />
                  <input name="password" type={show ? 'text' : 'password'} className="form-control" placeholder="Min 6 chars" value={form.password} onChange={handleChange} />
                  <button type="button" className="input-icon-right" onClick={() => setShow(!show)}>
                    {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-group">
                  <FiLock className="input-icon" size={16} />
                  <input name="confirmPassword" type={show ? 'text' : 'password'} className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Creating...</> : 'Create Account'}
            </button>
          </form>
          <div className="divider" />
          <p className="text-center text-sm text-secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
