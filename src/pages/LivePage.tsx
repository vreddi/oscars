import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useGameContext } from '../context/GameContext';
import { usePredictions } from '../hooks/usePredictions';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { categories } from '../data/categories';
import { TabBar } from '../components/TabBar';
import { LiveCategoryView } from '../components/LiveCategoryView';
import { Leaderboard } from '../components/Leaderboard';
import { CategoryCardLocked } from '../components/CategoryCardLocked';
import { CorrectPickAnimation } from '../components/CorrectPickAnimation';
import { Podium } from '../components/Podium';
import { TestModeBanner } from '../components/TestModeBanner';
import useSound from 'use-sound';

const TABS = ['Live', 'Leaderboard', 'My Picks'];

export function LivePage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const { user } = useAuthContext();
  const { game, setGameCode } = useGameContext();
  const { predictions } = usePredictions();
  const leaderboard = useLeaderboard();
  const [activeTab, setActiveTab] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const prevRevealedCount = useRef(0);

  const [playCorrect] = useSound('/sounds/correct.mp3', { volume: 0.5 });

  useEffect(() => {
    if (gameCode) setGameCode(gameCode);
  }, [gameCode, setGameCode]);

  // Detect new reveals and check if correct
  useEffect(() => {
    if (!game || !predictions) return;
    const revealedCount = Object.keys(game.revealedCategories).length;
    if (revealedCount > prevRevealedCount.current && prevRevealedCount.current > 0) {
      // Check the latest revealed category
      const latestIndex = Object.keys(game.revealedCategories).pop();
      if (latestIndex !== undefined) {
        const revealed = game.revealedCategories[latestIndex];
        const pick = predictions.picks[latestIndex];
        if (pick === revealed.winnerId) {
          setShowCorrect(true);
          try { playCorrect(); } catch {}
          setTimeout(() => setShowCorrect(false), 2000);
        }
      }
    }
    prevRevealedCount.current = revealedCount;
  }, [game?.revealedCategories, predictions]);

  if (!game || !user || !predictions) {
    return <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>Loading...</div>;
  }

  const revealedCount = Object.keys(game.revealedCategories).length;
  const isEnded = game.phase === 'ended';

  return (
    <>
      {game.testMode && <TestModeBanner />}
      <CorrectPickAnimation show={showCorrect} />
      <div className="page">
        {isEnded ? (
          /* ---- Ceremony ended: show podium + full results ---- */
          <div>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: '2.5rem' }}>🏆</div>
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
              {leaderboard[0] && (
                <p style={{ color: 'var(--ivory-dim)', fontSize: '0.9rem' }}>
                  {leaderboard[0].displayName} wins with {leaderboard[0].score} points!
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

            <div style={{ marginTop: 24 }}>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--gold)',
                fontSize: '1.1rem',
                marginBottom: 12,
              }}>
                Your Picks
              </h2>
              {categories.map((cat) => (
                <CategoryCardLocked
                  key={cat.id}
                  category={cat}
                  pick={predictions.picks[cat.id]}
                  revealed={game.revealedCategories[cat.id]}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ---- Ceremony in progress: tabbed live view ---- */
          <>
            <div style={{
              textAlign: 'center',
              marginBottom: 16,
              fontSize: '0.75rem',
              color: 'var(--ivory-dim)',
            }}>
              {revealedCount} / 24 categories revealed
            </div>

            <TabBar tabs={TABS} activeIndex={activeTab} onChange={setActiveTab} />

            {activeTab === 0 && (
              game.currentCategory !== null ? (
                <LiveCategoryView
                  categoryIndex={game.currentCategory}
                  pick={predictions.picks[game.currentCategory]}
                  revealed={game.revealedCategories[game.currentCategory]}
                />
              ) : (
                <div style={{
                  textAlign: 'center',
                  paddingTop: 60,
                  color: 'var(--ivory-dim)',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>🎬</div>
                  <p>Waiting for the next category...</p>
                </div>
              )
            )}

            {activeTab === 1 && (
              <Leaderboard entries={leaderboard} currentUid={user.uid} />
            )}

            {activeTab === 2 && (
              <div>
                {categories.map((cat) => (
                  <CategoryCardLocked
                    key={cat.id}
                    category={cat}
                    pick={predictions.picks[cat.id]}
                    revealed={game.revealedCategories[cat.id]}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
