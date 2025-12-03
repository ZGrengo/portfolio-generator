'use client';

import { motion } from 'framer-motion';

export default function LoadingPortfolioReveal() {
  const primary = '#111';

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: primary }}
    >
      {/* Bar */}
      <motion.div
        className="h-0 w-[3px] rounded-full bg-white"
        animate={{
          height: ['0%', '60%', '100%'],
        }}
        transition={{
          duration: 2,
          times: [0, 0.5, 1],
          ease: 'easeInOut',
        }}
      />

      {/* Text */}
      <motion.span
        className="absolute bottom-12 text-xs uppercase tracking-[0.2em] text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.65, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        Loading…
      </motion.span>
    </motion.div>
  );
}
