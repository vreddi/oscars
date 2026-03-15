import { motion } from 'framer-motion';
import { Avatar } from './Avatar';
import type { LeaderboardEntry } from '../types';

interface PodiumProps {
  entries: LeaderboardEntry[];
}

export function Podium({ entries }: PodiumProps) {
  const top3 = entries.slice(0, 3);
  // Reorder for display: 2nd, 1st, 3rd
  const displayOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  const heights = [120, 160, 90];
  const colors = ['#C0C0C0', '#C5A44E', '#CD7F32'];
  const labels = ['2nd', '1st', '3rd'];

  if (top3.length < 2) {
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: 8,
      padding: '20px 0 0',
    }}>
      {displayOrder.map((entry, i) => {
        if (!entry) return null;
        const actualIndex = top3.length >= 3 ? i : i;
        return (
          <motion.div
            key={entry.uid}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Avatar seed={entry.avatarSeed} size={top3.length >= 3 && i === 1 ? 64 : 48} />
            <div style={{
              fontWeight: 600,
              fontSize: '0.85rem',
              marginTop: 8,
              textAlign: 'center',
            }}>
              {entry.displayName}
            </div>
            <div style={{
              color: 'var(--gold)',
              fontWeight: 700,
              fontSize: '1.2rem',
              fontFamily: 'var(--font-heading)',
            }}>
              {entry.score}
            </div>
            <div style={{
              width: '100%',
              height: heights[actualIndex],
              background: `linear-gradient(180deg, ${colors[actualIndex]}44, ${colors[actualIndex]}22)`,
              borderTop: `3px solid ${colors[actualIndex]}`,
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
              fontSize: '0.8rem',
              color: colors[actualIndex],
              fontWeight: 700,
            }}>
              {labels[actualIndex]}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
