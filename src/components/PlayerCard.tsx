import { Avatar } from './Avatar';

interface PlayerCardProps {
  displayName: string;
  avatarSeed: string;
  isAdmin?: boolean;
  score?: number;
}

export function PlayerCard({ displayName, avatarSeed, isAdmin, score }: PlayerCardProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      background: 'var(--black-card)',
      borderRadius: 'var(--radius-md)',
      border: isAdmin ? '1px solid var(--gold)' : '1px solid transparent',
    }}>
      <Avatar seed={avatarSeed} size={40} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
          {displayName}
          {isAdmin && (
            <span style={{ color: 'var(--gold)', fontSize: '0.75rem', marginLeft: 6 }}>
              HOST
            </span>
          )}
        </div>
      </div>
      {score !== undefined && (
        <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
          {score}
        </div>
      )}
    </div>
  );
}
