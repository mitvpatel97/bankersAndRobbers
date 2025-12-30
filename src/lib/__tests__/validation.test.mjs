import {
    validateCreateGame,
    validateJoinGame,
    validateRoomCode,
    validatePlayerId,
    validateVote,
    validatePolicyIndex,
    validateExecutiveAction
} from '../validation.mjs';

describe('Validation Functions', () => {
    describe('validateCreateGame', () => {
        test('should validate correct create game data', () => {
            const result = validateCreateGame({
                hostName: 'Alice',
                hostId: 'abc123'
            });
            expect(result.valid).toBe(true);
        });

        test('should reject missing host name', () => {
            const result = validateCreateGame({
                hostId: 'abc123'
            });
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
        });

        test('should reject empty host name', () => {
            const result = validateCreateGame({
                hostName: '   ',
                hostId: 'abc123'
            });
            expect(result.valid).toBe(false);
        });

        test('should reject host name exceeding 50 characters', () => {
            const result = validateCreateGame({
                hostName: 'a'.repeat(51),
                hostId: 'abc123'
            });
            expect(result.valid).toBe(false);
            expect(result.error).toContain('too long');
        });

        test('should reject missing host ID', () => {
            const result = validateCreateGame({
                hostName: 'Alice'
            });
            expect(result.valid).toBe(false);
        });
    });

    describe('validateJoinGame', () => {
        test('should validate correct join game data', () => {
            const result = validateJoinGame({
                roomCode: 'ABC123',
                playerId: 'player1',
                playerName: 'Bob'
            });
            expect(result.valid).toBe(true);
        });

        test('should reject invalid room code format', () => {
            const result = validateJoinGame({
                roomCode: 'invalid',
                playerId: 'player1',
                playerName: 'Bob'
            });
            expect(result.valid).toBe(false);
        });

        test('should reject player name exceeding 50 characters', () => {
            const result = validateJoinGame({
                roomCode: 'ABC123',
                playerId: 'player1',
                playerName: 'a'.repeat(51)
            });
            expect(result.valid).toBe(false);
        });
    });

    describe('validateRoomCode', () => {
        test('should validate correct 6-character room code', () => {
            const result = validateRoomCode('ABC123');
            expect(result.valid).toBe(true);
        });

        test('should reject room code with incorrect length', () => {
            const result = validateRoomCode('ABC12');
            expect(result.valid).toBe(false);
        });

        test('should reject room code with lowercase letters', () => {
            const result = validateRoomCode('abc123');
            expect(result.valid).toBe(false);
        });

        test('should reject room code with special characters', () => {
            const result = validateRoomCode('ABC-23');
            expect(result.valid).toBe(false);
        });
    });

    describe('validateVote', () => {
        test('should validate true vote', () => {
            const result = validateVote(true);
            expect(result.valid).toBe(true);
        });

        test('should validate false vote', () => {
            const result = validateVote(false);
            expect(result.valid).toBe(true);
        });

        test('should reject non-boolean vote', () => {
            const result = validateVote('yes');
            expect(result.valid).toBe(false);
        });
    });

    describe('validatePolicyIndex', () => {
        test('should validate index 0', () => {
            const result = validatePolicyIndex(0);
            expect(result.valid).toBe(true);
        });

        test('should validate index 1', () => {
            const result = validatePolicyIndex(1);
            expect(result.valid).toBe(true);
        });

        test('should validate index 2', () => {
            const result = validatePolicyIndex(2);
            expect(result.valid).toBe(true);
        });

        test('should reject negative index', () => {
            const result = validatePolicyIndex(-1);
            expect(result.valid).toBe(false);
        });

        test('should reject index greater than 2', () => {
            const result = validatePolicyIndex(3);
            expect(result.valid).toBe(false);
        });
    });

    describe('validateExecutiveAction', () => {
        test('should validate INVESTIGATE_LOYALTY action', () => {
            const result = validateExecutiveAction('INVESTIGATE_LOYALTY');
            expect(result.valid).toBe(true);
        });

        test('should validate POLICY_PEEK action', () => {
            const result = validateExecutiveAction('POLICY_PEEK');
            expect(result.valid).toBe(true);
        });

        test('should validate EXECUTION action', () => {
            const result = validateExecutiveAction('EXECUTION');
            expect(result.valid).toBe(true);
        });

        test('should validate SPECIAL_ELECTION action', () => {
            const result = validateExecutiveAction('SPECIAL_ELECTION');
            expect(result.valid).toBe(true);
        });

        test('should reject invalid action', () => {
            const result = validateExecutiveAction('INVALID_ACTION');
            expect(result.valid).toBe(false);
        });

        test('should reject lowercase action', () => {
            const result = validateExecutiveAction('execution');
            expect(result.valid).toBe(false);
        });
    });
});
