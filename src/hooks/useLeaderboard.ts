import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useGameContext } from '../context/GameContext';
import { calculateScore } from '../utils/scoring';
import type { LeaderboardEntry, PredictionDoc } from '../types';

export function useLeaderboard() {
  const { game, gameCode } = useGameContext();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!gameCode || !game) return;

    const unsub = onSnapshot(
      collection(db, 'games', gameCode, 'predictions'),
      (snap) => {
        const entries: LeaderboardEntry[] = [];

        snap.forEach((predDoc) => {
          const uid = predDoc.id;
          const player = game.players[uid];
          if (!player || player.isHost) return;

          const data = predDoc.data() as PredictionDoc;
          const { score, correctPicks } = calculateScore(
            data.picks,
            game.revealedCategories
          );

          entries.push({
            uid,
            displayName: player.displayName,
            avatarSeed: player.avatarSeed,
            score,
            correctPicks,
          });
        });

        entries.sort((a, b) => b.score - a.score || b.correctPicks - a.correctPicks);
        setLeaderboard(entries);
      }
    );

    return unsub;
  }, [gameCode, game]);

  return leaderboard;
}
