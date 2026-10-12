import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Store, Bike, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await login(email, password);
      // Route to appropriate dashboard if coming from generic login
      if (from === '/') {
        if (data.role === 'ADMIN') navigate('/admin/dashboard');
        else if (data.role === 'RESTAURANT') navigate('/restaurant/dashboard');
        else if (data.role === 'DELIVERY') navigate('/delivery/dashboard');
        else navigate('/customer/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.25rem' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Sign in to manage orders, menus, or taste delicious food.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem', textAlign: 'center' }}>
              Quick Demo Accounts (1-Click Fill)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => fillQuickDemo('customer@foodhub.com', 'password123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
              >
                <User size={13} color="var(--primary)" /> Customer
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('restaurant@foodhub.com', 'password123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
              >
                <Store size={13} color="var(--primary)" /> Restaurant
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('delivery@foodhub.com', 'password123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
              >
                <Bike size={13} color="var(--primary)" /> Delivery
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('admin@foodhub.com', 'password123')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', justifyContent: 'flex-start' }}
              >
                <ShieldCheck size={13} color="var(--primary)" /> Admin
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
