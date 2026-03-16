import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  displayName: string;
  avatarSeed: string;
  createdAt: Timestamp;
}

export interface Player {
  displayName: string;
  avatarSeed: string;
  joinedAt: Timestamp;
  isAdmin: boolean;
  isHost?: boolean;
}

export type GamePhase = 'lobby' | 'predictions' | 'live' | 'ended';

export interface RevealedCategory {
  winnerId: string | string[];
  revealedAt: Timestamp;
}

export interface GameDoc {
  createdBy: string;
  phase: GamePhase;
  testMode: boolean;
  players: Record<string, Player>;
  currentCategory: number | null;
  revealedCategories: Record<string, RevealedCategory>;
}

export interface PredictionDoc {
  picks: Record<string, string>; // categoryIndex -> nomineeId
  lockedAt: Timestamp | null;
}

export interface Nominee {
  id: string;
  name: string;
  film?: string;
  tmdbId?: number;
}

export interface Category {
  id: number;
  name: string;
  type: 'film' | 'person';
  nominees: Nominee[];
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  avatarSeed: string;
  score: number;
  correctPicks: number;
}
