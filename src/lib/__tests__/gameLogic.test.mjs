import { assignRoles, shuffle } from '../gameLogic.mjs';

describe('Game Logic', () => {
    describe('assignRoles', () => {
        test('should assign correct roles for 5 players', () => {
            const players = [
                { id: '1', name: 'Player 1' },
                { id: '2', name: 'Player 2' },
                { id: '3', name: 'Player 3' },
                { id: '4', name: 'Player 4' },
                { id: '5', name: 'Player 5' }
            ];

            const result = assignRoles(players);

            const bankers = result.filter(p => p.role === 'banker');
            const robbers = result.filter(p => p.role === 'robber');
            const masterminds = result.filter(p => p.role === 'mastermind');

            expect(bankers.length).toBe(3);
            expect(robbers.length).toBe(1);
            expect(masterminds.length).toBe(1);
        });

        test('should assign correct roles for 7 players', () => {
            const players = Array.from({ length: 7 }, (_, i) => ({
                id: String(i + 1),
                name: `Player ${i + 1}`
            }));

            const result = assignRoles(players);

            const bankers = result.filter(p => p.role === 'banker');
            const robbers = result.filter(p => p.role === 'robber');
            const masterminds = result.filter(p => p.role === 'mastermind');

            expect(bankers.length).toBe(4);
            expect(robbers.length).toBe(2);
            expect(masterminds.length).toBe(1);
        });

        test('should assign correct roles for 10 players', () => {
            const players = Array.from({ length: 10 }, (_, i) => ({
                id: String(i + 1),
                name: `Player ${i + 1}`
            }));

            const result = assignRoles(players);

            const bankers = result.filter(p => p.role === 'banker');
            const robbers = result.filter(p => p.role === 'robber');
            const masterminds = result.filter(p => p.role === 'mastermind');

            expect(bankers.length).toBe(6);
            expect(robbers.length).toBe(3);
            expect(masterminds.length).toBe(1);
        });

        test('should provide secret knowledge to robbers in 5-player game', () => {
            const players = Array.from({ length: 5 }, (_, i) => ({
                id: String(i + 1),
                name: `Player ${i + 1}`
            }));

            const result = assignRoles(players);

            const robber = result.find(p => p.role === 'robber');
            const mastermind = result.find(p => p.role === 'mastermind');

            expect(robber.mastermind).toBe(mastermind.name);
            expect(robber.allies).toContain(mastermind.name);
        });

        test('should not reveal allies to mastermind in large games', () => {
            const players = Array.from({ length: 7 }, (_, i) => ({
                id: String(i + 1),
                name: `Player ${i + 1}`
            }));

            const result = assignRoles(players);

            const mastermind = result.find(p => p.role === 'mastermind');

            // In 7+ player games, mastermind doesn't know allies
            expect(mastermind.allies).toHaveLength(0);
        });

        test('should assign unique roles to all players', () => {
            const players = Array.from({ length: 8 }, (_, i) => ({
                id: String(i + 1),
                name: `Player ${i + 1}`
            }));

            const result = assignRoles(players);

            result.forEach(player => {
                expect(['banker', 'robber', 'mastermind']).toContain(player.role);
            });
        });
    });

    describe('shuffle', () => {
        test('should return array with same length', () => {
            const arr = [1, 2, 3, 4, 5];
            const shuffled = shuffle([...arr]);

            expect(shuffled.length).toBe(arr.length);
        });

        test('should contain all original elements', () => {
            const arr = [1, 2, 3, 4, 5];
            const shuffled = shuffle([...arr]);

            arr.forEach(item => {
                expect(shuffled).toContain(item);
            });
        });

        test('should not mutate original array', () => {
            const arr = [1, 2, 3, 4, 5];
            const original = [...arr];
            shuffle(arr);

            expect(arr).toEqual(original);
        });
    });
});
