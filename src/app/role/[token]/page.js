'use client';

import { useEffect, useState, use } from 'react';
import { getSocket } from '@/lib/socket';
import PlayerController from '@/components/PlayerController';

export default function RolePage({ params }) {
    const { token } = use(params); // token is playerId
    const [roleData, setRoleData] = useState(null);
    const [game, setGame] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Executive Action Local State
    const [actionResult, setActionResult] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch Role & Room Code
                const res = await fetch(`/api/role/${token}`);
                const data = await res.json();

                if (!data.success) {
                    setError(data.error);
                    setLoading(false);
                    return;
                }

                setRoleData(data.player);

                // Connect Socket
                const socket = getSocket();
                socket.emit('join_game', {
                    roomCode: data.roomCode,
                    playerId: token,
                    playerName: data.player.name
                }, (response) => {
                    if (response.success) {
                        setGame(response.game);
                        setLoading(false);
                    }
                });

                socket.on('game_updated', (updatedGame) => {
                    setGame(updatedGame);
                    // Reset local action state on phase change
                    if (updatedGame.status !== 'EXECUTIVE') {
                        setActionResult(null);
                    }
                });

                socket.on('investigation_result', (result) => {
                    setActionResult(result);
                });

                return () => {
                    socket.off('game_updated');
                    socket.off('investigation_result');
                };

            } catch (err) {
                console.error(err);
                setError('Connection failed');
                setLoading(false);
            }
        };

        if (token) init();
    }, [token]);

    // --- HANDLERS ---

    // Helper to get socket (safe inside handler as init handles connection)
    const getSocketInstance = () => getSocket();

    const handleNominate = (candidateId) => {
        getSocketInstance().emit('nominate_chancellor', { roomCode: game.roomCode, chancellorId: candidateId });
    };

    const handleVote = (vote) => {
        getSocketInstance().emit('submit_vote', { roomCode: game.roomCode, playerId: token, vote });
    };

    const handleDiscard = (policyIdx, isChancellor) => {
        const event = isChancellor ? 'chancellor_discard' : 'president_discard';
        getSocketInstance().emit(event, { roomCode: game.roomCode, policyIdx });
    };

    const handleVetoRequest = () => {
        getSocketInstance().emit('veto_request', { roomCode: game.roomCode });
    };

    const handleVetoResponse = (approved) => {
        getSocketInstance().emit('veto_response', { roomCode: game.roomCode, approved });
    };

    const handleExecutiveAction = (action, targetId = null) => {
        getSocketInstance().emit('executive_action', { roomCode: game.roomCode, action, targetId });
    };

    const handleEndExecutiveAction = () => {
        getSocketInstance().emit('end_executive_action', { roomCode: game.roomCode });
        setActionResult(null);
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="animate-pulse">Accessing Secure Channel...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p>{error}</p>
            </div>
        </div>
    );

    if (!game) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="animate-pulse">Waiting for uplink...</div>
        </div>
    );

    return (
        <PlayerController
            game={game}
            roleData={roleData}
            playerId={token}
            onNominate={handleNominate}
            onVote={handleVote}
            onDiscard={handleDiscard}
            onVetoRequest={handleVetoRequest}
            onVetoResponse={handleVetoResponse}
            onExecutiveAction={handleExecutiveAction}
            onEndExecutiveAction={handleEndExecutiveAction}
            executiveResult={actionResult}
        />
    );
}
