import { AnimatePresence } from 'framer-motion';
import { LeaderboardRow } from './LeaderboardRow';
import type { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUid: string;
}

export function Leaderboard({ entries, currentUid }: LeaderboardProps) {
  // Compute tie-aware ranks: players with same score & correctPicks share a rank
  const ranks: number[] = [];
  entries.forEach((entry, i) => {
    if (i === 0) {
      ranks.push(1);
    } else {
      const prev = entries[i - 1];
      ranks.push(
        entry.score === prev.score && entry.correctPicks === prev.correctPicks
          ? ranks[i - 1]
          : i + 1
      );
    }
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
