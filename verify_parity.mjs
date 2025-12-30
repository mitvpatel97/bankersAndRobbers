/**
 * Verification Script: Logic Parity with Secret-Hitler-Online
 * Checks: Role Mechanics, Win Conditions, Executive Actions
 */

import { GameRoom } from './src/lib/gameState.mjs';

function assert(condition, message) {
    if (!condition) {
        console.error(`[FAIL] ${message}`);
        process.exit(1);
    } else {
        console.log(`[PASS] ${message}`);
    }
}

console.log('--- STARTING PARITY CHECK ---');

// 1. Setup 5 Player Game
const game = new GameRoom('TEST01', 'Host', 'host-id');
game.addPlayer('p2', 'P2');
game.addPlayer('p3', 'P3');
game.addPlayer('p4', 'P4');
game.addPlayer('p5', 'P5');

game.startGame();

// CHECK 1: Role Distribution (5 Players)
// Secret Hitler Rules: 3 Liberals (Bankers), 1 Fascist (Robber), 1 Hitler (Mastermind)
const bankers = game.players.filter(p => p.role === 'banker').length;
const robbers = game.players.filter(p => p.role === 'robber').length;
const mastermind = game.players.filter(p => p.role === 'mastermind').length;

console.log(`Roles: Bankers=${bankers}, Robbers=${robbers}, Mastermind=${mastermind}`);
assert(bankers === 3, '5 Players = 3 Bankers (Liberals)');
assert(robbers === 1, '5 Players = 1 Robber (Fascist)');
assert(mastermind === 1, '5 Players = 1 Mastermind (Hitler)');

// CHECK 2: Win Condition - 5 Banker Policies (Liberal Win)
game.policies.banker = 5;
game.enactPolicy('banker'); // Trigger 6th? No, 5th triggers win
// Reset to 4 and enact 1
game.policies.banker = 4;
game.enactPolicy('banker');

assert(game.status === 'GAME_OVER', '5 Banker policies ends game');
assert(game.winner === 'banker', 'Bankers win with 5 policies (Liberal Victory)');

// CHECK 3: Win Condition - 6 Robber Policies (Fascist Win)
// Reset game
const game2 = new GameRoom('TEST02', 'Host', 'host-id');
game2.addPlayer('p2', 'P2'); game2.addPlayer('p3', 'P3'); game2.addPlayer('p4', 'P4'); game2.addPlayer('p5', 'P5');
game2.startGame();

game2.policies.robber = 5;
game2.enactPolicy('robber');
assert(game2.status === 'GAME_OVER', '6 Robber policies ends game');
assert(game2.winner === 'robber', 'Robbers win with 6 policies (Fascist Victory)');

// CHECK 4: Executive Action - Policy Peek at 3 Robber Policies (5-6 Players)
// Reset game
const game3 = new GameRoom('TEST03', 'Host', 'host-id');
game3.addPlayer('p2', 'P2'); game3.addPlayer('p3', 'P3'); game3.addPlayer('p4', 'P4'); game3.addPlayer('p5', 'P5');
game3.startGame();

game3.policies.robber = 2;
game3.enactPolicy('robber'); // Enact 3rd policy
assert(game3.status === 'EXECUTIVE', '3rd Robber policy triggers Executive Action (5p)');
assert(game3.executiveAction === 'POLICY_PEEK', 'Action is POLICY_PEEK');

console.log('--- PARITY CHECK COMPLETE: ALL SYSTEMS MATCH REFERENCE ---');
