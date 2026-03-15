import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useGame } from '../hooks/useGame';
import { Avatar } from '../components/Avatar';
import { generateRandomSeed, playAvatarSound, getGender } from '../utils/avatarSound';

export function HomePage() {
  const navigate = useNavigate();
  const { user, displayName, avatarSeed, signIn, updateAvatarSeed } = useAuthContext();
  const { createGame, joinGame } = useGame();

  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [testMode, setTestMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'initial' | 'avatar' | 'menu'>('initial');
  const [previewSeed, setPreviewSeed] = useState(() => generateRandomSeed());

  const isSignedIn = !!user && !!displayName;

  // If already signed in, skip to menu
  useEffect(() => {
    if (isSignedIn && mode === 'initial') {
      setPreviewSeed(avatarSeed || generateRandomSeed());
      setMode('menu');
    }
  }, [isSignedIn]);

  const handleNameSubmit = async () => {
    if (!name.trim()) return;
    setMode('avatar');
  };

  const handleRandomize = () => {
    const newSeed = generateRandomSeed();
    setPreviewSeed(newSeed);
    playAvatarSound(newSeed);
  };

  const handleAvatarConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn(name.trim(), previewSeed);
      setMode('menu');
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleRerollInMenu = () => {
    const newSeed = generateRandomSeed();
    setPreviewSeed(newSeed);
    playAvatarSound(newSeed);
    updateAvatarSeed(newSeed);
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const code = await createGame(testMode);
      navigate(`/lobby/${code}`);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      await joinGame(joinCode.trim());
      navigate(`/lobby/${joinCode.trim().toUpperCase()}`);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const gender = getGender(previewSeed);

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100dvh' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: '3rem', marginBottom: 8 }}>🏆</div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Oscar Picks
        </h1>
        <p style={{ color: 'var(--ivory-dim)', marginTop: 8, fontSize: '0.9rem' }}>
          98th Academy Awards Prediction Game
        </p>
      </div>

      {/* Step 1: Name entry */}
      {mode === 'initial' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            className="input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            maxLength={20}
            autoFocus
          />
          <button
            className="btn-primary"
            onClick={handleNameSubmit}
            disabled={!name.trim()}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Avatar picker */}
      {mode === 'avatar' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ color: 'var(--ivory-dim)', fontSize: '0.85rem' }}>
            Choose your character, <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{name}</span>
          </div>

          <div style={{
            position: 'relative',
            padding: 4,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
            boxShadow: '0 0 30px rgba(197, 164, 78, 0.3)',
          }}>
            <div style={{
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'var(--black-card)',
              padding: 8,
            }}>
              <Avatar seed={previewSeed} size={120} />
            </div>
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--ivory-dim)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {gender === 'high' ? '♪ soprano' : '♪ baritone'}
          </div>

          <button
            className="btn-secondary"
            onClick={handleRandomize}
            style={{
              width: 'auto',
              padding: '10px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🎲</span> Randomize
          </button>

          <button
            className="btn-primary"
            onClick={handleAvatarConfirm}
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Saving...' : 'This is me!'}
          </button>
        </div>
      )}

      {/* Step 3: Game menu */}
      {mode === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Avatar + name display with re-roll */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}>
            <div
              onClick={handleRerollInMenu}
              style={{
                cursor: 'pointer',
                borderRadius: '50%',
                border: '2px solid var(--gold-dim)',
                padding: 3,
                transition: 'all var(--transition)',
                position: 'relative',
              }}
              title="Click to randomize avatar"
            >
              <Avatar seed={avatarSeed || previewSeed} size={44} />
              <div style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                background: 'var(--gold)',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
              }}>
                🎲
              </div>
            </div>
            <div style={{ color: 'var(--ivory-dim)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{displayName}</span>
            </div>
          </div>

          <button className="btn-primary" onClick={handleCreate} disabled={loading}>
            Create Game
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '0 8px',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.8rem',
              color: 'var(--ivory-dim)',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                style={{ accentColor: 'var(--gold)' }}
              />
              Test Mode
            </label>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--ivory-dim)',
            fontSize: '0.8rem',
            justifyContent: 'center',
          }}>
            <div style={{ height: 1, flex: 1, background: '#333' }} />
            <span>or join a game</span>
            <div style={{ height: 1, flex: 1, background: '#333' }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              type="text"
              placeholder="OSCAR-XXXX"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              style={{ textTransform: 'uppercase', letterSpacing: 1 }}
            />
            <button
              className="btn-secondary"
              onClick={handleJoin}
              disabled={!joinCode.trim() || loading}
              style={{ width: 'auto', padding: '12px 20px' }}
            >
              Join
            </button>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          color: 'var(--red)',
          textAlign: 'center',
          marginTop: 16,
          fontSize: '0.85rem',
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
