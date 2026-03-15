import { useCountdown } from '../hooks/useCountdown';

export function Countdown() {
  const { hours, minutes, seconds, isExpired } = useCountdown();

  if (isExpired) {
    return (
      <div style={{
        textAlign: 'center',
        color: 'var(--red)',
        fontWeight: 600,
        padding: '8px 0',
      }}>
        Predictions are locked!
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{
      textAlign: 'center',
      padding: '8px 0',
      color: 'var(--ivory-dim)',
      fontSize: '0.85rem',
    }}>
      Locks in{' '}
      <span style={{ color: 'var(--gold)', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  );
}
