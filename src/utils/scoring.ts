import { POINTS_PER_CORRECT } from '../config/constants';
import type { RevealedCategory } from '../types';

/** Normalize winnerId (string or string[]) into an array for comparison */
export function getWinnerIds(revealed: RevealedCategory): string[] {
  return Array.isArray(revealed.winnerId) ? revealed.winnerId : [revealed.winnerId];
}

export function calculateScore(
  picks: Record<string, string>,
  revealedCategories: Record<string, RevealedCategory>
): { score: number; correctPicks: number } {
  let score = 0;
  let correctPicks = 0;

  for (const [categoryIndex, revealed] of Object.entries(revealedCategories)) {
    if (getWinnerIds(revealed).includes(picks[categoryIndex])) {
      score += POINTS_PER_CORRECT;
      correctPicks++;
    }
  }

  return { score, correctPicks };
}
