import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/chat';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (submissionError) {
      setError(submissionError?.response?.data?.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="glass-premium mx-auto w-full max-w-md rounded-[2.1rem] p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-200">Welcome back</p>
          <h2 className="romantic-title mt-3 text-5xl font-bold text-rose-50">Login</h2>
          <p className="mt-2 text-sm text-rose-100/80">Use your username and password.</p>
        </div>

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-rose-100">Username</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="input-premium w-full rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-white outline-none ring-0 placeholder:text-rose-100/55"
              placeholder="your username"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-rose-100">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input-premium w-full rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-white outline-none placeholder:text-rose-100/55"
              placeholder="••••••••"
            />
          </label>
        </div>

        {error ? <p className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-rose-300 to-pink-300 px-4 py-3 font-semibold text-rose-950 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
};

export default Login;
