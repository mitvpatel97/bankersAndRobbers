'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { BankerIcon, RobberIcon, CitySkyline, PalmTree, VHSOverlay } from '@/components/GameAssets';

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
    <>
      {/* VHS/Film Effects */}
      <VHSOverlay />

      {/* Atmospheric Background */}
      <div className={styles.backgroundLayer}>
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.glowOrb3} />
        <CitySkyline className={styles.skyline} />
        <PalmTree className={styles.palmLeft} />
        <PalmTree className={styles.palmRight} flip />
      </div>

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.logoContainer}>
            <div className={styles.iconRow}>
              <BankerIcon className={`${styles.icon} ${styles.iconBanker}`} />
              <span className={styles.vs}>VS</span>
              <RobberIcon className={`${styles.icon} ${styles.iconRobber}`} />
            </div>
            <h1 className={`title title-xl ${styles.title}`}>
              <span className="gradient-cyan neon-text-cyan">Banker</span>
              <span className={styles.ampersand}>&</span>
              <span className="gradient-pink neon-text-pink">Robber</span>
            </h1>
            <p className={styles.tagline}>
              Midnight LA • Social Deduction
            </p>
            <p className={styles.subtitle}>
              5-10 Players • Trust No One
            </p>
          </div>

          <div className={styles.description}>
            <div className={styles.teamCard}>
              <BankerIcon className={styles.teamIcon} />
              <h3>The Vault</h3>
              <p>Protect the city&apos;s assets. Hunt down the criminals before the heist succeeds.</p>
            </div>
            <div className={styles.teamCard}>
              <RobberIcon className={styles.teamIcon} />
              <h3>The Crew</h3>
              <p>Execute the perfect heist. Get your Mastermind into power.</p>
            </div>
          </div>

          {!showJoinForm && !showCreateForm ? (
            <div className={styles.actionButtons}>
              <button
                className="btn btn-primary btn-large"
                onClick={() => setShowCreateForm(true)}
              >
                Start Heist
              </button>
              <button
                className="btn btn-secondary btn-large"
                onClick={() => setShowJoinForm(true)}
              >
                Join Crew
              </button>
            </div>
          ) : showCreateForm ? (
            <form className={styles.form} onSubmit={handleCreateGame}>
              <h2 className="title title-md">Initialize Operation</h2>
              <input
                type="text"
                className="input"
                placeholder="Enter your codename..."
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
                  Abort
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isCreating}
                >
                  {isCreating ? 'Connecting...' : 'Launch'}
                </button>
              </div>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleJoinGame}>
              <h2 className="title title-md">Join Operation</h2>
              <input
                type="text"
                className="input"
                placeholder="Operation code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                style={{ textTransform: 'uppercase', letterSpacing: '6px', textAlign: 'center', fontSize: '1.2rem' }}
                autoFocus
              />
              <input
                type="text"
                className="input"
                placeholder="Your codename..."
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
                  Abort
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isJoining}
                >
                  {isJoining ? 'Infiltrating...' : 'Infiltrate'}
                </button>
              </div>
            </form>
          )}
        </div>

        <footer className={styles.footer}>
          <p>A midnight social deduction experience</p>
        </footer>
      </main>
    </>
  );
}
