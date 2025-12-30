import { createServer } from 'http';
import { parse } from 'url';
import { randomBytes } from 'crypto';
import next from 'next';
import { Server } from 'socket.io';
import { GameRoom } from './src/lib/gameState.mjs';
import { games } from './src/lib/gameStore.mjs';
import {
    validateCreateGame,
    validateJoinGame,
    validateRoomCode,
    validatePlayerId,
    validateVote,
    validatePolicyIndex,
    validateExecutiveAction
} from './src/lib/validation.mjs';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const lobbyTimeout = parseInt(process.env.LOBBY_TIMEOUT || '30000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    const io = new Server(httpServer);

    // Track socket to player mappings for disconnect handling
    const socketToPlayer = new Map(); // socket.id -> { roomCode, playerId, playerName }

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // --- GAME LOBBY EVENTS ---

        socket.on('create_game', ({ hostName, hostId }, callback) => {
            const validation = validateCreateGame({ hostName, hostId });
            if (!validation.valid) {
                return callback({ error: validation.error });
            }

            // Generate secure 6-char room code using crypto
            const roomCode = randomBytes(4).toString('base64').replace(/[^A-Z0-9]/gi, '').substring(0, 6).toUpperCase();

            const newGame = new GameRoom(roomCode, hostName, hostId);
            games.set(roomCode, newGame);

            socket.join(roomCode);
            socketToPlayer.set(socket.id, { roomCode, playerId: hostId, playerName: hostName });
            callback({ success: true, roomCode, game: newGame });
            console.log(`Game created: ${roomCode} by ${hostName}`);
        });

        socket.on('join_game', ({ roomCode, playerId, playerName }, callback) => {
            const validation = validateJoinGame({ roomCode, playerId, playerName });
            if (!validation.valid) {
                return callback({ error: validation.error });
            }

            const room = games.get(roomCode);
            if (!room) return callback({ error: 'Room not found' });

            const result = room.addPlayer(playerId, playerName);
            if (!result.success) return callback({ error: result.error });

            socket.join(roomCode);
            socketToPlayer.set(socket.id, { roomCode, playerId, playerName });

            // Notify everyone in room about update
            io.to(roomCode).emit('game_updated', room);
            callback({ success: true, game: room });
            console.log(`${playerName} joined ${roomCode}`);
        });

        socket.on('start_game', ({ roomCode }) => {
            const validation = validateRoomCode(roomCode);
            if (!validation.valid) {
                return socket.emit('error_message', validation.error);
            }

            const room = games.get(roomCode);
            if (!room) return;

            const result = room.startGame();
            if (result.success) {
                io.to(roomCode).emit('game_updated', room);
                io.to(roomCode).emit('game_started'); // Special event for transition
            } else {
                socket.emit('error_message', result.error);
            }
        });

        // --- GAMEPLAY EVENTS ---

        socket.on('nominate_chancellor', ({ roomCode, chancellorId }) => {
            const roomValidation = validateRoomCode(roomCode);
            const playerValidation = validatePlayerId(chancellorId);

            if (!roomValidation.valid || !playerValidation.valid) {
                return socket.emit('error_message', roomValidation.error || playerValidation.error);
            }

            const room = games.get(roomCode);
            if (!room) return;

            const result = room.nominateChancellor(chancellorId);
            if (result && result.error) {
                socket.emit('error_message', result.error);
                return;
            }
            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('submit_vote', ({ roomCode, playerId, vote }) => {
            const roomValidation = validateRoomCode(roomCode);
            const playerValidation = validatePlayerId(playerId);
            const voteValidation = validateVote(vote);

            if (!roomValidation.valid || !playerValidation.valid || !voteValidation.valid) {
                return socket.emit('error_message',
                    roomValidation.error || playerValidation.error || voteValidation.error);
            }

            const room = games.get(roomCode);
            if (!room) return;

            room.registerVote(playerId, vote);
            io.to(roomCode).emit('game_updated', room);
        });

        // Legislative
        socket.on('president_discard', ({ roomCode, policyIdx }) => {
            const roomValidation = validateRoomCode(roomCode);
            const policyValidation = validatePolicyIndex(policyIdx);

            if (!roomValidation.valid || !policyValidation.valid) {
                return socket.emit('error_message',
                    roomValidation.error || policyValidation.error);
            }

            const room = games.get(roomCode);
            if (!room) return;
            room.presidentDiscard(policyIdx);
            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('chancellor_discard', ({ roomCode, policyIdx }) => {
            const roomValidation = validateRoomCode(roomCode);
            const policyValidation = validatePolicyIndex(policyIdx);

            if (!roomValidation.valid || !policyValidation.valid) {
                return socket.emit('error_message',
                    roomValidation.error || policyValidation.error);
            }

            const room = games.get(roomCode);
            if (!room) return;
            room.chancellorDiscard(policyIdx);
            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('veto_request', ({ roomCode }) => {
            const validation = validateRoomCode(roomCode);
            if (!validation.valid) {
                return socket.emit('error_message', validation.error);
            }

            const room = games.get(roomCode);
            if (!room) return;
            // Pass dummy index -1, and true for vetoRequested
            const result = room.chancellorDiscard(-1, true);
            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('veto_response', ({ roomCode, approved }) => {
            const roomValidation = validateRoomCode(roomCode);
            const voteValidation = validateVote(approved);

            if (!roomValidation.valid || !voteValidation.valid) {
                return socket.emit('error_message',
                    roomValidation.error || voteValidation.error);
            }

            const room = games.get(roomCode);
            if (!room) return;
            room.resolveVeto(approved);
            io.to(roomCode).emit('game_updated', room);
        });

        // Executive
        socket.on('executive_action', ({ roomCode, action, targetId }) => {
            const roomValidation = validateRoomCode(roomCode);
            const actionValidation = validateExecutiveAction(action);

            if (!roomValidation.valid || !actionValidation.valid) {
                return socket.emit('error_message',
                    roomValidation.error || actionValidation.error);
            }

            // targetId is optional for some actions (POLICY_PEEK), so only validate if present
            if (targetId) {
                const targetValidation = validatePlayerId(targetId);
                if (!targetValidation.valid) {
                    return socket.emit('error_message', targetValidation.error);
                }
            }

            const room = games.get(roomCode);
            if (!room) return;

            const result = room.performExecutiveAction(action, targetId);

            // Note: INVESTIGATE_LOYALTY returns secret data only to the President (sender)
            if (result && result.secretData) {
                socket.emit('investigation_result', result.secretData);
            }

            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('end_executive_action', ({ roomCode }) => {
            const validation = validateRoomCode(roomCode);
            if (!validation.valid) {
                return socket.emit('error_message', validation.error);
            }

            const room = games.get(roomCode);
            if (!room) return;
            room.finishExecutiveAction();
            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('disconnect', () => {
            const playerInfo = socketToPlayer.get(socket.id);

            if (playerInfo) {
                const { roomCode, playerId, playerName } = playerInfo;
                console.log(`Player ${playerName} (${playerId}) disconnected from ${roomCode}`);

                const room = games.get(roomCode);
                if (room) {
                    // Mark player as disconnected but don't remove them (allow reconnection)
                    const player = room.players.find(p => p.id === playerId);
                    if (player) {
                        player.connected = false;
                        player.disconnectedAt = Date.now();
                    }

                    // Notify other players in the room
                    io.to(roomCode).emit('player_disconnected', {
                        playerId,
                        playerName,
                        gameState: room
                    });

                    // If game hasn't started yet, remove player after grace period
                    if (room.status === 'LOBBY') {
                        setTimeout(() => {
                            const currentRoom = games.get(roomCode);
                            if (currentRoom) {
                                const currentPlayer = currentRoom.players.find(p => p.id === playerId);
                                if (currentPlayer && !currentPlayer.connected) {
                                    currentRoom.players = currentRoom.players.filter(p => p.id !== playerId);
                                    io.to(roomCode).emit('game_updated', currentRoom);
                                    console.log(`Removed inactive player ${playerName} from lobby ${roomCode}`);
                                }
                            }
                        }, lobbyTimeout);
                    }
                }

                socketToPlayer.delete(socket.id);
            }
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
