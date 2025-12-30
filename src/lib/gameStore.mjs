/**
 * In-memory game state store
 * For production, this would be replaced with Redis/database
 */

import { v4 as uuidv4 } from 'uuid';

// In-memory storage (resets on server restart)
// In-memory storage (resets on server restart)
export const games = new Map();

/**
 * Create a new game room
 * @param {string} roomCode - Unique room code
 * @param {string} hostName - Name of the host player
 * @returns {Object} - Game state
 */
export function createGame(roomCode, hostName) {
    const hostId = uuidv4();
    const hostToken = uuidv4();

    const game = {
        roomCode,
        hostId,
        status: 'lobby', // lobby | active | completed
        players: [
            {
                id: hostId,
                name: hostName,
                token: hostToken,
                isHost: true,
                role: null,
            }
        ],
        createdAt: Date.now(),
    };

    games.set(roomCode, game);
    return { game, hostToken };
}

/**
 * Get game by room code
 * @param {string} roomCode - Room code
 * @returns {Object|null} - Game state or null
 */
export function getGame(roomCode) {
    return games.get(roomCode) || null;
}

/**
 * Add player to game
 * @param {string} roomCode - Room code
 * @param {string} playerName - Player name
 * @returns {Object} - { success, player, error }
 */
export function joinGame(roomCode, playerName) {
    const game = games.get(roomCode);

    if (!game) {
        return { success: false, error: 'Game not found' };
    }

    if (game.status !== 'lobby') {
        return { success: false, error: 'Game already started' };
    }

    if (game.players.length >= 10) {
        return { success: false, error: 'Game is full' };
    }

    // Check for duplicate names
    if (game.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
        return { success: false, error: 'Name already taken' };
    }

    const player = {
        id: uuidv4(),
        name: playerName,
        token: uuidv4(),
        isHost: false,
        role: null,
    };

    game.players.push(player);
    return { success: true, player };
}

/**
 * Start the game and assign roles
 * @param {string} roomCode - Room code
 * @param {Array<Object>} assignedRoles - Players with roles from gameLogic
 * @returns {Object} - { success, error }
 */
export function startGame(roomCode, assignedRoles) {
    const game = games.get(roomCode);

    if (!game) {
        return { success: false, error: 'Game not found' };
    }

    if (game.players.length < 5) {
        return { success: false, error: 'Need at least 5 players' };
    }

    // Update players with assigned roles
    game.players = game.players.map(player => {
        const roleData = assignedRoles.find(r => r.id === player.id);
        return {
            ...player,
            ...roleData,
        };
    });

    game.status = 'active';
    return { success: true };
}

/**
 * Get player by token
 * @param {string} token - Player token
 * @returns {Object|null} - Player data with role info
 */
export function getPlayerByToken(token) {
    for (const game of games.values()) {
        const player = game.players.find(p => p.token === token);
        if (player) {
            return {
                player,
                gameStatus: game.status,
                roomCode: game.roomCode,
            };
        }
    }
    return null;
}

/**
 * Get player by ID (used for QR code role lookup)
 * @param {string} playerId - Player ID
 * @returns {Object|null} - Player data with role info
 */
export function getPlayerById(playerId) {
    for (const game of games.values()) {
        const player = game.players.find(p => p.id === playerId);
        if (player) {
            return {
                player,
                gameStatus: game.status,
                roomCode: game.roomCode,
            };
        }
    }
    return null;
}

/**
 * Get public game info (for lobby display)
 * @param {string} roomCode - Room code
 * @returns {Object|null} - Public game info
 */
export function getPublicGameInfo(roomCode) {
    const game = games.get(roomCode);
    if (!game) return null;

    return {
        roomCode: game.roomCode,
        status: game.status,
        playerCount: game.players.length,
        players: game.players.map(p => ({
            id: p.id,
            name: p.name,
            isHost: p.isHost,
        })),
    };
}

/**
 * Clean up old games (call periodically)
 */
export function cleanupOldGames() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [code, game] of games.entries()) {
        if (game.createdAt < oneHourAgo) {
            games.delete(code);
        }
    }
}
