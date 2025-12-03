'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface LoadingPortfolioRevealProps {
  color?: string;
  highlightColor?: string;
}

export default function LoadingPortfolioReveal({ color, highlightColor }: LoadingPortfolioRevealProps) {
  const [visible, setVisible] = useState(true);
  const [expandHorizontal, setExpandHorizontal] = useState(false);
  const primary = color || '#111';
  const highlight = highlightColor || '#F59E0B';

  useEffect(() => {
    // Line completes in 0.9s, then expand horizontally
    const expandTimer = setTimeout(() => setExpandHorizontal(true), 900);
    // Total animation: 0.9s (line) + 0.5s (expand) = 1.4s minimum
    const hideTimer = setTimeout(() => setVisible(false), 2000);
    return () => {
      clearTimeout(expandTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: primary }}
        >
          <motion.div
            className="h-screen bg-white"
            initial={{ scaleY: 0, width: '8px' }}
            animate={{
              scaleY: expandHorizontal ? 1 : [0, 0.6, 1],
              width: expandHorizontal ? '100vw' : '8px',
            }}
            transition={{
              scaleY: {
                duration: 0.9,
                times: [0, 0.5, 1],
                ease: 'easeInOut',
              },
              width: {
                duration: 0.5,
                ease: 'easeInOut',
                delay: expandHorizontal ? 0 : 0.9,
              },
            }}
            style={{ transformOrigin: 'center' }}
          />

          <motion.span
            className="absolute bottom-12 px-4 py-2 text-base uppercase tracking-[0.2em] text-white rounded z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ backgroundColor: highlight }}
          >
            Loading…
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
