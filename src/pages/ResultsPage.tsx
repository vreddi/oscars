import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useGameContext } from '../context/GameContext';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Podium } from '../components/Podium';
import { Leaderboard } from '../components/Leaderboard';

export function ResultsPage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { user } = useAuthContext();
  const { game, setGameCode } = useGameContext();
  const leaderboard = useLeaderboard();

  useEffect(() => {
    if (gameCode) setGameCode(gameCode);
  }, [gameCode, setGameCode]);

  if (!game || !user) {
    return <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>Loading...</div>;
  }

  const winner = leaderboard[0];
  const tiedWinners = winner
    ? leaderboard.filter(e => e.score === winner.score && e.correctPicks === winner.correctPicks)
    : [];
  const isTie = tiedWinners.length > 1;

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: '2.5rem' }}>{isTie ? '🤝' : '🏆'}</div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem',
          background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 4,
        }}>
          Final Results
        </h1>
        {winner && (
          <p style={{ color: 'var(--ivory-dim)', fontSize: '0.9rem' }}>
            {isTie
              ? `It's a tie! ${tiedWinners.map(w => w.displayName).join(' & ')} tied with ${winner.score} points!`
              : `${winner.displayName} wins with ${winner.score} points!`}
          </p>
        )}
      </div>

      <Podium entries={leaderboard} />

      <div style={{ marginTop: 32 }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--gold)',
          fontSize: '1.1rem',
          marginBottom: 12,
        }}>
          Full Standings
        </h2>
        <Leaderboard entries={leaderboard} currentUid={user.uid} />
      </div>
    </div>
  );
}
