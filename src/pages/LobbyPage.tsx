import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useGameContext } from '../context/GameContext';
import { useGame } from '../hooks/useGame';
import { GameCodeDisplay } from '../components/GameCodeDisplay';
import { PlayerCard } from '../components/PlayerCard';
import { TestModeBanner } from '../components/TestModeBanner';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { categories } from '../data/categories';

export function LobbyPage() {
  const { gameCode: paramCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { game, setGameCode } = useGameContext();
  const { setPhase } = useGame();

  useEffect(() => {
    if (paramCode) setGameCode(paramCode);
  }, [paramCode, setGameCode]);

  useEffect(() => {
    if (game?.phase === 'predictions') navigate(`/predict/${paramCode}`);
    if (game?.phase === 'live') navigate(`/live/${paramCode}`);
    if (game?.phase === 'ended') navigate(`/results/${paramCode}`);
  }, [game?.phase, paramCode, navigate]);

  if (!game || !user) {
    return <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>Loading...</div>;
  }

  const isAdmin = game.players[user.uid]?.isAdmin;
  const playerList = Object.entries(game.players);

  const addBot = async () => {
    if (!paramCode) return;
    const botId = `bot-${Date.now()}`;
    const botNames = ['Oscar Bot', 'Film Buff', 'Movie Maven', 'Reel Deal', 'Star Pick', 'Cine Fan'];
    const name = botNames[Math.floor(Math.random() * botNames.length)];

    // Add bot to players
    await updateDoc(doc(db, 'games', paramCode), {
      [`players.${botId}`]: {
        displayName: name,
        avatarSeed: botId,
        joinedAt: serverTimestamp(),
        isAdmin: false,
      },
    });

    // Create random predictions for bot
    const picks: Record<string, string> = {};
    for (const cat of categories) {
      const randomNominee = cat.nominees[Math.floor(Math.random() * cat.nominees.length)];
      picks[cat.id] = randomNominee.id;
    }
    await setDoc(doc(db, 'games', paramCode, 'predictions', botId), {
      picks,
      lockedAt: serverTimestamp(),
    });
  };

  return (
    <>
      {game.testMode && <TestModeBanner />}
      <div className="page">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.6rem' }}>
            Game Lobby
          </h1>
        </div>

        <GameCodeDisplay code={paramCode!} />

        <div style={{ marginTop: 24 }}>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--ivory-dim)',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            Players ({playerList.length}/6)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {playerList.map(([uid, player]) => (
              <PlayerCard
                key={uid}
                displayName={player.displayName}
                avatarSeed={player.avatarSeed}
                isAdmin={player.isAdmin}
              />
            ))}
          </div>
        </div>

        {isAdmin && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="btn-primary"
              onClick={() => setPhase('predictions')}
            >
              Start Predictions
            </button>
            {game.testMode && (
              <button className="btn-secondary" onClick={addBot}>
                + Add Bot
              </button>
            )}
          </div>
        )}

        {!isAdmin && (
          <div style={{
            textAlign: 'center',
            color: 'var(--ivory-dim)',
            marginTop: 32,
            fontSize: '0.85rem',
          }}>
            Waiting for host to start...
          </div>
        )}
      </div>
    </>
  );
}
