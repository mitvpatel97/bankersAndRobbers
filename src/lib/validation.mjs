/**
 * Input validation utilities for socket events
 * Prevents malformed data from crashing the server
 */

export function validateCreateGame(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Invalid data format' };
    }

    const { hostName, hostId } = data;

    if (!hostName || typeof hostName !== 'string' || hostName.trim().length === 0) {
        return { valid: false, error: 'Host name is required' };
    }

    if (hostName.length > 50) {
        return { valid: false, error: 'Host name too long (max 50 characters)' };
    }

    if (!hostId || typeof hostId !== 'string' || hostId.trim().length === 0) {
        return { valid: false, error: 'Host ID is required' };
    }

    return { valid: true };
}

export function validateJoinGame(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Invalid data format' };
    }

    const { roomCode, playerId, playerName } = data;

    if (!roomCode || typeof roomCode !== 'string' || !/^[A-Z0-9]{6}$/.test(roomCode)) {
        return { valid: false, error: 'Invalid room code format' };
    }

    if (!playerId || typeof playerId !== 'string' || playerId.trim().length === 0) {
        return { valid: false, error: 'Player ID is required' };
    }

    if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
        return { valid: false, error: 'Player name is required' };
    }

    if (playerName.length > 50) {
        return { valid: false, error: 'Player name too long (max 50 characters)' };
    }

    return { valid: true };
}

export function validateRoomCode(roomCode) {
    if (!roomCode || typeof roomCode !== 'string' || !/^[A-Z0-9]{6}$/.test(roomCode)) {
        return { valid: false, error: 'Invalid room code format' };
    }
    return { valid: true };
}

export function validatePlayerId(playerId) {
    if (!playerId || typeof playerId !== 'string' || playerId.trim().length === 0) {
        return { valid: false, error: 'Player ID is required' };
    }
    return { valid: true };
}

export function validateVote(vote) {
    if (typeof vote !== 'boolean') {
        return { valid: false, error: 'Vote must be true or false' };
    }
    return { valid: true };
}

export function validatePolicyIndex(policyIdx) {
    if (typeof policyIdx !== 'number' || policyIdx < 0 || policyIdx > 2) {
        return { valid: false, error: 'Policy index must be 0, 1, or 2' };
    }
    return { valid: true };
}

export function validateExecutiveAction(action) {
    const validActions = ['INVESTIGATE_LOYALTY', 'POLICY_PEEK', 'EXECUTION', 'SPECIAL_ELECTION'];
    if (!action || typeof action !== 'string' || !validActions.includes(action)) {
        return { valid: false, error: 'Invalid executive action' };
    }
    return { valid: true };
}
