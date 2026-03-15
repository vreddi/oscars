import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthContext } from '../context/AuthContext';
import { useGameContext } from '../context/GameContext';
import { generateGameCode } from '../utils/gameCode';
import { MAX_PLAYERS } from '../config/constants';
import type { GameDoc } from '../types';

export function useGame() {
  const { user, displayName, avatarSeed } = useAuthContext();
  const { game, gameCode, setGameCode } = useGameContext();

  const createGame = async (testMode = false): Promise<string> => {
    if (!user || !displayName) throw new Error('Not signed in');

    const code = generateGameCode();
    const gameData: GameDoc = {
      createdBy: user.uid,
      phase: 'lobby',
      testMode,
      players: {
        [user.uid]: {
          displayName,
          avatarSeed: avatarSeed || user.uid,
          joinedAt: serverTimestamp() as any,
          isAdmin: true,
        },
      },
      currentCategory: null,
      revealedCategories: {},
    };

    await setDoc(doc(db, 'games', code), gameData);
    setGameCode(code);
    return code;
  };

  const joinGame = async (code: string): Promise<void> => {
    if (!user || !displayName) throw new Error('Not signed in');

    const upperCode = code.toUpperCase();
    const snap = await getDoc(doc(db, 'games', upperCode));
    if (!snap.exists()) throw new Error('Game not found');

    const data = snap.data() as GameDoc;
    if (data.phase !== 'lobby') throw new Error('Game already started');
    const playerCount = Object.values(data.players).filter(p => !p.isHost).length;
    if (playerCount >= MAX_PLAYERS) throw new Error('Game is full');
    if (data.players[user.uid]) {
      setGameCode(upperCode);
      return;
    }

    await updateDoc(doc(db, 'games', upperCode), {
      [`players.${user.uid}`]: {
        displayName,
        avatarSeed: avatarSeed || user.uid,
        joinedAt: serverTimestamp(),
        isAdmin: false,
      },
    });
    setGameCode(upperCode);
  };

  const joinAsHost = async (code: string): Promise<void> => {
    if (!user || !displayName) throw new Error('Not signed in');

    const upperCode = code.toUpperCase();
    const snap = await getDoc(doc(db, 'games', upperCode));
    if (!snap.exists()) throw new Error('Game not found');

    const data = snap.data() as GameDoc;
    if (data.players[user.uid]) {
      setGameCode(upperCode);
      return;
    }

    await updateDoc(doc(db, 'games', upperCode), {
      [`players.${user.uid}`]: {
        displayName,
        avatarSeed: avatarSeed || user.uid,
        joinedAt: serverTimestamp(),
        isAdmin: true,
        isHost: true,
      },
    });
    setGameCode(upperCode);
  };

  const setPhase = async (phase: GameDoc['phase']) => {
    if (!gameCode) return;
    await updateDoc(doc(db, 'games', gameCode), { phase });
  };

  return { game, gameCode, createGame, joinGame, joinAsHost, setPhase };
}
