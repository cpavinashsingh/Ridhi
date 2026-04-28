import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Bye = () => {
  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-gradient-to-b from-rose-950 via-red-950 to-slate-950 px-4 py-10">
      <motion.div
        className="absolute inset-0 bg-black/35"
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <motion.div
          className="relative mb-8 flex items-center justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.span
            className="absolute text-6xl"
            animate={{ scale: [1, 0.88, 1], rotate: [0, -3, 3, 0], opacity: [0.95, 0.5, 0.95] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            💔
          </motion.span>
          <motion.span
            className="relative z-10 h-20 w-px bg-white/60"
            animate={{ opacity: [0.15, 1, 0.15], scaleY: [0.7, 1.1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.h1
          className="text-6xl font-black tracking-tight text-white md:text-7xl"
          animate={{ opacity: [1, 0.32, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          FUCK OFF
        </motion.h1>

        <motion.p
          className="mt-4 text-sm uppercase tracking-[0.34em] text-rose-200/85"
          animate={{ opacity: [0.8, 0.35, 0.8] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          If you are Ridhi, then Sorry.
          Please back to Sign Up ..
        </motion.p>

        <Link
          to="/signup"
          className="mt-10 inline-flex rounded-full border border-white/35 bg-white/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
        >
          Back to signup
        </Link>
      </div>
    </main>
  );
};

export default Bye;
