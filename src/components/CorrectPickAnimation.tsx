import { motion, AnimatePresence } from 'framer-motion';

interface CorrectPickAnimationProps {
  show: boolean;
}

export function CorrectPickAnimation({ show }: CorrectPickAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: '4rem',
              textAlign: 'center',
            }}
          >
            <div>🎉</div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-heading)',
                color: 'var(--gold)',
                textShadow: '0 0 20px rgba(197, 164, 78, 0.5)',
              }}
            >
              +10 Points!
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
