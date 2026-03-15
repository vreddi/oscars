import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useGameContext } from '../context/GameContext';
import { useAdmin } from '../hooks/useAdmin';
import { useGame } from '../hooks/useGame';
import { usePredictions } from '../hooks/usePredictions';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { categories } from '../data/categories';
import { TestModeBanner } from '../components/TestModeBanner';
import { TabBar } from '../components/TabBar';
import { Leaderboard } from '../components/Leaderboard';
import { LiveCategoryView } from '../components/LiveCategoryView';

const TABS = ['Controls', 'Leaderboard', 'Live View'];

export function AdminPage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { game, setGameCode } = useGameContext();
  const { setCurrentCategory, revealWinner, endCeremony } = useAdmin();
  const { setPhase } = useGame();
  const { predictions } = usePredictions();
  const leaderboard = useLeaderboard();
  const [selectedWinners, setSelectedWinners] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (gameCode) setGameCode(gameCode);
  }, [gameCode, setGameCode]);

  useEffect(() => {
    if (game?.phase === 'ended') navigate(`/results/${gameCode}`);
  }, [game?.phase, gameCode, navigate]);

  if (!game || !user) {
    return <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>Loading...</div>;
  }

  const isAdmin = game.players[user.uid]?.isAdmin;
  if (!isAdmin) {
    return <div className="page" style={{ textAlign: 'center', paddingTop: 80, color: 'var(--red)' }}>Admin access only</div>;
  }

  const revealedCount = Object.keys(game.revealedCategories).length;

  return (
    <>
      {game.testMode && <TestModeBanner />}
      <div className="page">
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--gold)',
          fontSize: '1.4rem',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          Admin Panel
        </h1>

        <div style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--ivory-dim)',
          marginBottom: 16,
        }}>
          Phase: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{game.phase}</span>
          {' · '}
          {revealedCount}/24 revealed
        </div>

        <TabBar tabs={TABS} activeIndex={activeTab} onChange={setActiveTab} />

        {/* Tab 0: Controls */}
        {activeTab === 0 && (
          <div>
            {/* Phase controls */}
            {game.phase === 'predictions' && (
              <button
                className="btn-primary"
                onClick={() => setPhase('live')}
                style={{ marginBottom: 16 }}
              >
                Start Live Ceremony
              </button>
            )}

            {game.phase === 'live' && revealedCount === 24 && (
              <button
                className="btn-primary"
                onClick={endCeremony}
                style={{ marginBottom: 16 }}
              >
                End Ceremony
              </button>
            )}

            {/* Category controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categories.map((cat) => {
                const isRevealed = !!game.revealedCategories[cat.id];
                const isCurrent = game.currentCategory === cat.id;
                const winner = game.revealedCategories[cat.id];
                const winnerName = winner
                  ? cat.nominees.find(n => n.id === winner.winnerId)?.name
                  : null;

                return (
                  <div
                    key={cat.id}
                    className="card"
                    style={{
                      border: isCurrent ? '1px solid var(--gold)' : 'none',
                      opacity: isRevealed ? 0.6 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <h3 style={{ fontSize: '0.85rem', color: 'var(--gold)' }}>
                        {cat.name}
                      </h3>
                      {isRevealed && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--green)' }}>
                          Winner: {winnerName}
                        </span>
                      )}
                    </div>

                    {!isRevealed && (
                      <>
                        <select
                          value={selectedWinners[cat.id] ?? ''}
                          onChange={(e) => setSelectedWinners(prev => ({ ...prev, [cat.id]: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            background: 'var(--black-light)',
                            color: 'var(--ivory)',
                            border: '1px solid #333',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            marginBottom: 8,
                          }}
                        >
                          <option value="">Select winner...</option>
                          {cat.nominees.map(n => (
                            <option key={n.id} value={n.id}>{n.name}</option>
                          ))}
                        </select>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn-secondary"
                            onClick={() => setCurrentCategory(cat.id)}
                            style={{
                              flex: 1,
                              padding: '8px',
                              fontSize: '0.8rem',
                              background: isCurrent ? 'var(--gold-dim)' : undefined,
                            }}
                          >
                            {isCurrent ? 'Current' : 'Set Current'}
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => {
                              const winnerId = selectedWinners[cat.id];
                              if (winnerId) revealWinner(cat.id, winnerId);
                            }}
                            disabled={!selectedWinners[cat.id]}
                            style={{
                              flex: 1,
                              padding: '8px',
                              fontSize: '0.8rem',
                              borderColor: 'var(--green)',
                              color: 'var(--green)',
                            }}
                          >
                            Reveal Winner
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 1: Leaderboard */}
        {activeTab === 1 && (
          <Leaderboard entries={leaderboard} currentUid={user.uid} />
        )}

        {/* Tab 2: Live View */}
        {activeTab === 2 && (
          game.currentCategory !== null ? (
            <LiveCategoryView
              categoryIndex={game.currentCategory}
              pick={predictions?.picks[game.currentCategory]}
              revealed={game.revealedCategories[game.currentCategory]}
            />
          ) : (
            <div style={{
              textAlign: 'center',
              paddingTop: 60,
              color: 'var(--ivory-dim)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🎬</div>
              <p>No category selected yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: 8 }}>
                Go to Controls and "Set Current" on a category.
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}
