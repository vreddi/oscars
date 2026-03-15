import { AnimatePresence } from 'framer-motion';
import { LeaderboardRow } from './LeaderboardRow';
import type { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUid: string;
}

export function Leaderboard({ entries, currentUid }: LeaderboardProps) {
  return (
    <div>
      <AnimatePresence>
        {entries.map((entry, i) => (
          <LeaderboardRow
            key={entry.uid}
            entry={entry}
            rank={i + 1}
            isCurrentUser={entry.uid === currentUid}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
