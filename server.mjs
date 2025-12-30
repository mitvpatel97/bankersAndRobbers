import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { GameRoom } from './src/lib/gameState.mjs';
import { games } from './src/lib/gameStore.mjs';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Global game state map
// Global game state map imported from store
// const games = new Map(); // Removed in favor of shared store

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

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // --- GAME LOBBY EVENTS ---

        socket.on('create_game', ({ hostName, hostId }, callback) => {
            // Generate 6-char room code
            const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            const newGame = new GameRoom(roomCode, hostName, hostId);
            games.set(roomCode, newGame);

            socket.join(roomCode);
            callback({ success: true, roomCode, game: newGame });
            console.log(`Game created: ${roomCode} by ${hostName}`);
        });

        socket.on('join_game', ({ roomCode, playerId, playerName }, callback) => {
            const room = games.get(roomCode);
            if (!room) return callback({ error: 'Room not found' });

            const result = room.addPlayer(playerId, playerName);
            if (!result.success) return callback({ error: result.error });

            socket.join(roomCode);

            // Notify everyone in room about update
            io.to(roomCode).emit('game_updated', room);
            callback({ success: true, game: room });
            console.log(`${playerName} joined ${roomCode}`);
        });

        socket.on('start_game', ({ roomCode }) => {
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
            const room = games.get(roomCode);
            if (!room) return;

            room.registerVote(playerId, vote);
            io.to(roomCode).emit('game_updated', room);
        });

        // Legislative
        socket.on('president_discard', ({ roomCode, policyIdx }) => {
            const room = games.get(roomCode);
            if (!room) return;
            room.presidentDiscard(policyIdx);
            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('chancellor_discard', ({ roomCode, policyIdx }) => {
            const room = games.get(roomCode);
            if (!room) return;
            room.chancellorDiscard(policyIdx);
            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('veto_request', ({ roomCode }) => {
            const room = games.get(roomCode);
            if (!room) return;
            // Pass dummy index -1, and true for vetoRequested
            const result = room.chancellorDiscard(-1, true);
            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('veto_response', ({ roomCode, approved }) => {
            const room = games.get(roomCode);
            if (!room) return;
            room.resolveVeto(approved);
            io.to(roomCode).emit('game_updated', room);
        });

        // Executive
        socket.on('executive_action', ({ roomCode, action, targetId }) => {
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
            const room = games.get(roomCode);
            if (!room) return;
            room.finishExecutiveAction();
            io.to(roomCode).emit('game_updated', room);
        });

        socket.on('disconnect', () => {
            // Manage disconnections if needed
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
