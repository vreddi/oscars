import { useState } from 'react';
import { categories } from '../data/categories';
import { useTmdbImage } from '../hooks/useTmdbImage';
import { getWinnerIds } from '../utils/scoring';
import type { Nominee, RevealedCategory } from '../types';

interface LiveCategoryViewProps {
  categoryIndex: number;
  pick: string | undefined;
  revealed: RevealedCategory | undefined;
}

function LiveNomineeImage({ name, type }: { name: string; type: 'person' | 'film' }) {
  const url = useTmdbImage(name, type);
  const [imgError, setImgError] = useState(false);
  if (!url || imgError) return null;
  return (
    <img
      src={url}
      alt={name}
      onError={() => setImgError(true)}
      loading="lazy"
      style={{
        width: type === 'person' ? 36 : 28,
        height: type === 'person' ? 36 : 40,
        borderRadius: type === 'person' ? '50%' : 4,
        objectFit: 'cover',
        flexShrink: 0,
      }}
    />
  );
}

function LiveNomineeRow({
  nominee,
  categoryType,
  isPick,
  isWinner,
  isRevealed,
  isCorrect,
}: {
  nominee: Nominee;
  categoryType: 'person' | 'film';
  isPick: boolean;
  isWinner: boolean;
  isRevealed: boolean;
  isCorrect: boolean;
}) {
  const searchName = categoryType === 'person' ? nominee.name : (nominee.film || nominee.name);

  let bg = 'var(--black-light)';
  let borderColor = '#333';
  let color = 'var(--ivory)';

  if (isRevealed && isWinner) {
    bg = 'var(--green-bg)';
    borderColor = 'var(--green)';
  } else if (isRevealed && isPick && !isCorrect) {
    bg = 'var(--red-bg)';
    borderColor = 'var(--red)';
    color = 'var(--red)';
  } else if (isPick && !isRevealed) {
    bg = 'var(--black-hover)';
    borderColor = 'var(--gold)';
  }

  return (
    <div
      style={{
        padding: '10px 14px',
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color,
        transition: 'all 300ms ease',
      }}
    >
      <LiveNomineeImage name={searchName} type={categoryType} />
      <span style={{ flex: 1, fontWeight: isPick || isWinner ? 600 : 400, textAlign: 'left' }}>
        {nominee.name}
        {nominee.film && (
          <span style={{ fontSize: '0.75rem', opacity: 0.7, display: 'block' }}>
            {nominee.film}
          </span>
        )}
      </span>
      <span style={{ flexShrink: 0, fontSize: '0.85rem' }}>
        {isPick && !isRevealed && '← Your pick'}
        {isRevealed && isWinner && isPick && '✅ +10'}
        {isRevealed && isWinner && !isPick && '🏆'}
        {isRevealed && isPick && !isWinner && '❌'}
      </span>
    </div>
  );
}

export function LiveCategoryView({ categoryIndex, pick, revealed }: LiveCategoryViewProps) {
  const category = categories[categoryIndex];
  if (!category) return null;

  const isRevealed = !!revealed;
  const winnerIds = revealed ? getWinnerIds(revealed) : [];
  const isCorrect = isRevealed && !!pick && winnerIds.includes(pick);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '0.75rem',
        color: 'var(--ivory-dim)',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
      }}>
        Now Presenting
      </div>
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        color: 'var(--gold)',
        fontSize: '1.5rem',
        marginBottom: 24,
      }}>
        {category.name}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {category.nominees.map((nominee) => (
          <LiveNomineeRow
            key={nominee.id}
            nominee={nominee}
            categoryType={category.type}
            isPick={pick === nominee.id}
            isWinner={winnerIds.includes(nominee.id)}
            isRevealed={isRevealed}
            isCorrect={isCorrect}
          />
        ))}
      </div>
    </div>
  );
}
