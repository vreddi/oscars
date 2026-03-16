import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useGameContext } from '../context/GameContext';

export function useAdmin() {
  const { gameCode } = useGameContext();

  const setCurrentCategory = async (index: number) => {
    if (!gameCode) return;
    await updateDoc(doc(db, 'games', gameCode), {
      currentCategory: index,
    });
  };

  const revealWinner = async (categoryIndex: number, winnerId: string | string[]) => {
    if (!gameCode) return;
    await updateDoc(doc(db, 'games', gameCode), {
      [`revealedCategories.${categoryIndex}`]: {
        winnerId,
        revealedAt: serverTimestamp(),
      },
    });
  };

  const endCeremony = async () => {
    if (!gameCode) return;
    await updateDoc(doc(db, 'games', gameCode), {
      phase: 'ended',
      currentCategory: null,
    });
  };

  return { setCurrentCategory, revealWinner, endCeremony };
}
