/**
 * Banker and Robber - Core Game State Machine
 * Handles all logic for the Secret Hitler clone
 */

import { v4 as uuidv4 } from 'uuid';
import { shuffleArray, assignRoles } from './gameLogic.mjs';

// Game Constants
const POLICY_BANKER = 'banker';
const POLICY_ROBBER = 'robber';

// Role Config used for setup
const ROLE_CONFIG = {
    5: { bankers: 3, robbers: 1, mastermind: 1 },
    6: { bankers: 4, robbers: 1, mastermind: 1 },
    7: { bankers: 4, robbers: 2, mastermind: 1 },
    8: { bankers: 5, robbers: 2, mastermind: 1 },
    9: { bankers: 5, robbers: 3, mastermind: 1 },
    10: { bankers: 6, robbers: 3, mastermind: 1 },
};

export class GameRoom {
    constructor(roomCode, hostName, hostId) {
        this.roomCode = roomCode;
        this.status = 'LOBBY'; // LOBBY, ELECTION, LEGISLATIVE, EXECUTIVE, GAME_OVER
        this.createdAt = Date.now();
        this.logs = [`Game created by ${hostName}`];

        // Players and Identity
        this.players = []; // Array of { id, name, role, isAlive, connected }
        this.hostId = hostId;

        // Game State variables
        this.policies = {
            banker: 0,
            robber: 0
        };
        this.electionTracker = 0; // 0-3 (failure count)
        this.deck = []; // Policy draw pile
        this.discard = []; // Policy discard pile

        // Turn State
        this.presidentIdx = -1; // Index in players array
        this.chancellorId = null; // ID of nominated/elected chancellor
        this.lastChancellorId = null; // For eligibility checks
        this.lastPresidentId = null; // For eligibility checks

        // Executive Action States
        this.peekedPolicies = null; // For Policy Peek
        this.specialElectionReturnIdx = null; // For Special Election return
        this.vetoUnlocked = false; // Unlocks at 5 Robber policies
        this.vetoRequested = false; // During Legislative session

        // Voting
        this.votes = {}; // Map { playerId: true/false }
        this.voteStatus = 'WAITING'; // WAITING, CLOSED (revealing)

        // Legislative
        this.drawnPolicies = []; // 3 drawn cards
        this.hand = []; // Cards in hand (president or chancellor)
        this.vetoRequested = false;

        // Add host as first player
        this.addPlayer(hostId, hostName);
    }

    // --- LOBBY METHODS ---

    addPlayer(id, name) {
        if (this.status !== 'LOBBY') return { success: false, error: 'Game already started' };
        if (this.players.length >= 10) return { success: false, error: 'Room full' };
        if (this.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            return { success: false, error: 'Name taken' };
        }

        this.players.push({
            id,
            name,
            role: null,
            isAlive: true,
            connected: true
        });
        this.addLog(`${name} joined the lobby`);
        return { success: true };
    }

    startGame() {
        if (this.players.length < 5) return { success: false, error: 'Need 5+ players' };

        // 1. Assign Roles
        this.assignRoles();

        // 2. Setup Deck (11 Robber, 6 Banker)
        this.resetDeck();

        // 3. Randomize starting President
        this.presidentIdx = Math.floor(Math.random() * this.players.length);

        this.status = 'ELECTION';
        this.addLog(`Game started! ${this.players[this.presidentIdx].name} is the first Presidential Candidate.`);

        return { success: true };
    }

    assignRoles() {
        // Use the robust logic from gameLogic.mjs
        this.players = assignRoles(this.players);
        this.addLog('Roles assigned. Check your secret identity!');
    }

    resetDeck() {
        this.deck = [
            ...Array(11).fill(POLICY_ROBBER),
            ...Array(6).fill(POLICY_BANKER)
        ];
        this.deck = shuffleArray(this.deck);
        this.discard = [];
        this.addLog('Policy deck shuffled');
    }

    // --- ELECTION PHASE ---

    nominateChancellor(chancellorId) {
        if (this.status !== 'ELECTION') return { error: 'Wrong phase' };
        const president = this.getCurrentPresident();

        // Basic validation
        if (chancellorId === president.id) return { error: 'Cannot nominate self' };

        // Term limits
        if (chancellorId === this.lastChancellorId) return { error: 'Term limited (was Chancellor)' };
        if (this.players.length > 5 && chancellorId === this.lastPresidentId) return { error: 'Term limited (was President)' };

        const nominee = this.getPlayer(chancellorId);
        if (!nominee || !nominee.isAlive) return { error: 'Invalid nominee' };

        this.chancellorId = chancellorId;
        this.votes = {}; // Reset votes
        this.addLog(`${president.name} nominated ${nominee.name} for Chancellor`);
        return { success: true };
    }

    registerVote(playerId, vote) { // vote is boolean (true=Ja, false=Nein)
        // Validate player is allowed to vote
        const player = this.getPlayer(playerId);
        if (!player || !player.isAlive) return;

        this.votes[playerId] = vote;

        // Check if everyone has voted
        const livingPlayers = this.players.filter(p => p.isAlive);
        if (Object.keys(this.votes).length === livingPlayers.length) {
            this.resolveElection();
        }
    }

    resolveElection() {
        const jaVotes = Object.values(this.votes).filter(v => v).length;
        const neinVotes = Object.values(this.votes).filter(v => !v).length;
        const passed = jaVotes > neinVotes;

        const chancellor = this.getPlayer(this.chancellorId);

        this.addLog(`Election results: ${jaVotes} Ja - ${neinVotes} Nein`);

        if (passed) {
            this.addLog(`Government elected! President: ${this.getCurrentPresident().name}, Chancellor: ${chancellor.name}`);
            this.electionTracker = 0;
            this.lastChancellorId = this.chancellorId;
            this.lastPresidentId = this.getCurrentPresident().id;

            // CHECK WIN CONDITION: Mastermind elected functionality
            if (this.policies.robber >= 3 && chancellor.role === 'mastermind') {
                this.status = 'GAME_OVER';
                this.winner = 'robber';
                this.winReason = 'Mastermind elected Chancellor';
                this.addLog('GAME OVER: The Mastermind has been elected Chancellor! Robbers win!');
                return;
            }

            this.startLegislativeSession();
        } else {
            this.addLog('Government rejected.');
            this.electionTracker++;

            if (this.electionTracker === 3) {
                this.addLog('Three failed elections. Chaos enacted!');
                this.enactTopPolicy();
                this.electionTracker = 0;
                this.lastChancellorId = null; // Reset term limits on chaos
                this.lastPresidentId = null;
                this.advancePresident();
            } else {
                this.advancePresident();
            }
        }
    }

    // --- LEGISLATIVE PHASE ---

    startLegislativeSession() {
        this.status = 'LEGISLATIVE';

        // Draw 3 cards
        if (this.deck.length < 3) {
            this.deck = shuffleArray([...this.deck, ...this.discard]);
            this.discard = [];
            this.addLog('Deck reshuffled');
        }

        this.drawnPolicies = this.deck.splice(0, 3);
        this.hand = [...this.drawnPolicies]; // Currently held by President
        this.turnStep = 'PRESIDENT_DISCARD'; // PRESIDENT_DISCARD -> CHANCELLOR_DISCARD
    }

    presidentDiscard(policyToDiscardIdx) {
        if (this.turnStep !== 'PRESIDENT_DISCARD') return;

        // Remove selected card (by index 0, 1, or 2)
        const discarded = this.hand.splice(policyToDiscardIdx, 1)[0];
        this.discard.push(discarded);

        this.turnStep = 'CHANCELLOR_DISCARD';
        this.addLog('President discarded a policy');
    }

    chancellorDiscard(policyToDiscardIdx, vetoRequested = false) {
        if (this.turnStep !== 'CHANCELLOR_DISCARD') return;

        // Veto Logic
        if (vetoRequested && this.vetoUnlocked) {
            this.vetoRequested = true;
            this.addLog('Chancellor requested a Veto!');
            // Return specific state to prompt President?
            return { vetoRequested: true };
        }

        const discarded = this.hand.splice(policyToDiscardIdx, 1)[0];
        this.discard.push(discarded);

        // Enact the last remaining card
        const policyToEnact = this.hand[0];
        this.enactPolicy(policyToEnact);
    }

    resolveVeto(approved) {
        if (!this.vetoRequested) return;

        if (approved) {
            this.addLog('President accepted the Veto. Policies discarded.');
            this.discard.push(...this.hand); // Discard both
            this.hand = [];
            this.vetoRequested = false;
            this.electionTracker++;

            if (this.electionTracker === 3) {
                this.addLog('Three failed elections (Veto). Chaos enacted!');
                this.enactTopPolicy();
                this.electionTracker = 0;
                this.lastChancellorId = null;
                this.lastPresidentId = null;
                this.advancePresident();
            } else {
                this.advancePresident();
            }
        } else {
            this.addLog('President declined the Veto. Chancellor must discard.');
            this.vetoRequested = false;
            // Chancellor must now choose. 
            // NOTE: The UI should force the Chancellor to pick a card if Veto is declined.
        }
    }

    enactPolicy(type) {
        this.policies[type]++;
        this.addLog(`${type === POLICY_BANKER ? 'Banker' : 'Robber'} Policy Enacted`);

        // Win Conditions
        if (this.policies.banker === 5) {
            this.gameOver('banker', '5 Banker policies enacted');
            return;
        }
        if (this.policies.robber === 6) {
            this.gameOver('robber', '6 Robber policies enacted');
            return;
        }

        // Executive Actions Check (only on Robber policies)
        if (type === POLICY_ROBBER) {
            // Veto Unlock Check
            if (this.policies.robber === 5) {
                this.vetoUnlocked = true;
                this.addLog('Veto Power unlocked for future sessions!');
            }

            const action = this.getExecutiveAction(this.policies.robber);
            if (action) {
                this.status = 'EXECUTIVE';
                this.executiveAction = action;
                this.addLog(`Presidential Power Unlocked: ${action}`);
                return; // Pause here for action
            }
        }

        // Default: Next Round
        this.advancePresident();
    }

    enactTopPolicy() {
        if (this.deck.length < 1) {
            this.deck = shuffleArray([...this.deck, ...this.discard]);
            this.discard = [];
        }
        const policy = this.deck.shift();
        this.enactPolicy(policy);
    }

    // --- EXECUTIVE ACTIONS ---

    getExecutiveAction(robberCount) {
        const playerCount = this.players.length;

        // Standard board (5-6 players) or variants can be adjusted
        // Using simplified "standard" rules from Secret Hitler:
        // 3 Policies: Policy Peek (5-6 use Policy Peek)
        // 4 Policies: Execution
        // 5 Policies: Execution + Veto Power unlock

        if (robberCount === 3 && playerCount <= 6) return 'POLICY_PEEK';
        if (robberCount === 3 && playerCount > 6) return 'SPECIAL_ELECTION'; // Or Check Loyalty, rules vary by count

        // Assuming standard rules for 5-10 players:
        // 1: -
        // 2: - 
        // 3: Policy Peek (5-6) / Investigate Loyalty (7-8) / Investigate Loyalty (9-10)
        // 4: Execution (5-6) / Special Election (7-8) / Investigate Loyalty (9-10)
        // 5: Execution (All) + Veto

        // Implementing a simplified set for MVP "Banker & Robber":
        if (robberCount === 1) return null;
        if (robberCount === 2) return 'INVESTIGATE_LOYALTY'; // Added earlier for fun
        if (robberCount === 3 && playerCount <= 6) return 'POLICY_PEEK';
        if (robberCount === 3 && playerCount > 6) return 'SPECIAL_ELECTION';
        if (robberCount === 4) return 'EXECUTION';
        if (robberCount === 5) return 'EXECUTION';

        return null;
    }

    performExecutiveAction(actionType, targetId) {
        const president = this.getCurrentPresident();
        // Validate action...

        switch (actionType) {
            case 'EXECUTION':
                const target = this.getPlayer(targetId);
                target.isAlive = false;
                this.addLog(`${president.name} executed ${target.name}`);
                if (target.role === 'mastermind') {
                    this.gameOver('banker', 'Mastermind was executed!');
                    return;
                }
                break;

            case 'INVESTIGATE_LOYALTY': // Only returns team, not role
                const investigated = this.getPlayer(targetId);
                this.addLog(`${president.name} investigated ${investigated.name}`);
                // Return secret data, do NOT advance round yet. User must click "Done".
                return { secretData: investigated.role === 'banker' ? 'Banker' : 'Robber' };

            case 'POLICY_PEEK':
                this.peekedPolicies = this.deck.slice(0, 3);
                this.addLog(`${president.name} peeked at the top 3 policies`);
                // Return secret data, do NOT advance.
                return { secretData: this.peekedPolicies };

            case 'SPECIAL_ELECTION':
                // Set the specific player as the next presidential candidate
                // This bypasses the normal rotation for ONE turn
                const nominee = this.getPlayer(targetId);
                this.specialElectionReturnIdx = this.presidentIdx; // Remember where we were

                // Find index of nominee
                const nomineeIdx = this.players.findIndex(p => p.id === targetId);
                this.presidentIdx = nomineeIdx; // Set new president

                this.addLog(`Special Election! ${president.name} nominated ${nominee.name} as President`);
                this.status = 'ELECTION';
                this.chancellorId = null;
                this.votes = {};
                this.executiveAction = null;
                return; // Return early, do not autoskip to next boolean turn
        }

        // End executive action
        this.status = 'ELECTION';
        this.executiveAction = null;
        this.advancePresident();
    }

    finishExecutiveAction() {
        if (this.status !== 'EXECUTIVE') return;

        this.status = 'ELECTION';
        this.executiveAction = null;
        this.peekedPolicies = null;
        this.advancePresident();
        this.addLog('Executive action completed. Next round starting...');
    }

    advancePresident() {
        this.status = 'ELECTION';

        // Check if returning from Special Election
        if (this.specialElectionReturnIdx !== null) {
            this.presidentIdx = this.specialElectionReturnIdx;
            this.specialElectionReturnIdx = null;
        }

        // Find next living player
        let nextIdx = (this.presidentIdx + 1) % this.players.length;
        while (!this.players[nextIdx].isAlive) {
            nextIdx = (nextIdx + 1) % this.players.length;
        }

        this.presidentIdx = nextIdx;
        this.chancellorId = null;
        this.votes = {};

        this.addLog(`New Round: ${this.getCurrentPresident().name} is the Presidential Candidate`);
    }

    getPlayer(id) {
        return this.players.find(p => p.id === id);
    }

    getCurrentPresident() {
        return this.players[this.presidentIdx];
    }

    addLog(msg) {
        this.logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
    }

    gameOver(winner, reason) {
        this.status = 'GAME_OVER';
        this.winner = winner;
        this.winReason = reason;
        this.addLog(`GAME OVER. ${winner.toUpperCase()} wins! (${reason})`);
    }
}
