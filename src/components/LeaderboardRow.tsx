import { motion } from 'framer-motion';
import { Avatar } from './Avatar';
import type { LeaderboardEntry } from '../types';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
}

export function LeaderboardRow({ entry, rank, isCurrentUser }: LeaderboardRowProps) {
  return (
    <motion.div
      layout
      layoutId={entry.uid}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        background: isCurrentUser ? 'var(--black-hover)' : 'var(--black-card)',
        borderRadius: 'var(--radius-md)',
        border: isCurrentUser ? '1px solid var(--gold)' : '1px solid transparent',
        marginBottom: 8,
      }}
    >
      <div style={{
        width: 28,
        textAlign: 'center',
        fontWeight: 700,
        color: rank <= 3 ? 'var(--gold)' : 'var(--ivory-dim)',
        fontSize: rank <= 3 ? '1.1rem' : '0.9rem',
        fontFamily: 'var(--font-heading)',
      }}>
        {rank}
      </div>
      <Avatar seed={entry.avatarSeed} size={36} />
      <div style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>
        {entry.displayName}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
        <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
          {entry.score}
        </div>
        <div style={{ color: 'var(--ivory-dim)', fontSize: '0.7rem' }}>
          {entry.correctPicks} correct
        </div>
      </div>
    </motion.div>
  );
}
