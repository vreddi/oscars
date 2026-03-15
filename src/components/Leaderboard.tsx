import { AnimatePresence } from 'framer-motion';
import { LeaderboardRow } from './LeaderboardRow';
import type { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUid: string;
}

export function Leaderboard({ entries, currentUid }: LeaderboardProps) {
  // Compute tie-aware ranks: players with same score & correctPicks share a rank
  const ranks = entries.map((entry, i) => {
    if (i === 0) return 1;
    const prev = entries[i - 1];
    if (entry.score === prev.score && entry.correctPicks === prev.correctPicks) {
      return ranks[i - 1];
    }
    return i + 1;
  });

  return (
    <div>
      <AnimatePresence>
        {entries.map((entry, i) => (
          <LeaderboardRow
            key={entry.uid}
            entry={entry}
            rank={ranks[i]}
            isCurrentUser={entry.uid === currentUid}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
