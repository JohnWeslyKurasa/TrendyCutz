import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.fullName.split(' ')[0]}!`);
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-slide-up">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">TC</div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700 }}>Trendy Cutz</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Unisex Salon</div>
            </div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginTop: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Sign in to your account</p>
        </div>
        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <FiMail className="input-icon" size={16} />
                <input
                  type="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group has-right">
                <FiLock className="input-icon" size={16} />
                <input
                  type={show ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="input-icon-right" onClick={() => setShow(!show)}>
                  {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>
          <div className="divider" />
          <p className="text-center text-sm text-secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create Account</Link>
          </p>
          <p className="text-center text-xs text-secondary" style={{ marginTop: '0.5rem' }}>
            <Link to="/admin/login" style={{ color: 'var(--secondary)' }}>Admin Login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
