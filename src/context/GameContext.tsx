import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { GameDoc } from '../types';

interface GameState {
  game: GameDoc | null;
  gameCode: string | null;
  loading: boolean;
  setGameCode: (code: string | null) => void;
}

const GameContext = createContext<GameState>({
  game: null,
  gameCode: null,
  loading: true,
  setGameCode: () => {},
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<GameDoc | null>(null);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gameCode) {
      setGame(null);
      return;
    }
    setLoading(true);
    const unsub = onSnapshot(doc(db, 'games', gameCode), (snap) => {
      if (snap.exists()) {
        setGame(snap.data() as GameDoc);
      } else {
        setGame(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [gameCode]);

  return (
    <GameContext.Provider value={{ game, gameCode, loading, setGameCode }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
