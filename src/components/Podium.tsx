import { motion } from 'framer-motion';
import { Avatar } from './Avatar';
import type { LeaderboardEntry } from '../types';

interface PodiumProps {
  entries: LeaderboardEntry[];
}

export function Podium({ entries }: PodiumProps) {
  const top3 = entries.slice(0, 3);

  // Compute tie-aware ranks for top 3
  const ranks = top3.map((entry, i) => {
    if (i === 0) return 1;
    const prev = top3[i - 1];
    if (entry.score === prev.score && entry.correctPicks === prev.correctPicks) {
      return ranks[i - 1];
    }
    return i + 1;
  });

  const heightByRank: Record<number, number> = { 1: 160, 2: 120, 3: 90 };
  const colorByRank: Record<number, string> = { 1: '#C5A44E', 2: '#C0C0C0', 3: '#CD7F32' };
  const labelByRank: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' };

  // Reorder for display: 2nd, 1st, 3rd (only when no ties at top)
  const allTiedForFirst = top3.length >= 2 && ranks.every(r => r === 1);
  const displayOrder = top3.length >= 3 && !allTiedForFirst
    ? [{ entry: top3[1], rank: ranks[1] }, { entry: top3[0], rank: ranks[0] }, { entry: top3[2], rank: ranks[2] }]
    : top3.map((entry, i) => ({ entry, rank: ranks[i] }));

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
      {displayOrder.map(({ entry, rank }, i) => {
        if (!entry) return null;
        const height = heightByRank[rank] ?? 90;
        const color = colorByRank[rank] ?? '#CD7F32';
        const label = labelByRank[rank] ?? `${rank}th`;
        const isCenter = top3.length >= 3 && !allTiedForFirst && i === 1;
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
            <Avatar seed={entry.avatarSeed} size={isCenter ? 64 : 48} />
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
              height,
              background: `linear-gradient(180deg, ${color}44, ${color}22)`,
              borderTop: `3px solid ${color}`,
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
              fontSize: '0.8rem',
              color,
              fontWeight: 700,
            }}>
              {label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
