import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success('Admin login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page" style={{ background: 'var(--primary)' }}>
      <div className="auth-card animate-slide-up" style={{ maxWidth: 440 }}>
        <div className="auth-header" style={{ background: '#1A1A1A' }}>
          <div className="auth-logo">
            <div className="auth-logo-icon">TC</div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700 }}>Trendy Cutz</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Admin Portal</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
            <FiShield size={16} color="var(--accent)" />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem' }}>Admin Login</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Authorized personnel only</p>
        </div>
        <div className="auth-body">
          <div style={{ background: 'var(--warning-bg)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiLock size={15} style={{ flexShrink: 0 }} /> This is a restricted area. Authorized admin credentials only.
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <div className="input-group">
                <FiMail className="input-icon" size={16} />
                <input type="email" className="form-control" placeholder="admin@trendycutz.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group has-right">
                <FiLock className="input-icon" size={16} />
                <input type={show ? 'text' : 'password'} className="form-control" placeholder="Admin password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" className="input-icon-right" onClick={() => setShow(!show)}>
                  {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Authenticating...</> : <><FiShield size={16} /> Admin Sign In</>}
            </button>
          </form>
          <div className="divider" />
          <p className="text-center text-xs text-secondary">
            Not an admin? <a href="/login" style={{ color: 'var(--accent)' }}>Go to Customer Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
