import { POINTS_PER_CORRECT } from '../config/constants';
import type { RevealedCategory } from '../types';

export function calculateScore(
  picks: Record<string, string>,
  revealedCategories: Record<string, RevealedCategory>
): { score: number; correctPicks: number } {
  let score = 0;
  let correctPicks = 0;

  for (const [categoryIndex, revealed] of Object.entries(revealedCategories)) {
    if (picks[categoryIndex] === revealed.winnerId) {
      score += POINTS_PER_CORRECT;
      correctPicks++;
    }
  }

  return { score, correctPicks };
}
