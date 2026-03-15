import type { Category, RevealedCategory } from '../types';

interface CategoryCardLockedProps {
  category: Category;
  pick: string | undefined;
  revealed: RevealedCategory | undefined;
}

export function CategoryCardLocked({ category, pick, revealed }: CategoryCardLockedProps) {
  const isRevealed = !!revealed;
  const isCorrect = isRevealed && pick === revealed.winnerId;
  const pickedNominee = category.nominees.find(n => n.id === pick);
  const winnerNominee = revealed ? category.nominees.find(n => n.id === revealed.winnerId) : null;

  return (
    <div
      className="card"
      style={{
        marginBottom: 12,
        borderLeft: isRevealed
          ? `3px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`
          : '3px solid var(--gold-dim)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--gold)',
          fontSize: '0.9rem',
        }}>
          {category.name}
        </h3>
        <span style={{ fontSize: '1.2rem' }}>
          {!isRevealed ? '⏳' : isCorrect ? '✅' : '❌'}
        </span>
      </div>
      <div style={{ marginTop: 8, fontSize: '0.85rem' }}>
        <div style={{ color: 'var(--ivory-dim)' }}>
          Your pick: <span style={{ color: 'var(--ivory)', fontWeight: 500 }}>
            {pickedNominee?.name ?? 'None'}
          </span>
        </div>
        {isRevealed && !isCorrect && winnerNominee && (
          <div style={{ color: 'var(--green)', marginTop: 4 }}>
            Winner: {winnerNominee.name}
          </div>
        )}
      </div>
    </div>
  );
}
