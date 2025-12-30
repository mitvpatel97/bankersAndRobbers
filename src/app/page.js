'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');

  /* Socket.io Integration */
  const { getSocket } = require('@/lib/socket');

  const handleCreateGame = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsCreating(true);
    setError('');

    const socket = getSocket();

    // Generate a temporary host ID client-side or let server handle
    const hostId = crypto.randomUUID();

    socket.emit('create_game', { hostName: playerName.trim(), hostId }, (response) => {
      if (response.success) {
        localStorage.setItem('playerId', hostId);
        localStorage.setItem('playerName', playerName.trim());
        router.push(`/lobby/${response.roomCode}`);
      } else {
        setError(response.error || 'Failed to create game');
        setIsCreating(false);
      }
    });
  };

  const handleJoinGame = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return setError('Enter room code');
    if (!playerName.trim()) return setError('Enter name');

    setIsJoining(true);
    setError('');

    const socket = getSocket();
    const playerId = crypto.randomUUID();

    socket.emit('join_game', {
      roomCode: joinCode.trim().toUpperCase(),
      playerId,
      playerName: playerName.trim()
    }, (response) => {
      if (response.success) {
        localStorage.setItem('playerId', playerId);
        localStorage.setItem('playerName', playerName.trim());
        router.push(`/lobby/${response.game.roomCode}`);
      } else {
        setError(response.error || 'Failed to join game');
        setIsJoining(false);
      }
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.logoContainer}>
          <div className={styles.iconRow}>
            <span className={styles.icon}>🏦</span>
            <span className={styles.vs}>vs</span>
            <span className={styles.icon}>🎭</span>
          </div>
          <h1 className={`title title-xl ${styles.title}`}>
            <span className="gradient-gold">Banker</span>
            <span className={styles.ampersand}>&</span>
            <span className="gradient-crimson">Robber</span>
          </h1>
          <p className={styles.tagline}>
            The ultimate social deduction game for 5-10 players
          </p>
        </div>

        <div className={styles.description}>
          <div className={styles.teamCard}>
            <div className={`${styles.teamIcon} ${styles.bankerIcon}`}>🏦</div>
            <h3>Bankers</h3>
            <p>Protect the vault. Find the robbers before it&apos;s too late.</p>
          </div>
          <div className={styles.teamCard}>
            <div className={`${styles.teamIcon} ${styles.robberIcon}`}>🎭</div>
            <h3>Robbers</h3>
            <p>Execute the heist. Get the Mastermind into power.</p>
          </div>
        </div>

        {!showJoinForm && !showCreateForm ? (
          <div className={styles.actionButtons}>
            <button
              className="btn btn-primary btn-large"
              onClick={() => setShowCreateForm(true)}
            >
              Create Game
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => setShowJoinForm(true)}
            >
              Join Game
            </button>
          </div>
        ) : showCreateForm ? (
          <form className={styles.form} onSubmit={handleCreateGame}>
            <h2 className="title title-md">Create New Game</h2>
            <input
              type="text"
              className="input"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              autoFocus
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formButtons}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setShowCreateForm(false); setError(''); }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Game'}
              </button>
            </div>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleJoinGame}>
            <h2 className="title title-md">Join Game</h2>
            <input
              type="text"
              className="input"
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              style={{ textTransform: 'uppercase', letterSpacing: '4px', textAlign: 'center' }}
              autoFocus
            />
            <input
              type="text"
              className="input"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formButtons}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setShowJoinForm(false); setError(''); }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isJoining}
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </button>
            </div>
          </form>
        )}
      </div>

      <footer className={styles.footer}>
        <p>A social deduction party game • 5-10 players</p>
      </footer>
    </main>
  );
}
