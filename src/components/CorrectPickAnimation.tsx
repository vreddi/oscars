import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CorrectPickAnimationProps {
  show: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
  drift: number;
  shape: 'rect' | 'circle';
}

const COLORS = ['#C5A44E', '#E8D48B', '#F5F0E8', '#FFD700', '#FFA500', '#FF6347', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0'];
const PIECE_COUNT = 60;

function generatePieces(): ConfettiPiece[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 1.5 + Math.random() * 1.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 4 + Math.random() * 8,
    rotation: Math.random() * 720 - 360,
    drift: (Math.random() - 0.5) * 120,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }));
}

export function CorrectPickAnimation({ show }: CorrectPickAnimationProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show) setPieces(generatePieces());
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Confetti pieces */}
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                x: `calc(${p.x}vw + ${p.drift}px)`,
                rotate: p.rotation,
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: 'absolute',
                width: p.shape === 'rect' ? p.size : p.size,
                height: p.shape === 'rect' ? p.size * 0.6 : p.size,
                borderRadius: p.shape === 'circle' ? '50%' : 2,
                backgroundColor: p.color,
              }}
            />
          ))}

          {/* Center text */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: 'var(--gold)',
                  textShadow: '0 0 30px rgba(197, 164, 78, 0.6), 0 2px 10px rgba(0,0,0,0.5)',
                }}
              >
                +10 Points!
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
