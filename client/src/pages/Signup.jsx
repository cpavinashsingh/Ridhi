import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const iiitlEmailRegex = /^[^\s@]+@iiitl\.ac\.in$/i;

const hearts = [
  { id: 1, left: '8%', size: 'text-xl', delay: 0.1, duration: 7 },
  { id: 2, left: '18%', size: 'text-2xl', delay: 1.2, duration: 8 },
  { id: 3, left: '31%', size: 'text-lg', delay: 0.8, duration: 6.5 },
  { id: 4, left: '43%', size: 'text-2xl', delay: 2.1, duration: 9 },
  { id: 5, left: '57%', size: 'text-xl', delay: 0.4, duration: 7.8 },
  { id: 6, left: '69%', size: 'text-lg', delay: 1.6, duration: 6.8 },
  { id: 7, left: '82%', size: 'text-2xl', delay: 2.8, duration: 8.6 },
  { id: 8, left: '92%', size: 'text-xl', delay: 1, duration: 7.2 }
];

const Signup = () => {
  const navigate = useNavigate();
  const { pendingSignup, sendOtp, verifyOtp, completeSignup } = useAuth();
  const [step, setStep] = useState(pendingSignup?.otpVerified ? 2 : 1);
  const [form, setForm] = useState({
    username: pendingSignup?.username || '',
    email: pendingSignup?.email || 'lcs2025022@iiitl.ac.in',
    password: pendingSignup?.password || '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canVerify = useMemo(
    () => Boolean(form.username && form.email && form.password),
    [form.username, form.email, form.password]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSendOtp = async () => {
    setError('');

    if (!iiitlEmailRegex.test(form.email.trim())) {
      setError('Email must end with @iiitl.ac.in');
      return;
    }

    setLoading(true);

    try {
      await sendOtp({
        username: form.username,
        email: form.email,
        password: form.password
      });
      setStep(2);
    } catch (submissionError) {
      setError(
        submissionError?.response?.data?.message ||
          submissionError?.message ||
          'Failed to send OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');

    if (!iiitlEmailRegex.test(form.email.trim())) {
      setError('Email must end with @iiitl.ac.in');
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({ email: form.email, otp: form.otp });
      await completeSignup(form.email);
      navigate('/chat', { replace: true });
    } catch (submissionError) {
      setError(submissionError?.response?.data?.message || submissionError.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        {hearts.map((heart) => (
          <motion.span
            key={heart.id}
            className={`absolute ${heart.size} text-rose-100/35`}
            style={{ left: heart.left, bottom: '-5%' }}
            animate={{ y: ['0%', '-120vh'], x: [0, 12, -10, 8, 0], opacity: [0, 0.8, 0.65, 0] }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.6
            }}
          >
            ❤
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 mx-auto w-full max-w-4xl"
      >
        <form className="glass-premium mx-auto w-full rounded-[2.1rem] p-8 md:p-10">
          <div className="text-center">
            <p className="text-lg font-semibold uppercase tracking-[0.28em] text-rose-200">Welcome Ridhi</p>
            <h2 className="romantic-title mt-3 text-5xl font-bold text-rose-50"></h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-rose-100/80">
              This space is only for you. Create your account and unlock the sweetest little chat corner.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-rose-100">Username</span>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="input-premium w-full rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-white outline-none ring-0 placeholder:text-rose-100/55"
                placeholder="lovely username"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-rose-100">Email</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-premium w-full rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-white outline-none ring-0 placeholder:text-rose-100/55"
                placeholder="name@iiitl.ac.in"
              />
              {!iiitlEmailRegex.test(form.email.trim()) ? (
                <p className="mt-2 text-xs font-medium text-rose-200/90">Email must end with @iiitl.ac.in</p>
              ) : null}
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-rose-100">Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-premium w-full rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-white outline-none placeholder:text-rose-100/55"
                placeholder="Create Your Secret Password"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-rose-100">OTP code</span>
              <input
                name="otp"
                value={form.otp}
                onChange={handleChange}
                disabled={step < 2}
                className="input-premium w-full rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-white outline-none placeholder:text-rose-100/55 disabled:cursor-not-allowed disabled:opacity-55"
                placeholder="6-digit OTP"
              />
            </label>
          </div>

          <div className="mt-8 grid gap-4">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!canVerify || loading}
              className="w-full rounded-2xl bg-gradient-to-r from-rose-300 to-pink-300 px-4 py-3 font-semibold text-rose-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && step === 1 ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={step < 2 || loading || !form.otp}
              className="w-full rounded-2xl border border-white/20 bg-white/12 px-4 py-3 font-semibold text-rose-50 transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && step === 2 ? 'Verifying...' : 'Verify OTP and Signup'}
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-rose-100/80">
            If you are not Ridhi,{' '}
            <button
              type="button"
              onClick={() => navigate('/bye')}
              className="font-bold underline decoration-rose-100/70 underline-offset-4"
            >
              click here
            </button>
          </p>

          {error ? (
            <p className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>
          ) : null}
        </form>

      </motion.div>
    </main>
  );
};

export default Signup;
