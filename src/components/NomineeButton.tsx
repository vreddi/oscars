import { useState } from 'react';
import type { Nominee } from '../types';
import { useTmdbImage } from '../hooks/useTmdbImage';

interface NomineeButtonProps {
  nominee: Nominee;
  selected: boolean;
  disabled?: boolean;
  categoryType: 'person' | 'film';
  onClick: () => void;
}

function InitialPlaceholder({ name, type, selected }: { name: string; type: 'person' | 'film'; selected: boolean }) {
  return (
    <div style={{
      width: type === 'person' ? 40 : 32,
      height: type === 'person' ? 40 : 44,
      borderRadius: type === 'person' ? '50%' : 4,
      background: selected
        ? 'rgba(13, 13, 13, 0.3)'
        : 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.8rem',
      fontWeight: 700,
      color: 'var(--black)',
      flexShrink: 0,
    }}>
      {name.charAt(0)}
    </div>
  );
}

function NomineeImage({ name, type, selected }: { name: string; type: 'person' | 'film'; selected: boolean }) {
  const imageUrl = useTmdbImage(name, type);
  const [imgError, setImgError] = useState(false);

  if (!imageUrl || imgError) {
    return <InitialPlaceholder name={name} type={type} selected={selected} />;
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      onError={() => setImgError(true)}
      loading="lazy"
      style={{
        width: type === 'person' ? 40 : 32,
        height: type === 'person' ? 40 : 44,
        borderRadius: type === 'person' ? '50%' : 4,
        objectFit: 'cover',
        flexShrink: 0,
      }}
    />
  );
}

export function NomineeButton({ nominee, selected, disabled, categoryType, onClick }: NomineeButtonProps) {
  const searchName = categoryType === 'person' ? nominee.name : (nominee.film || nominee.name);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '8px 12px',
        background: selected
          ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
          : 'var(--black-light)',
        color: selected ? 'var(--black)' : 'var(--ivory)',
        border: selected ? 'none' : '1px solid #333',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.9rem',
        fontWeight: selected ? 600 : 400,
        textAlign: 'left',
        transition: 'all var(--transition)',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <NomineeImage name={searchName} type={categoryType} selected={selected} />
      <span style={{ flex: 1, minWidth: 0 }}>
        {nominee.name}
        {nominee.film && (
          <span style={{
            display: 'block',
            fontSize: '0.75rem',
            opacity: 0.7,
            marginTop: 2,
          }}>
            {nominee.film}
          </span>
        )}
      </span>
      {selected && <span>&#10003;</span>}
    </button>
  );
}
