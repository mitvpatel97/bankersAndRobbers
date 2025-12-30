import { GameRoom } from './src/lib/gameState.mjs';

// Mock 5 players
const players = [
    { id: 'p1', name: 'Alice' },
    { id: 'p2', name: 'Bob' },
    { id: 'p3', name: 'Charlie' },
    { id: 'p4', name: 'Dave' },
    { id: 'p5', name: 'Eve' }
];

console.log('--- STARTING VERIFICATION ---');

// 1. Initialize Game
const game = new GameRoom('TEST01', 'Alice', 'p1');
players.slice(1).forEach(p => game.addPlayer(p.id, p.name));

console.log('Game initialized with 5 players.');

// 2. Start Game
const startRes = game.startGame();
if (!startRes.success) {
    console.error('Failed to start game:', startRes.error);
    process.exit(1);
}

// 3. Verify Roles
console.log('\n--- VERIFYING ROLES ---');
const robbers = game.players.filter(p => p.role === 'robber');
const masterminds = game.players.filter(p => p.role === 'mastermind');
const bankers = game.players.filter(p => p.role === 'banker');

console.log(`Bankers: ${bankers.length} (Expected 3)`);
console.log(`Robbers: ${robbers.length} (Expected 1)`);
console.log(`Mastermind: ${masterminds.length} (Expected 1)`);

if (bankers.length !== 3 || robbers.length !== 1 || masterminds.length !== 1) {
    console.error('ROLE DISTRIBUTION FAILED');
} else {
    console.log('Role distribution CORRECT.');
}

// 4. Verify Secret Knowledge
// In 5 player game: Robber knows Mastermind. Mastermind knows Robber.
const robber = robbers[0];
console.log(`\nRobber (${robber.name}) knows: Mastermind is ${robber.mastermind}`);

if (robber.mastermind !== masterminds[0].name) {
    console.error('KNOWLEDGE CHECK FAILED: Robber does not know Mastermind');
} else {
    console.log('CONFIRMED: Robber knows Mastermind.');
}

// 5. Simulate Gameplay - Enact Robber Policy for Peek
console.log('\n--- SIMULATING EXECUTIVE ACTION (PEEK) ---');
game.policies.robber = 2; // Set to 2
console.log('Forcing Robber Policies to 2. Next enactment should trigger Policy Peek (at 3).');

// Force enact policy
game.enactPolicy('robber');
console.log(`Robber Policies: ${game.policies.robber}`);
console.log(`Game Status: ${game.status} (Expected EXECUTIVE)`);
console.log(`Executive Action: ${game.executiveAction} (Expected POLICY_PEEK)`);

if (game.status === 'EXECUTIVE' && game.executiveAction === 'POLICY_PEEK') {
    const pPeek = game.performExecutiveAction('POLICY_PEEK');
    console.log('Peek Data returned:', pPeek);

    // Finish action
    game.finishExecutiveAction();
    console.log('Action finished. Status:', game.status);
} else {
    console.error('FAILED to trigger Policy Peek');
}


console.log('\n--- VERIFICATION COMPLETE ---');
