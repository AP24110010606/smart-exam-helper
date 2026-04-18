import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setMsg('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      login(data.token, data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-matte-cream px-4 dark:bg-matte-night">
      <div className="w-full max-w-md rounded-2xl border border-matte-border bg-matte-paper p-8 shadow-matte dark:border-matte-night-border dark:bg-matte-night-card dark:shadow-none">
        <h1 className="font-landing text-center text-2xl font-semibold text-matte-charcoal dark:text-matte-cream">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-matte-charcoal-soft dark:text-matte-border-strong">Sign in to Ultimate Exam Helper</p>

        {msg && (
          <div className="mt-4 rounded-xl bg-matte-error-bg px-3 py-2 text-sm text-matte-error dark:bg-matte-terracotta/15 dark:text-matte-mustard-soft" role="alert">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal outline-none transition focus:border-matte-terracotta focus:ring-2 focus:ring-matte-terracotta/25 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            />
            {errors.email && <p className="mt-1 text-xs text-matte-error">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-matte-charcoal dark:text-matte-cream">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-matte-border-strong bg-matte-paper px-3 py-2 text-matte-charcoal outline-none transition focus:border-matte-terracotta focus:ring-2 focus:ring-matte-terracotta/25 dark:border-matte-night-border dark:bg-matte-night-elevated dark:text-matte-cream"
            />
            {errors.password && <p className="mt-1 text-xs text-matte-error">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-matte-terracotta py-2.5 font-semibold text-white transition hover:bg-matte-terracotta-hover hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
          No account?{' '}
          <Link to="/register" className="font-semibold text-matte-terracotta hover:underline dark:text-matte-terracotta-muted">
            Register
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-matte-charcoal-soft dark:text-matte-border-strong">
          <Link to="/" className="transition hover:text-matte-charcoal dark:hover:text-matte-cream">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
