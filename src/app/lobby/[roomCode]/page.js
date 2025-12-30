'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import Lobby from '@/components/Lobby';

export default function LobbyPage({ params }) {
    const { roomCode } = use(params);
    const router = useRouter();
    const [game, setGame] = useState(null);
    const [error, setError] = useState('');
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        const socket = getSocket();

        // Ensure we are joined to the room
        const playerId = localStorage.getItem('playerId');
        const playerName = localStorage.getItem('playerName');

        // Re-join if needed (e.g. after refresh)
        if (playerId && playerName) {
            socket.emit('join_game', { roomCode, playerId, playerName }, (response) => {
                if (response.success) {
                    setGame(response.game);
                } else {
                    setError(response.error);
                }
            });
        }

        // Listen for updates
        socket.on('game_updated', (updatedGame) => {
            setGame(updatedGame);
        });

        socket.on('game_started', () => {
            router.push(`/game/${roomCode}`);
        });

        socket.on('error_message', (msg) => {
            alert(msg);
            setIsStarting(false);
        });

        return () => {
            socket.off('game_updated');
            socket.off('game_started');
            socket.off('error_message');
        };
    }, [roomCode, router]);

    const handleStartGame = () => {
        if (!game || game.players.length < 5) return;

        setIsStarting(true);
        const socket = getSocket();
        socket.emit('start_game', { roomCode });
    };

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-surface p-8 rounded-2xl border border-robber text-center max-w-md w-full">
                    <h1 className="text-3xl text-robber font-bold mb-4">Connection Failed</h1>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <button
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                        onClick={() => router.push('/')}
                    >
                        Return to Base
                    </button>
                </div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-banker border-t-transparent rounded-full animate-spin" />
                    <p className="text-banker font-mono animate-pulse">ESTABLISHING SECURE LINK...</p>
                </div>
            </div>
        );
    }

    const playerId = typeof window !== 'undefined' ? localStorage.getItem('playerId') : null;
    const isHost = game.hostId === playerId;

    return (
        <Lobby
            roomCode={roomCode}
            players={game.players}
            isHost={isHost}
            onStartGame={handleStartGame}
        />
    );
}
