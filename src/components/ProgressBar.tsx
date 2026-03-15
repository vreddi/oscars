import { TOTAL_CATEGORIES } from '../config/constants';

interface ProgressBarProps {
  filled: number;
}

export function ProgressBar({ filled }: ProgressBarProps) {
  const pct = (filled / TOTAL_CATEGORIES) * 100;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: 'var(--ivory-dim)',
        marginBottom: 6,
      }}>
        <span>{filled} / {TOTAL_CATEGORIES} picks made</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div style={{
        height: 6,
        background: 'var(--black-light)',
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: filled === TOTAL_CATEGORIES
            ? 'var(--green)'
            : 'linear-gradient(90deg, var(--gold), var(--gold-light))',
          borderRadius: 3,
          transition: 'width 300ms ease',
        }} />
      </div>
    </div>
  );
}
