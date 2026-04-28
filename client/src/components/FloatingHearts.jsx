import { motion } from 'framer-motion';

const hearts = [
  { id: 1, left: '6%', delay: 0.2, duration: 12, size: 'text-lg' },
  { id: 2, left: '14%', delay: 1.1, duration: 11, size: 'text-2xl' },
  { id: 3, left: '25%', delay: 2.4, duration: 13, size: 'text-xl' },
  { id: 4, left: '39%', delay: 0.7, duration: 10, size: 'text-lg' },
  { id: 5, left: '52%', delay: 2, duration: 12, size: 'text-2xl' },
  { id: 6, left: '64%', delay: 1.4, duration: 11.5, size: 'text-xl' },
  { id: 7, left: '75%', delay: 0.5, duration: 10.5, size: 'text-lg' },
  { id: 8, left: '86%', delay: 1.9, duration: 12.2, size: 'text-xl' },
  { id: 9, left: '94%', delay: 2.6, duration: 11.8, size: 'text-lg' }
];

const FloatingHearts = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className={`absolute ${heart.size} text-rose-300/45`}
          style={{ left: heart.left, bottom: '-8%' }}
          animate={{ y: ['0%', '-125vh'], x: [0, 12, -10, 8, 0], opacity: [0, 0.65, 0.45, 0] }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 0.4
          }}
        >
          ❤
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingHearts;
