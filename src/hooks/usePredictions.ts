import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthContext } from '../context/AuthContext';
import { useGameContext } from '../context/GameContext';
import type { PredictionDoc } from '../types';

export function usePredictions() {
  const { user } = useAuthContext();
  const { gameCode } = useGameContext();
  const [predictions, setPredictions] = useState<PredictionDoc | null>(null);

  useEffect(() => {
    if (!user || !gameCode) return;
    const unsub = onSnapshot(
      doc(db, 'games', gameCode, 'predictions', user.uid),
      (snap) => {
        if (snap.exists()) {
          setPredictions(snap.data() as PredictionDoc);
        } else {
          setPredictions({ picks: {}, lockedAt: null });
        }
      }
    );
    return unsub;
  }, [user, gameCode]);

  const setPick = async (categoryIndex: number, nomineeId: string) => {
    if (!user || !gameCode || predictions?.lockedAt) return;
    const ref = doc(db, 'games', gameCode, 'predictions', user.uid);
    await setDoc(ref, {
      picks: { ...predictions?.picks, [categoryIndex]: nomineeId },
      lockedAt: null,
    }, { merge: true });
  };

  const lockPicks = async () => {
    if (!user || !gameCode) return;
    const ref = doc(db, 'games', gameCode, 'predictions', user.uid);
    await setDoc(ref, { lockedAt: serverTimestamp() }, { merge: true });
  };

  const randomizePicks = async (categories: { id: number; nominees: { id: string }[] }[]) => {
    if (!user || !gameCode) return;
    const picks: Record<string, string> = {};
    for (const cat of categories) {
      const randomNominee = cat.nominees[Math.floor(Math.random() * cat.nominees.length)];
      picks[cat.id] = randomNominee.id;
    }
    const ref = doc(db, 'games', gameCode, 'predictions', user.uid);
    await setDoc(ref, { picks, lockedAt: null }, { merge: true });
  };

  return { predictions, setPick, lockPicks, randomizePicks };
}
