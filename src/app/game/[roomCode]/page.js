'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import GameBoard from '@/components/GameBoard';
import QRCode from 'qrcode';
import { Share2 } from 'lucide-react';

export default function GamePage({ params }) {
    const { roomCode } = use(params);
    const router = useRouter();
    const [game, setGame] = useState(null);
    const [qrCodes, setQrCodes] = useState({});
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        setBaseUrl(window.location.origin);
        const socket = getSocket();
        const playerId = localStorage.getItem('playerId');
        const playerName = localStorage.getItem('playerName');

        // Re-join logic
        if (playerId) {
            socket.emit('join_game', { roomCode, playerId, playerName }, (response) => {
                if (response.success) {
                    setGame(response.game);
                }
            });
        }

        socket.on('game_updated', (updatedGame) => {
            setGame(updatedGame);
        });

        return () => {
            socket.off('game_updated');
        };
    }, [roomCode]);

    useEffect(() => {
        if (!game || !baseUrl) return;

        const generateQRCodes = async () => {
            const codes = {};
            for (const player of game.players) {
                try {
                    const roleUrl = `${baseUrl}/role/${player.id}`;
                    const qrDataUrl = await QRCode.toDataURL(roleUrl, {
                        width: 200,
                        margin: 1,
                        color: { dark: '#00F0FF', light: '#00000000' }, // Cyan on transparent
                    });
                    codes[player.id] = qrDataUrl;
                } catch (err) {
                    console.error(err);
                }
            }
            setQrCodes(codes);
        };
        generateQRCodes();
    }, [game?.players, baseUrl]);

    if (!game) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-robber border-t-transparent rounded-full animate-spin" />
                <p className="text-robber font-mono animate-pulse">CONNECTING TO MAINFRAME...</p>
            </div>
        </div>
    );

    // Initial Phase: Show QR Codes for Role Distribution
    const showQrCodes = game.status === 'LOBBY' || (game.status === 'ELECTION' && game.policies.banker === 0 && game.policies.robber === 0 && game.electionTracker === 0 && game.logs.length < 5);

    return (
        <main className="min-h-screen bg-background text-text-primary pb-20">
            {showQrCodes && (
                <div className="p-8 pb-12 mb-8 bg-surface border-b border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-display font-bold text-white mb-2">SCAN FOR ORDERS</h1>
                            <p className="text-text-secondary">Every agent must scan their code effectively immediately.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {game.players.map((player) => (
                                <div key={player.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center gap-4 group hover:border-gold/50 transition-colors">
                                    <div className="bg-white/5 p-2 rounded-lg">
                                        {qrCodes[player.id] ? (
                                            <img src={qrCodes[player.id]} alt={player.name} className="w-32 h-32 opacity-90 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="w-32 h-32 bg-white/5 animate-pulse rounded" />
                                        )}
                                    </div>
                                    <p className="font-bold text-lg text-white group-hover:text-gold transition-colors">{player.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <GameBoard game={game} />
        </main>
    );
}
