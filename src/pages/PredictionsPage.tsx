import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useGameContext } from '../context/GameContext';
import { useGame } from '../hooks/useGame';
import { usePredictions } from '../hooks/usePredictions';
import { categories } from '../data/categories';
import { CategoryCard } from '../components/CategoryCard';
import { ProgressBar } from '../components/ProgressBar';
import { Countdown } from '../components/Countdown';
import { TestModeBanner } from '../components/TestModeBanner';
import { isLocked } from '../utils/time';

export function PredictionsPage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { game, setGameCode } = useGameContext();
  const { setPhase } = useGame();
  const { predictions, setPick, lockPicks, randomizePicks } = usePredictions();

  useEffect(() => {
    if (gameCode) setGameCode(gameCode);
  }, [gameCode, setGameCode]);

  useEffect(() => {
    if (game?.phase === 'live') navigate(`/live/${gameCode}`);
    if (game?.phase === 'ended') navigate(`/results/${gameCode}`);
  }, [game?.phase, gameCode, navigate]);

  if (!game || !predictions) {
    return <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>Loading...</div>;
  }

  const locked = isLocked(game.testMode) || !!predictions.lockedAt;
  const filledCount = Object.keys(predictions.picks).length;
  const isAdmin = !!(user && game.players[user.uid]?.isAdmin);

  return (
    <>
      {game.testMode && <TestModeBanner />}
      <div className="page">
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--gold)',
          fontSize: '1.4rem',
          textAlign: 'center',
          marginBottom: 16,
        }}>
          Make Your Picks
        </h1>

        {!game.testMode && <Countdown />}

        <ProgressBar filled={filledCount} />

        {locked && (
          <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              textAlign: 'center',
              padding: '10px 16px',
              background: 'var(--green-bg)',
              border: '1px solid var(--green)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--green)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}>
              Your picks are locked in!
            </div>

            {isAdmin && (
              <button
                className="btn-primary"
                onClick={async () => {
                  await setPhase('live');
                  navigate(`/admin/${gameCode}`);
                }}
              >
                Start Live Ceremony
              </button>
            )}

            {!isAdmin && (
              <div style={{
                textAlign: 'center',
                color: 'var(--ivory-dim)',
                fontSize: '0.85rem',
                padding: '8px 0',
              }}>
                Waiting for host to start the ceremony...
              </div>
            )}
          </div>
        )}

        {game.testMode && !locked && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              className="btn-secondary"
              onClick={() => randomizePicks(categories)}
              style={{ flex: 1 }}
            >
              Randomize Picks
            </button>
            <button
              className="btn-secondary"
              onClick={lockPicks}
              disabled={filledCount < 24}
              style={{ flex: 1 }}
            >
              Lock Picks
            </button>
          </div>
        )}

        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            selectedNomineeId={predictions.picks[cat.id]}
            onSelect={(nomineeId) => setPick(cat.id, nomineeId)}
            disabled={locked}
          />
        ))}
      </div>
    </>
  );
}
